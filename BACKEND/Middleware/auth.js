const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    console.log('TOKEN:', token);

    if(!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied. Please login first."
      });
    }
    // Token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = verifyToken;