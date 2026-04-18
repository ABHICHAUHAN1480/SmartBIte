const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || process.env.port || 3001),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  spoonacularApiKey: process.env.SPOONACULAR_API_KEY,
  clarifaiApiKey: process.env.CLARIFAI_API_KEY,
  corsOrigin: process.env.CORS_ORIGIN,
};

module.exports = env;
