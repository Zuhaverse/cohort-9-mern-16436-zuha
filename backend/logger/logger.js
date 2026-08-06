const pino = require("pino");

const logger = pino({
  level: "info",
  redact: {
    paths: [
      "email",
      "*.email",
      "user.email",
      "req.body.email",
      "req.user.email",
      "err.email",

      "password",
      "*.password",
      "req.body.password",
      "token",
      "*.token",
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    censor: "[REDACTED]",
  },
});

module.exports = logger;