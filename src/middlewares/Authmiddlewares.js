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
    console.log("Decoded Token:", decoded);

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).send('Invalid Token');
  }
};


const isStaff = (req, res, next) => {
  if (!req.user || req.user.payload.role !== "STAFF") {
    return res.status(403).json({ message: "Access denied. Only STAFF can access this." });
  }
  next();
};


const isTeacher = (req, res, next) => {
  if (!req.user || req.user.payload.role !== "TEACHER") {
    return res.status(403).json({ message: "Access denied. Only TEACHERS can access this." });
  }
  next();
};

module.exports = { authMiddleware, isStaff, isTeacher };
