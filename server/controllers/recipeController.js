const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const { analyzeFoodImage } = require("../services/clarifaiService");
const {
  complexSearch,
  getRecipeInformation,
  getBulkRecipeInformation,
  converse,
} = require("../services/spoonacularService");
const env = require("../config/env");

const recipeCache = new Map();

const analyzeImage = asyncHandler(async (req, res) => {
  const { file } = req;

  if (!file) {
    throw new ApiError(400, "No file uploaded");
  }

  const imageData = file.buffer.toString("base64");
  const data = await analyzeFoodImage(imageData);

  const identifiedIngredients =
    data?.outputs?.[0]?.data?.concepts?.filter((concept) => concept.value > 0.7) || [];

  res.json({ outputs: [{ data: { concepts: identifiedIngredients } }] });
});

const getRecipeMaker = asyncHandler(async (req, res) => {
  const { ingredients, diet } = req.query;

  if (!ingredients) {
    throw new ApiError(400, "Ingredients field is required.");
  }

  const cacheKey = `${ingredients}-${diet || "all"}`;
  if (recipeCache.has(cacheKey)) {
    return res.json(recipeCache.get(cacheKey));
  }

  const searchResult = await complexSearch({
    includeIngredients: ingredients,
    number: 5,
    ...(diet ? { diet } : {}),
    excludeIngredients: "beef,pork",
  });

  const results = searchResult.results || [];

  const detailedRecipes = await Promise.all(
    results.map(async (recipe) => {
      try {
        return await getRecipeInformation(recipe.id);
      } catch (_error) {
        return null;
      }
    })
  );

  const validRecipes = detailedRecipes.filter(Boolean);
  recipeCache.set(cacheKey, validRecipes);

  res.json(validRecipes);
});

const getNutritionRecipes = asyncHandler(async (req, res) => {
  const { maxCalories, maxProtein, maxCarbs, maxFat } = req.query;

  if (!maxCalories && !maxProtein && !maxCarbs && !maxFat) {
    throw new ApiError(400, "At least one nutrient parameter is required.");
  }

  const recipes = await complexSearch({
    number: 5,
    excludeIngredients: "beef,pork",
    maxCalories: maxCalories || "",
    maxProtein: maxProtein || "",
    maxCarbs: maxCarbs || "",
    maxFat: maxFat || "",
  });

  res.json(recipes.results || []);
});

const getMoodRecipes = asyncHandler(async (req, res) => {
  const { mealType, cuisine } = req.query;

  if (!mealType || !cuisine) {
    throw new ApiError(400, "Meal type and cuisine are required");
  }

  const data = await complexSearch({
    mealType,
    cuisine,
    excludeIngredients: "beef,pork",
  });

  res.status(200).json(data.results || []);
});

const getRecipeById = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new ApiError(400, "Recipe ID is required");
  }

  const recipeData = await getRecipeInformation(id);
  res.json(recipeData);
});

const searchRecipes = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    throw new ApiError(400, "Recipe name is required");
  }

  const response = await complexSearch({ query, number: 6 });

  if (!response.results || response.results.length === 0) {
    throw new ApiError(404, "No recipes found for the given query");
  }

  res.json({ data: response.results });
});

const converseRecipes = asyncHandler(async (req, res) => {
  const { text, contextId } = req.body;

  if (!text) {
    throw new ApiError(400, "Text is required");
  }

  const answer = await converse({ text, contextId });
  res.json({ answer });
});

const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const favRecipes = user.recipe?.favourite || [];
  if (!favRecipes.length) {
    return res.status(200).json([]);
  }

  const ids = favRecipes.join(",");
  const recipeData = await getBulkRecipeInformation(ids);
  res.json(recipeData);
});

const addFavorite = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.recipe) {
    user.recipe = { favourite: [] };
  }

  if (user.recipe.favourite.includes(id)) {
    return res.status(200).json({
      success: false,
      message: "Recipe already exists in favourites",
    });
  }

  user.recipe.favourite.push(id);
  await user.save();

  res.status(201).json({
    success: true,
    recipe: user.recipe,
  });
});

const removeFavorite = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.recipe.favourite = user.recipe.favourite.filter(
    (fav) => fav.toString() !== id.toString()
  );
  await user.save();

  res.status(200).json({
    message: "Recipe removed from favorites",
    favourite: user.recipe.favourite,
  });
});

module.exports = {
  analyzeImage,
  getRecipeMaker,
  getNutritionRecipes,
  getMoodRecipes,
  getRecipeById,
  searchRecipes,
  converseRecipes,
  getFavorites,
  addFavorite,
  removeFavorite,
};
