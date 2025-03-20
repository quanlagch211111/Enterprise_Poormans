const express = require('express'); 
const { createUser, signinUser, updateUser, deleteUser, getallUser, detailUser, reprovideToken, verifyOtp, logoutUser } = require('../controllers/UserControllers');    
const router = express.Router();
const { authMiddleware, isStaff} = require('../middlewares/Authmiddlewares');


router.get('/', (req, res) => {
  res.send('API đang chạy trên router này');
});

router.post('/signup', createUser);

router.post('/signin', signinUser);

router.put('/update/:id', authMiddleware, updateUser);

router.delete('/delete/:id', authMiddleware,isStaff, deleteUser);

router.get('/getallusers', authMiddleware,isStaff,  getallUser);

router.get('/detailuser/:id', detailUser);


router.post('/token', reprovideToken)


router.post('/verify-otp', verifyOtp);

router.post("/logout", logoutUser);


module.exports = router;
