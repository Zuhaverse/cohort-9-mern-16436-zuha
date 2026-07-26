const loggerMiddleware = require("./middleware/loggerMiddleware");
const logger = require("./logger/logger.js");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes")

require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(loggerMiddleware);
app.use(express.json());
app.use("/api/auth", authRoutes);


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


async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
}
startServer();