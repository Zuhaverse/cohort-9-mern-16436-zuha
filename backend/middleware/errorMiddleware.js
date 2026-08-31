const logger = require("../logger/logger");

function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;

  logger.error(
    {
      err,
      status,
      method: req.method,
      url: req.originalUrl,
    },
    "Request failed"
  );

  return res.status(status).json({
    success: false,
    message: status >= 500 ? "Internal Server Error" : err.message,
    data: null,
  });
}

module.exports = errorMiddleware;