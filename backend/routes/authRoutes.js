const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { validateRegister, validateLogin } = require("../middleware/validationMiddleware");
const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController");


router.post("/register",validateRegister, registerUser);
router.post("/login",validateLogin, loginUser);
router.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({
      message: "Protected route accessed successfully",
      user: req.user,
    });
  });
  router.get("/me", authMiddleware, getCurrentUser);


module.exports = router;