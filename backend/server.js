const loggerMiddleware = require("./middleware/loggerMiddleware");

require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(loggerMiddleware);

app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.listen(port, () => {
    const logger = require("./logger/logger");

  logger.info(`Server running on port ${port}`);
});