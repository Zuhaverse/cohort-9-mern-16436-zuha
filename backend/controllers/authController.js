const authService = require("../services/authService");
const logger = require("../logger/logger")

async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body ?? {};
        const result = await authService.registerUser({name, email, password});
        res.status(201).json(result);
    } catch (error) {

        if (error.message === "Email already exists") {
          return res.status(409).json({
            message: "Email already exists",
          });
        }

        if (
            error.message === "All fields are required" ||
            error.message === "Invalid email format" ||
            error.message === "Password must be at least 6 characters"
          ) {
            return res.status(400).json({
              message: error.message,
            });
          }
    
        logger.error(error, "Registration failed");
    
        res.status(500).json({
          message: "Internal server error",
        });
      }}

      async function loginUser(req, res) {
        try {
          const { email, password } = req.body;
      
          const result = await authService.loginUser({
            email,
            password,
          });
      
          res.status(200).json(result);
      
        } catch (error) {
      
          if (
            error.message === "Invalid credentials" ||
            error.message === "All fields are required" ||
            error.message === "Invalid email format"
          ) {
            return res.status(400).json({
              message: error.message,
            });
          }
      
          logger.error(error, "Login failed");
      
          res.status(500).json({
            message: "Internal server error",
          });
        }
      }
module.exports = { registerUser, loginUser };