const authService = require("../services/authService");

async function registerUser(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: null,
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res) {
  return res.status(200).json({
    success: true,
    authenticated: true,
    data: {
      user: req.user,
    },
  });
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
