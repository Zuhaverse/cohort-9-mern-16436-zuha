const pinoHttp = require("pino-http");
const logger = require("../logger/logger");

const loggerMiddleware = pinoHttp({
    logger,
    redact: ["req.headers.authorization",
        "req.headers.cookie",
    ]
})

module.exports = loggerMiddleware;