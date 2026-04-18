const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");

const saveBmi = asyncHandler(async (req, res) => {
  const { weight, height, gender, bmiCategory, bmi } = req.body;

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const newBmi = { weight, height, gender, bmiCategory, bmi };
  user.info = newBmi;
  await user.save();

  res.status(201).json(newBmi);
});

const saveAllergies = asyncHandler(async (req, res) => {
  const { allergies } = req.body;

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.info) {
    throw new ApiError(404, "User info not found");
  }

  user.info.allergies = allergies;
  await user.save();

  res.status(200).json({
    message: "Allergies added successfully",
    userInfo: user.info,
  });
});

const getUserData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, gender, weight, height, allergies } = req.body;

  const allergiesList = Array.isArray(allergies)
    ? allergies
    : String(allergies || "")
        .split(",")
        .map((allergy) => allergy.trim())
        .filter(Boolean);

  const updatedUser = await User.findByIdAndUpdate(
    req.userId,
    {
      $set: {
        name,
        email,
        "info.gender": gender,
        "info.weight": weight,
        "info.height": height,
        "info.allergies": allergiesList,
      },
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.userId);

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({ message: "Account deleted successfully" });
});

module.exports = {
  saveBmi,
  saveAllergies,
  getUserData,
  updateProfile,
  deleteAccount,
};
