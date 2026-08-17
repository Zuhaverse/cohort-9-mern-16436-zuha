require("dotenv").config();

const cors = require("cors");
const loggerMiddleware = require("./middleware/loggerMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware.js")

const logger = require("./logger/logger.js");
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes.js");

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(loggerMiddleware);
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/auth", authRoutes);
app.use("/api/notes",noteRoutes);

app.use(errorMiddleware);


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