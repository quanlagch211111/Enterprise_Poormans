const User = require('../models/Users');
const bcrypt = require('bcrypt');
const  { generalAccessToken, generalRefreshToken, generalIsNotVerifyToken } = require('../services/Jwtservices');
const {sendOtp} = require('../services/Otpservices');
const StudentService = require('../services/studentService');
const TutorService = require('../services/tutorService');
const StaffService = require('../services/staffService');
const { verify } = require('jsonwebtoken');

const createUser = (userData) => {
  return new Promise(async (resolve, reject) => {
    const { username, email, password, address, phone } = userData;
    try {
      const checkemailUser = await User.findOne({ email: email });
      if (checkemailUser !== null) {
        return resolve({
          status: 'Failure',
          message: 'This email address is already in use'
        });
      }

      const passwordhash = bcrypt.hashSync(password, 10);
      console.log("Hashed password: " + passwordhash);


      const newUser = await User.create({
        username,
        email,
        password: passwordhash,
        address,
        phone,
        isVerified : false 
      });
      await sendOtp(email);


      if (newUser) {
        resolve({
          status: 'Success',
          message: 'User created successfully',
          data: newUser
        });

      }
    } catch (err) {
      reject({
        status: 'Error',
        message: err.message
      });
    }
  });
};

const signinUser = (userData) => {
  return new Promise( async (resolve, reject) => {
    const { email, password} = userData;
    try {
      const user = await User.findOne({ email: email})
      if (user == null) {
        return resolve({
          status: 'ERROR',
          message: 'There was no user with that email'
        });
      }

      if (user.isVerified == false) {
        const isVerifiedToken = await generalIsNotVerifyToken({
          id : user.id,
          email: user.email,
          verify: user.isVerified
        }); 
        return resolve({
          status: 'NEED_VERIFICATION',
          message: 'This account has not been verified',
          isVerifiedToken
        });
      }

      const comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword){
        resolve({
          status: 'ERROR',
          message: 'this is wrong password'
        })
      }

      let role = null;

    switch (true) {
      case await StudentService.isStudent(user._id):
        role = "STUDENT";
        break;
      case await TutorService.isTutor(user._id):
        role = "TUTOR";
        break;
      case await StaffService.isStaff(user._id):
        role = "STAFF";
        break;
      default:
        role = "UNKNOWN";
        break;
    }

      const accesstoken = await generalAccessToken({
        id : user.id,
        role: role
      }); 

      const refreshtoken = await generalRefreshToken({
        id : user.id,
        role: role
      })

        resolve({
          status: 'SUCCESS',
          message: 'Login successful',
          accesstoken,
          refreshtoken,
          user
        })

    }catch (err) {
      reject(err);
    }  
  });
};


const updateUser = (id, datauser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(id);
      if (!checkUser) {
        return resolve({
          status: "Failure",
          message: "There was no user with that id",
        });
      }

      if (datauser.password) {
        const salt = await bcrypt.genSalt(10);
        datauser.password = await bcrypt.hash(datauser.password, salt);
      }

      datauser.updated_at = new Date();

      const updatedUser = await User.findByIdAndUpdate(id, datauser, { new: true });
      console.log("Updated user:", updatedUser);

      resolve({
        status: "Success",
        message: "User updated successfully",
        data: updatedUser,
      });

    } catch (err) {
      reject({
        status: "Error",
        message: err.message,
      });
    }
  });
};




const deleteUser = (id) => {
  return new Promise( async (resolve, reject) => {
    try {

       const checkUser = await User.findById(id);
       if (!checkUser) {
         resolve({
           status: 'Failure',
           message: 'There was no user with that id'
         });
       }

        await User.findOneAndDelete(id);

       resolve({
         status: 'Success',
         message: 'User updated successfully'
       });
 
     } catch (err) {
       reject({
         status: 'Error',
         message: err.message
       });
     }
   });
};



const getallUser = () => {
  return new Promise( async (resolve, reject) => {
    try {

       const allUsers = await User.find();

       if (!allUsers) {
         resolve({
           status: 'Failure',
           message: 'There was no user '
         });
       }

       resolve({
         status: 'Success',
         message: 'get all User successfully',
         data: allUsers
       });
 
     } catch (err) {
       reject({
         status: 'Error',
         message: err.message
       });
     }
   });
};


const detailUser = (id) => {
  return new Promise( async (resolve, reject) => {
    try {

       const user = await User.findById(id);

       if (!user) {
         resolve({
           status: 'Failure',
           message: 'There was no user '
         });
       }

       resolve({
         status: 'Success',
         message: 'get all User successfully',
         data: user
       });
 
     } catch (err) {
       reject({
         status: 'Error',
         message: err.message
       });
     }
   });
};

const updateUserByEmail  = (email, datauser) => {
  return new Promise( async (resolve, reject) => {
    try {

       const checkUser = await User.findById(id);
       if (!checkUser) {
         resolve({
           status: 'Failure',
           message: 'There was no user with that id'
         });
       }

       if (datauser.password) {
         const salt = await bcrypt.genSalt(10);
         datauser.password = await bcrypt.hash(datauser.password, salt);
       }
 
       datauser.updated_at = new Date();

       const updatedUser = await User.findByIdAndUpdate(id, datauser, {new : true});
       console.log('Updated user' + updatedUser);
 
       resolve({
         status: 'Success',
         message: 'User updated successfully',
         data: updatedUser
       });
 
     } catch (err) {
       reject({
         status: 'Error',
         message: err.message
       });
     }
   });
};

const resetPassword = async (email, newPassword) => {
  try {
      if (!email || !newPassword) {
          throw new BadRequestError(
              "Email and new password are required"
          );
      }

      const user = await User.findOne({ email });
      if (!user) {
          throw new NotFoundError("User not found");
      }

      if (bcrypt.compareSync(newPassword, user.password)) {
          throw new BadRequestError(
              "New password cannot be the same as the old password"
          );
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedNewPassword;
      await user.save();

      return {
          status: "Success",
          message: "Password reset successfully",
      };
  } catch (err) {
      console.error("Error resetting password");
      throw err;
  }
};






module.exports = {
  createUser, signinUser, updateUser, deleteUser, getallUser,detailUser, resetPassword
};