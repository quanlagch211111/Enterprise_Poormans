const express = require('express'); 
const { createUser, signinUser, updateUser, deleteUser, 
  getallUser,getAllUserForChat,getUsersWithRoles, detailUser, reprovideToken, verifyOtp, logoutUser,
   requestPasswordReset, verifyPasswordResetOtp, resetPassword  } = require('../controllers/UserControllers');    
const router = express.Router();
const { authMiddleware, isStaff, isTeacher} = require('../middlewares/Authmiddlewares');


router.get('/', (req, res) => {
  res.send('API đang chạy trên router này');
});

router.post('/signup', createUser);

router.post('/signin', signinUser);

router.put('/update/:id', authMiddleware("access"), updateUser);

router.delete('/delete/:id', authMiddleware("access"),isStaff, deleteUser);

router.get('/getallusers', authMiddleware("access"),isStaff,  getallUser);

router.get('/getuserwithroles', authMiddleware("access"), isStaff, getUsersWithRoles);

router.get('/detailuser/:id',authMiddleware("access"), detailUser);

router.get('/getuserforchat/:id', authMiddleware("access"),  getAllUserForChat);



router.post('/token', reprovideToken)


router.post('/verify-otp', verifyOtp);

router.post("/logout", logoutUser);


router.post("/request-reset-password", requestPasswordReset);

router.post(
  "/verify-password-reset-otp",
  verifyPasswordResetOtp
);

router.post(
    "/reset-password",
    authMiddleware("reset-password"),
    resetPassword
);


module.exports = router;
