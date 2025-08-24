const express = require("express");
const router = express.Router();
const { signup, loginUser } = require("./authController");

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post("/signup", signup);

// @route   POST /api/auth/login
// @desc    Login user and return HTTP-only cookie
// @access  Public
router.post("/login", loginUser);

module.exports = router;
