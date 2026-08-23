require("dotenv").config();

const logger = require("./logger/logger");
const db = require("./config/db");
const app = require("./app");

const port = process.env.PORT || 5000;

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
  try {
    await connectDatabase();

    const server = app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });

    server.on("error", (error) => {
      logger.error(error, "Server failed to start");
      process.exit(1);
    });
  } catch (error) {
    logger.error(error, "Application startup failed");
    process.exit(1);
  }
}

startServer();