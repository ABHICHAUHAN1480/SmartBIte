import apiClient, { authHeader } from "./client";

export const authApi = {
  signup: (payload) => apiClient.post("/api/auth/signup", payload),
  login: (payload) => apiClient.post("/api/auth/login", payload),
};

export const userApi = {
  getUserData: () => apiClient.get("/userdata", { headers: authHeader() }),
  saveBmi: (payload) => apiClient.post("/bmi", payload, { headers: authHeader() }),
  saveAllergies: (payload) => apiClient.post("/allergies", payload, { headers: authHeader() }),
  updateProfile: (payload) => apiClient.put("/update-profile", payload, { headers: authHeader() }),
  deleteAccount: () => apiClient.delete("/delete-account", { headers: authHeader() }),
};

export const inventoryApi = {
  getItems: () => apiClient.get("/items", { headers: authHeader() }),
  addItem: (payload) => apiClient.post("/items", payload, { headers: authHeader() }),
  updateItem: (payload) => apiClient.put("/items", payload, { headers: authHeader() }),
  deleteItem: (payload) => apiClient.delete("/items", { data: payload, headers: authHeader() }),
  updateItemsDate: (payload) => apiClient.put("/update-items", payload, { headers: authHeader() }),
};

export const recipesApi = {
  analyzeImage: (formData) => apiClient.post("/analyze-image", formData, { headers: { ...authHeader(), "Content-Type": "multipart/form-data" } }),
  getRecipeMaker: (params) => apiClient.get("/recipemaker", { params }),
  getNutritionRecipes: (params) => apiClient.get("/recipemaker/nutrition", { params }),
  getMoodRecipes: (params) => apiClient.get("/api/moodrecipes", { params }),
  getRecipeById: (id) => apiClient.get("/getrecipe", { params: { id } }),
  searchRecipes: (query) => apiClient.get("/api/search", { params: { query } }),
  converse: (payload) => apiClient.post("/api/converse", payload),
  getFavorites: () => apiClient.get("/fav", { headers: authHeader() }),
  addFavorite: (id) => apiClient.put("/fav", { id }, { headers: authHeader() }),
  deleteFavorite: (id) => apiClient.delete("/fav", { data: { id }, headers: authHeader() }),
};

export const mealPlanApi = {
  generate: (params) => apiClient.get("/mealplan", { params }),
  saveDay: (params) => apiClient.post("/savemealplan", { params }, { headers: authHeader() }),
  saveWeek: (params) => apiClient.post("/savemealplanW", { params }, { headers: authHeader() }),
  getSaved: (timeframe) => apiClient.get("/savemealplan", { params: { timeframe }, headers: authHeader() }),
  deleteSaved: (timeframe) => apiClient.delete("/deletemealplan", { params: { timeframe }, headers: authHeader() }),
};

