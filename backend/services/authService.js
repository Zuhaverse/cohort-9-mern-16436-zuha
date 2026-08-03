const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userModel = require("../models/userModel")
const logger = require("../logger/logger")

async function registerUser(userData) {
  let { name, email, password } = userData;

  // Validation first
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  name = name.trim();
  email = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  try {
    logger.info("Registration attempt");

    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      logger.warn("Registration failed: Email already exists");
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.createUser(name, email, hashedPassword);

    logger.info("Registration successful");

    return {
      message: "User registered successfully",
    };

  } catch (error) {
    if (error.message === "Email already exists") {
      throw error;
    }

    if (error.code === "ER_DUP_ENTRY") {
      logger.warn("Registration failed: Email already exists");
      throw new Error("Email already exists");
    }

    logger.error(error, "Registration service failed");

    throw new Error("Registration failed");
  }
}

async function loginUser(userData) {
  try {
    let { email, password } = userData;

    if (!email || !password) {
      throw new Error("All fields are required");
    }

    email = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    logger.info("Login attempt");

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      logger.warn("Invalid credentials");
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn("Invalid credentials");
      throw new Error("Invalid credentials");
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

    logger.info("Login successful");

    return {
      token,
    };

  } catch (error) {

    if (
      error.message === "Invalid credentials" ||
      error.message === "All fields are required" ||
      error.message === "Invalid email format"
    ) {
      throw error;
    }

    logger.error(error, "Login service failed");
    throw new Error("Login failed");
  }
}

module.exports = {
  registerUser,
  loginUser,
};