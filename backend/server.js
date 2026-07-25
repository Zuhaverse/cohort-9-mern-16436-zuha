const loggerMiddleware = require("./middleware/loggerMiddleware");
const logger = require("./logger/logger.js");
const db = require("./config/db");

require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(loggerMiddleware);

app.get('/', (req, res) => {
    res.send('Backend is running');
});

async function connectDatabase() {
  try {
    const connection = await db.getConnection();
    logger.info("Database connected successfully");
    connection.release();
  } catch (error) {
    logger.error(error, "Database connection failed");
    process.exit(1);
  }
}

connectDatabase();

app.listen(port, () => {
    const logger = require("./logger/logger");

  logger.info(`Server running on port ${port}`);
});