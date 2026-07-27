const bcrypt = require("bcrypt")

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

    logger.error(error, "Registration service failed");

    throw new Error("Registration failed");
  }
}
module.exports = {
  registerUser,
};