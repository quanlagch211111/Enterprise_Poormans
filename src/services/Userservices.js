const User = require('../models/Users');
const bcrypt = require('bcrypt');
const  { generalAccessToken, generalRefreshToken } = require('../services/Jwtservices');

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
      if(user == null) {
        resolve({
          status: 'OK',
          message: 'There was not a user with that email'
        })
      }
      const comparePassword = bcrypt.compareSync(password, user.password);

      if (!comparePassword){
        resolve({
          status: 'OK',
          message: 'this is wrong password'
        })
      }

      const accesstoken = await generalAccessToken({
        id : user.id,
        isAdmin : user.isAdmin
      }); 

      const refreshtoken = await generalRefreshToken({
        id : user.id,
        isAdmin : user.isAdmin
      })

        resolve({
          status: 'success',
          message: 'Login successful',
          accesstoken,
          refreshtoken
        })

    }catch (err) {
      reject(err);
    }  
  });
};


const updateUser = (id, datauser) => {
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






module.exports = {
  createUser, signinUser, updateUser, deleteUser, getallUser,detailUser
};
