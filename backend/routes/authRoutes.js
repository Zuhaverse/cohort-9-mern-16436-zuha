
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");


const { registerUser, loginUser } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/protected", authMiddleware, (req, res) => {
    res.status(200).json({
      message: "Protected route accessed successfully",
      user: req.user,
    });
  });


module.exports = router;