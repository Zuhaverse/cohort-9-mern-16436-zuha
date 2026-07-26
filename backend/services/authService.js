const bcrypt = require("bcrypt")

const userModel = require("../models/userModel")
const logger = require("../logger/logger")

async function registerUser(userData) {
    const {name, email, password} = userData;
    
  logger.info(`Registration attempt: ${email}`);

  const existingUser = await userModel.findUserByEmail(email);

  if (existingUser) {
    logger.warn(`Registration failed: ${email} already exists`);

    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userModel.createUser(
    name,
    email,
    hashedPassword
  );

  logger.info(`Registration successful: ${email}`);

  return {
    message: "User registered successfully",
  };
}

module.exports = {
  registerUser,
};