const pinoHttp = require("pino-http");

const loggerMiddleware = pinoHttp()

module.exports = loggerMiddleware;