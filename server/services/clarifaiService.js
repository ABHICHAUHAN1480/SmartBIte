const fetch = require("node-fetch");
const env = require("../config/env");

const analyzeFoodImage = async (base64Image) => {
  const modelId = "food-item-recognition";
  const modelVersionId = "1d5fd481e0cf4826aa72ec3ff049e044";

  const payload = {
    user_app_id: {
      user_id: "clarifai",
      app_id: "main",
    },
    inputs: [
      {
        data: {
          image: {
            base64: base64Image,
          },
        },
      },
    ],
  };

  const response = await fetch(
    `https://api.clarifai.com/v2/models/${modelId}/versions/${modelVersionId}/outputs`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Key ${env.clarifaiApiKey}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`Clarifai request failed: ${response.statusText}`);
  }

  return response.json();
};

module.exports = { analyzeFoodImage };
