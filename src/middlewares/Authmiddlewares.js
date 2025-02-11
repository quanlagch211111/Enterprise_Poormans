const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  const tokenWithoutBearer = token.split(' ')[1];

  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.ACCESS_TOKEN);

    req.user = decoded;

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).send('Invalid Token');
  }
};

const isAdmin = (req, res, next) => {

  if (!req.user || !req.user.payload || !req.user.payload.isAdmin) {
    return res.status(403).send('Access denied. Admins only');
  }

  next();
};

const checkUser = (req, res, next) => {
  const userid = req.params.id;

  if (userid !== req.user.payload.userid) {
    return res.status(403).send('Access denied');
  }
    next();
};



module.exports = { authMiddleware, isAdmin, checkUser };
