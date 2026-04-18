const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
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
} = require("../controllers/recipeController");

const router = express.Router();

router.post("/analyze-image", upload.single("file"), analyzeImage);
router.get("/recipemaker", getRecipeMaker);
router.get("/recipemaker/nutrition", getNutritionRecipes);
router.get("/api/moodrecipes", getMoodRecipes);
router.get("/getrecipe", getRecipeById);
router.get("/api/search", searchRecipes);
router.post("/api/converse", converseRecipes);
router.route("/fav").get(protect, getFavorites).put(protect, addFavorite).delete(protect, removeFavorite);

module.exports = router;
