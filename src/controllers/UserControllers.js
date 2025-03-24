const UserService = require('../services/Userservices');
const StudentService = require('../services/studentService');
const TutorService = require('../services/tutorService');
const StaffService = require('../services/staffService');
const {provideToken, generalResetPasswordToken} = require('../services/Jwtservices');
const UserOTPVerification = require('../models/UserOTPVerification');
const TokenService = require('../services/Blacklisttokenservice');
const {sendOtp} = require('../services/Otpservices');
const OtpUser = require('../models/UserOTPVerification');



exports.createUser = async (req, res) => {
  try {
    const { username, email, password, address, phone, role, additionalInfo } = req.body;

    // Kiểm tra input
    if (!username || !email || !password || !address || !phone || !role) {
      return res.status(400).json({ status: 'Error', message: 'All fields are required' });
    }

    // Regex kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 'Error', message: 'Invalid email format' });
    }

    // Gọi `UserService.createUser` và chờ kết quả
    const userResponse = await UserService.createUser({ username, email, password, address, phone });

    // Nếu UserService trả về thất bại, trả luôn response
    if (userResponse.status !== 'Success') {
      return res.status(400).json(userResponse);
    }

    // Lấy user từ kết quả
    const newUser = userResponse.data;

    // Xử lý role bằng switch-case
    switch (role.toLowerCase()) {
      case 'student':
        await StudentService.createStudent({ user_id: newUser._id, ...additionalInfo });
        break;
      case 'tutor':
        await TutorService.createTutor({ user_id: newUser._id, ...additionalInfo });
        break;
      case 'staff':
        await StaffService.createStaff({ user_id: newUser._id, ...additionalInfo });
        break;
      default:
        return res.status(400).json({ status: 'Error', message: 'Invalid role. Allowed roles: student, tutor, staff' });
    }

    return res.status(201).json({ message: 'User created. Please verify your email with OTP.' });

  } catch (err) {
    return res.status(500).json({ status: 'Error', message: err.message });
  }
};



exports.signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Kiểm tra email hợp lệ bằng regex
    const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const isEmailValid = reg.test(email);

    if (!email || !password) {
      return res.status(400).json({
        status: 'Error',
        message: 'All input fields are required',
      });
    } 
    
    if (!isEmailValid) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid email format',
      });
    }

    const response = await UserService.signinUser(req.body);
    const { refreshtoken, ...userData } = response;


    res.cookie('refreshtoken', refreshtoken, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production',
    });

    // Trả về thông tin người dùng
    return res.status(200).json(userData);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



exports.updateUser = async (req, res) => {
  try {
      const userid = req.params.id;
      const datauser = req.body;

      if (!userid ){
        return res.status(400).json({message: 'this Id is required'});
      }

      const response = await UserService.updateUser(userid, datauser);
    return res.status(200).json(response)
} catch(err) {
  return res.status(400).json({message: err.message});
}

}




exports.deleteUser = async (req, res) => {
  try {
    const userid = req.params.id;
    console.log(userid);

    if (!userid ){
      return res.status(400).json({message: 'this Id is required'});
    }

    const response = await UserService.deleteUser(userid);
  return res.status(200).json(response)
} catch(err) {
return res.status(400).json({message: err.message});
}
};


exports.getallUser = async (req, res) => {
  try {
    const response = await UserService.getallUser();
  return res.status(200).json(response)
} catch(err) {
return res.status(400).json({message: err.message});
}
};

exports.detailUser = async (req, res) => {
  try {
    const userid = req.params.id;
    if (!userid){
      return res.status(400).json({
        message: 'this Id is required'
      })
    }
    const response = await UserService.detailUser(userid);
  return res.status(200).json(response)
} catch(err) {
return res.status(400).json({message: err.message});
}
};


exports.reprovideToken = async (req, res) => {
  console.log('Cookies:', req.cookies); // In ra toàn bộ cookie

  try {
    const token = req.cookies.refreshtoken;

    if (!token) {
      return res.status(401).send('Refresh Token is required');
    }

    // Kiểm tra xem refresh token có bị blacklist không
    const isBlacklisted = await TokenService.isTokenBlacklisted(
          refreshToken
    );
    if (isBlacklisted) {
           return res.status(403).send("Refresh Token is blacklisted");
    }
    


    const response = await provideToken(token);
    if (response.status === 'ERROR') {
      return res.status(403).send(response.message);
    }

    return res.status(200).json({
      message: "Refresh token is valid",
      accessToken: response.accessToken
    });
  } catch (err) {
    res.status(403).send('Invalid Refresh Token');
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Received OTP:", otp);

    const otpRecord = await UserOTPVerification.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP record not found" });
    }

    console.log("Stored OTP:", otpRecord.otp);

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }


   const userId = otpRecord.userId;
   await UserService.updateUser(userId, { isVerified: true });
   await UserOTPVerification.deleteOne({ email });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.logoutUser = async(req, res, next) => {
  try {
      const refreshToken = req.cookies.refreshtoken;

      if (!refreshToken) {
          return res
              .status(400)
              .json({ message: "No refresh token provided" });
      }
      await TokenService.addToBlacklist(refreshToken);

      res.clearCookie("refreshtoken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
      console.error("Error logging out user");
      next(err);
  }
};


exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    await sendOtp(email);

    res.status(200).json({
        status: "Success",
        message:
            "OTP sent to your email. Please verify to reset your password.",
    });
} catch (err) {
    console.error("Error requesting password reset");
    next(err);
}
};

exports.verifyPasswordResetOtp = async (req, res, next) => {
  try {
      const { email, otp } = req.body;

      console.log("Received OTP:", otp);

      const otpRecord = await OtpUserawait.findOne({ email });
      if (!otpRecord) {
          return res
              .status(400)
              .json({ message: "OTP record not found" });
      }

      console.log("Stored OTP:", otpRecord.otp);

      if (otpRecord.otp !== otp) {
          return res.status(400).json({ message: "Invalid OTP" });
      }

      if (otpRecord.expiresAt < new Date()) {
          return res.status(400).json({ message: "OTP has expired" });
      }

      await OtpUser.deleteMany({ email });

      const resettoken = await generalResetPasswordToken({
          email: email,
      });
      console.log("Reset token: ", resettoken);

      return res.status(200).json({
          message: "Email verified successfully",
          resettoken: resettoken,
      });
  } catch (err) {
      console.error("Error verifying password reset OTP");
      next(err);
  }
};

exports.resetPassword = async(req, res, next) => {
  try {
      const { newPassword } = req.body;
      const payload = req.user.payload;

      if (!newPassword) {
          throw new BadRequestError("New password is required");
      }

      // // Verify payload before allowing password reset
      if (!payload) {
        console.log("ERRORERROR ");
      } else {
          console.log("new Password: ", newPassword);
      }

      const result = await UserService.resetPassword(
          payload.email,
          newPassword
      );

      res.status(200).json({
          status: "Success",
          message: result.message,
      });
  } catch (err) {
      console.error("Error verifying OTP and resetting password");
      next(err);
  }
};
