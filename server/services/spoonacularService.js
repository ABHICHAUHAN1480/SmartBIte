const fetch = require("node-fetch");
const axios = require("axios");
const env = require("../config/env");

const spoonacularApi = "https://api.spoonacular.com";

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Spoonacular request failed: ${response.statusText}`);
  }
  return response.json();
};

const complexSearch = async (params) => {
  const response = await axios.get(`${spoonacularApi}/recipes/complexSearch`, {
    params: {
      ...params,
      apiKey: env.spoonacularApiKey,
    },
  });

  return response.data;
};

const getRecipeInformation = async (id) => {
  return fetchJson(`${spoonacularApi}/recipes/${id}/information?apiKey=${env.spoonacularApiKey}`);
};

const getBulkRecipeInformation = async (ids) => {
  return fetchJson(`${spoonacularApi}/recipes/informationBulk?ids=${ids}&apiKey=${env.spoonacularApiKey}`);
};

const generateMealPlan = async (queryString) => {
  return fetchJson(`${spoonacularApi}/mealplanner/generate?${queryString}`);
};

const converse = async ({ text, contextId }) => {
  const response = await axios.get(`${spoonacularApi}/food/converse`, {
    params: {
      text,
      contextId: contextId || "342938",
      apiKey: env.spoonacularApiKey,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

module.exports = {
  complexSearch,
  getRecipeInformation,
  getBulkRecipeInformation,
  generateMealPlan,
  converse,
};
