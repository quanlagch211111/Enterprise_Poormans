const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (tokenType = "access") => (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).send("A token is required for authentication");
  }

  const tokenWithoutBearer = token.split(" ")[1];

  if (!tokenWithoutBearer) {
    return res.status(403).send("A token is required for authentication");
  }

  let secret;
  switch (tokenType) {
    case "access":
      secret = process.env.ACCESS_TOKEN;
      break;
    case "reset-password":
      secret = process.env.PASSWORD_RESET_TOKEN;
      break;
    case "refresh":
      secret = process.env.REFRESH_TOKEN;
      break;
    default:
      throw new Error("Invalid token type");
  }

  let decoded;
  try {
    decoded = jwt.verify(tokenWithoutBearer, secret);
    req.user = decoded;
    console.log("Decoded Token:", decoded);
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).send("Invalid Token");
  }
};



const isStaff = (req, res, next) => {
  if (!req.user || req.user.payload.role !== "STAFF") {
    return res.status(403).json({ message: "Access denied. Only STAFF can access this." });
  }
  next();
};


const isTeacher = (req, res, next) => {
  if (!req.user || req.user.payload.role !== "TUTOR") {
    return res.status(403).json({ message: "Access denied. Only TEACHERS can access this." });
  }
  next();
};

module.exports = { authMiddleware, isStaff, isTeacher };
