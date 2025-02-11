const express = require('express'); 
const { createUser, signinUser, updateUser, deleteUser, getallUser, detailUser, reprovideToken, verifyOtp } = require('../controllers/UserControllers');    
const router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/Authmiddlewares');


router.get('/', (req, res) => {
  res.send('API đang chạy trên router này');
});

router.post('/signup', createUser);

router.post('/signin', signinUser);

router.put('/update/:id', authMiddleware, updateUser);

router.delete('/delete/:id', authMiddleware, isAdmin, deleteUser);

router.get('/getallusers', authMiddleware, isAdmin, getallUser);

router.get('/detailuser/:id', detailUser);


router.post('/token', reprovideToken)


router.post('/verify-otp', verifyOtp);


module.exports = router;
