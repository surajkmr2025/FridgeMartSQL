const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token = req.cookies?.token || bearerToken;

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
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

module.exports = verifyToken;
