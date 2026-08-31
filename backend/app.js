require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const loggerMiddleware = require("./middleware/loggerMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

app.use(loggerMiddleware);
app.use(express.json());

const frontendUrl = process.env.FRONTEND_URL;

if (process.env.NODE_ENV === "production" && !frontendUrl) {
  throw new Error("FRONTEND_URL must be set in production");
}

app.use(
  cors({
    origin: frontendUrl || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use(errorMiddleware);

module.exports = app;