const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const { generateMealPlan } = require("../services/spoonacularService");
const env = require("../config/env");

const mapMeal = (meal) => ({
  id: meal.id,
  title: meal.title,
  image: `https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg`,
  time: meal.readyInMinutes,
  serving: meal.servings,
  url: meal.sourceUrl,
});

const buildMealPlanView = (data, timeFrame) => {
  const mealPlan = {};

  if (timeFrame === "week") {
    Object.keys(data.week || {}).forEach((day) => {
      mealPlan[day] = data.week[day].meals.map(mapMeal);
    });
  } else {
    mealPlan.day = (data.meals || []).map(mapMeal);
  }

  return mealPlan;
};

const getMealPlan = asyncHandler(async (req, res) => {
  const { timeFrame, targetCalories, diet, exclude } = req.query;

  const params = new URLSearchParams({
    timeFrame: timeFrame || "day",
    targetCalories: targetCalories || 2000,
    diet: diet || "",
    exclude: exclude || "",
    apiKey: env.spoonacularApiKey,
  });

  const data = await generateMealPlan(params.toString());
  const mealPlan = buildMealPlanView(data, timeFrame || "day");

  res.json(mealPlan);
});

const saveMealPlanDay = asyncHandler(async (req, res) => {
  const { params } = req.body;

  if (!params) {
    throw new ApiError(400, "No parameters provided");
  }

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.diet) {
    user.diet = {};
  }

  user.diet.paramsday = params;
  await user.save();

  res.status(200).json({ message: "Meal plan saved successfully" });
});

const saveMealPlanWeek = asyncHandler(async (req, res) => {
  const { params } = req.body;

  if (!params) {
    throw new ApiError(400, "No parameters provided");
  }

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.diet) {
    user.diet = {};
  }

  user.diet.paramsweek = params;
  await user.save();

  res.status(200).json({ message: "Meal plan saved successfully" });
});

const getSavedMealPlan = asyncHandler(async (req, res) => {
  const { timeframe } = req.query;

  if (!timeframe || !["day", "week"].includes(timeframe)) {
    throw new ApiError(400, "Invalid or missing timeframe. Must be 'day' or 'week'.");
  }

  const user = await User.findById(req.userId);
  const paramKey = `params${timeframe}`;

  if (!user || !user.diet || !user.diet[paramKey]) {
    throw new ApiError(400, `No diet parameters found for timeframe '${timeframe}'`);
  }

  const data = await generateMealPlan(`${user.diet[paramKey]}&apiKey=${env.spoonacularApiKey}`);
  const mealPlan = buildMealPlanView(data, timeframe);

  res.json(mealPlan);
});

const deleteSavedMealPlan = asyncHandler(async (req, res) => {
  const { timeframe } = req.query;

  if (!timeframe || !["day", "week"].includes(timeframe)) {
    throw new ApiError(400, "Invalid or missing timeframe. Must be 'day' or 'week'.");
  }

  const user = await User.findById(req.userId);
  if (!user || !user.diet || !user.diet[`params${timeframe}`]) {
    throw new ApiError(400, `No meal plan found for timeframe '${timeframe}'`);
  }

  await User.updateOne({ _id: req.userId }, { $unset: { [`diet.params${timeframe}`]: "" } });

  res.status(200).json({
    message: `Meal plan for '${timeframe}' removed successfully.`,
  });
});

module.exports = {
  getMealPlan,
  saveMealPlanDay,
  saveMealPlanWeek,
  getSavedMealPlan,
  deleteSavedMealPlan,
};
