const UserService = require('../services/Userservices')
const {provideToken} = require('../services/Jwtservices')
const UserOTPVerification = require('../models/UserOTPVerification')
const {generateOtp, sendOtpEmail} = require('../services/Otpservices')




exports.createUser = async (req, res) => {
  try {
    const { username, email, password, address, phone } = req.body;
    const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const Ischeckemail = reg.test(email);

    if (!username || !email || !password || !address || !phone ) {
      return res.status(404).json({
        status: 'Error',
        message: 'The input is required'
      })}
      else if (!Ischeckemail){
        return res.status(404).json({
          status: 'Error',
          message: 'The input is email'
      })}
      const response = await UserService.createUser({ username, email, password, address, phone, isVerified: false });
      console.log(response);

    //   const otp = generateOtp();
    //   const otpExpiration = Date.now() + 5 * 60 * 1000;

    //   await UserOTPVerification.findOneAndUpdate(
    //     { userId: response.data.id }, 
    //     {
    //         email : email,
    //         otp,
    //         expiresAt: otpExpiration,
    //         createAt: Date.now()
    //     },
    //     { upsert: true, new: true }
    // );
    

    //       try {
    //         await sendOtpEmail(email, otp);
    //     } catch (err) {
    //         console.error("Error sending OTP email:", err.message);
    //         return res.status(500).json({ message: "Failed to send OTP. Please try again." });
    //     }

      return res.status(200).json({ message: 'User created. Please verify your email with OTP.' });
  
} catch(err) {
  return res.status(400).json({message: err.message});
}
}



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

