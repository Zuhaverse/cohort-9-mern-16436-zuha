const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const logger = require("../logger/logger");

async function registerUser(userData) {
  const { name, email, password } = userData;

  try {
    logger.info({ email }, "Registration attempt");

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      logger.warn({ email }, "Registration failed: Email already exists");

      const error = new Error("Email already exists");
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.createUser(name, email, hashedPassword);

    logger.info({ email }, "Registration successful");

    return {
      message: "User registered successfully",
    };
  } catch (error) {
    if (error.status) {
      throw error;
    }

    if (error.code === "ER_DUP_ENTRY") {
      logger.warn({ email }, "Registration failed: Email already exists");

      const duplicateError = new Error("Email already exists");
      duplicateError.status = 400;
      throw duplicateError;
    }

    logger.error(error, "Registration service failed");
    throw error;
  }
}

async function loginUser(userData) {
  const { email, password } = userData;

  try {
    logger.info({ email }, "Login attempt");

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      logger.warn({ email }, "Invalid credentials");

      const error = new Error("Invalid credentials");
      error.status = 400;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn({ email }, "Invalid credentials");

      const error = new Error("Invalid credentials");
      error.status = 400;
      throw error;
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    logger.info({ email }, "Login successful");

    return { token };
  } catch (error) {
    if (error.status) {
      throw error;
    }

    logger.error(error, "Login service failed");
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser,
};