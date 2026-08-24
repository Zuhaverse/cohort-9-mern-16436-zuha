const jwt = require("jsonwebtoken");
const logger = require("../logger/logger");

function authMiddleware(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    logger.warn(
      { error: error.message },
      "Invalid or expired token"
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      data: null,
    });
  }
}

module.exports = authMiddleware;