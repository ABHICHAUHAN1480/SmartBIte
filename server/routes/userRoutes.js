const express = require("express");
const {
  saveBmi,
  saveAllergies,
  getUserData,
  updateProfile,
  deleteAccount,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/bmi", protect, saveBmi);
router.post("/allergies", protect, saveAllergies);
router.get("/userdata", protect, getUserData);
router.put("/update-profile", protect, updateProfile);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
