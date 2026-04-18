const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");

const signToken = (id, expiresIn = "3d") =>
  jwt.sign({ id }, env.jwtSecret, { expiresIn });

const signup = asyncHandler(async (req, res) => {
  const { name, user, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    user,
    email,
    password: hashedPassword,
  });

  const token = signToken(newUser._id, "30d");

  res.status(201).json({
    _id: newUser._id,
    name: newUser.name,
    user: newUser.user,
    email: newUser.email,
    token,
  });
});

const login = asyncHandler(async (req, res) => {
  const { user, password } = req.body;

  const foundUser = await User.findOne({ user });

  if (!foundUser) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await foundUser.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken(foundUser._id);

  res.json({
    _id: foundUser._id,
    user: foundUser.user,
    name: foundUser.name,
    email: foundUser.email,
    token,
  });
});

const protectedRoute = asyncHandler(async (_req, res) => {
  res.json({ message: "You have access to this protected route" });
});

module.exports = { signup, login, protectedRoute };
