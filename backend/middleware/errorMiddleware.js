const logger = require("../logger/logger");


function errorMiddleware(err, req, res, next){
    logger.error(err);
    const status = err.status || 500;

    return res.status(status).json({
      success: false,
      message:
        status >= 500
          ? "Internal Server Error"
          : err.message,
    });
}

module.exports = errorMiddleware;