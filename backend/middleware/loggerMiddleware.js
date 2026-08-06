const pinoHttp = require("pino-http");
const logger = require("../logger/logger");

const loggerMiddleware = pinoHttp({ logger });

module.exports = loggerMiddleware;