const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getMealPlan,
  saveMealPlanDay,
  saveMealPlanWeek,
  getSavedMealPlan,
  deleteSavedMealPlan,
} = require("../controllers/mealPlanController");

const router = express.Router();

router.get("/mealplan", getMealPlan);
router.post("/savemealplan", protect, saveMealPlanDay);
router.post("/savemealplanW", protect, saveMealPlanWeek);
router.get("/savemealplan", protect, getSavedMealPlan);
router.delete("/deletemealplan", protect, deleteSavedMealPlan);

module.exports = router;
