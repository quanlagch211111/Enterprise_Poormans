const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();


const generalAccessToken = async (payload) => {
  const accessToken = jwt.sign({
    payload 
  }, process.env.ACCESS_TOKEN , { expiresIn: '30m' });

  return accessToken;
}

const generalResetPasswordToken = async (payload) => {
  const accessToken = jwt.sign({
    payload 
  }, process.env.PASSWORD_RESET_TOKEN , { expiresIn: '10m' });

  return accessToken;
}



const generalRefreshToken = async (payload) => {
    console.log(payload);
  
    const refreshToken = jwt.sign({
      payload 
    }, process.env.REFRESH_TOKEN , { expiresIn: '365d' });
  
    return refreshToken;
  }

  const generalIsNotVerifyToken = async (payload) => {
    console.log(payload);
  
    const isNotVerifyToken = jwt.sign({
      payload 
    }, process.env.REFRESH_TOKEN , { expiresIn: '10m' });
  
    return isNotVerifyToken;
  }

  const provideToken = (token) => {
    return new Promise( async (resolve, reject) => {
      try {
        jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
          if (err) {
            return resolve({
              status: 'ERROR',
              message: "Invalid refresh token"
            });
          }


          const newAccessToken = await generalAccessToken({
            id: user.id,
            isAdmin: user.isAdmin
          });
  
          resolve({
            status: 'Success',
            accessToken: newAccessToken
          });
        });
      }catch (err) {
         reject({
           status: 'Error',
           message: err.message
         });
       }
     });
  };
  




module.exports = {
  generalAccessToken , generalRefreshToken, provideToken, generalResetPasswordToken, generalIsNotVerifyToken
};

