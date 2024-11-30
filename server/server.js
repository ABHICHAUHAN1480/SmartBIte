const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require('dotenv').config();
const multer = require('multer');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const FormData = require("form-data");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.port||3001;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const Fuse = require("fuse.js");

const SECRET_KEY = process.env.SECRET_KEY;
const cache = new Map();
const upload = multer({ storage: multer.memoryStorage() }).single('file');

app.post('/analyze-image', upload, async (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }


  const imageData = file.buffer.toString('base64');

  const PAT = process.env.CLARIFAI_API_KEY;
  const MODEL_ID = 'food-item-recognition';
  const MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044';

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": "clarifai",
      "app_id": "main"
    },
    "inputs": [
      {
        "data": {
          "image": {
            "base64": imageData
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Key ${PAT}`
    },
    body: raw
  };

  try {
    const response = await fetch(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
      requestOptions
    );
    const data = await response.json();


    const identifiedIngredients = data.outputs[0].data.concepts.filter(concept =>
      concept.value > 0.7
    );


    res.json({ outputs: [{ data: { concepts: identifiedIngredients } }] });

  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Error analyzing image' });
  }
});
app.get("/recipemaker", async (req, res) => {
  const { ingredients, diet } = req.query;

  if (!ingredients) {
    return res.status(400).json({ error: "Ingredients field is required." });
  }


  const cacheKey = `${ingredients}-${diet || "all"}`;

  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    // &cuisine=Indian   gger lhgana hai to lga lena
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?includeIngredients=${encodeURIComponent(ingredients)}&number=5${diet ? `&diet=${diet}` : ""}&excludeIngredients=beef,pork&cuisine=Indian&apiKey=${process.env.SPOONACULAR_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching recipes: ${response.statusText}`);
    }

    const { results } = await response.json();



    const detailedRecipes = await Promise.all(
      results.map(async (recipe) => {
        const recipeDetailResponse = await fetch(
          `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
        );

        if (!recipeDetailResponse.ok) {
          console.error(
            `Error fetching details for recipe ID ${recipe.id}: ${recipeDetailResponse.statusText}`
          );
          return null;
        }

        return recipeDetailResponse.json();
      })
    );


    const validRecipes = detailedRecipes.filter(Boolean);
    cache.set(cacheKey, validRecipes);

    res.json(validRecipes);
  } catch (error) {
    console.error("Error fetching data from Spoonacular API:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/recipemaker/nutrition", async (req, res) => {
  const { maxCalories, maxProtein, maxCarbs, maxFat } = req.query;

  // Ensure at least one nutrient value is provided
  if (!maxCalories && !maxProtein && !maxCarbs && !maxFat) {
    return res.status(400).json({ error: "At least one nutrient parameter is required." });
  }

  try {
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?number=5&apiKey=${process.env.SPOONACULAR_API_KEY}&excludeIngredients=beef,pork&maxCalories=${maxCalories || ''}&maxProtein=${maxProtein || ''}&maxCarbs=${maxCarbs || ''}&maxFat=${maxFat || ''}`);

    if (!response.ok) {
      throw new Error(`Error fetching recipes by nutrition: ${response.statusText}`);
    }

    const recipes = await response.json();
    res.json(recipes.results || []); // `results` will hold the recipe data
  } catch (error) {
    console.error("Error fetching data from Spoonacular API:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/mealplan', async (req, res) => {
  try {
    const { timeFrame, targetCalories, diet, exclude } = req.query; 

    const params = new URLSearchParams({
      timeFrame: timeFrame || 'day', 
      targetCalories: targetCalories || 2000, 
      diet: diet || '', 
      exclude: exclude || '', 
      apiKey: process.env.SPOONACULAR_API_KEY, 
    });


    const response = await fetch(`https://api.spoonacular.com/mealplanner/generate?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch meal plan from Spoonacular: ${response.statusText}`);
    }

    const data = await response.json();

   
    const mealPlan = {};
    if (timeFrame === 'week') {
      Object.keys(data.week).forEach((day) => {
        mealPlan[day] = data.week[day].meals.map((meal) => ({
          id: meal.id,
          title: meal.title,
          image: `https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg`,
          time: meal.readyInMinutes,
          serving: meal.servings,
          url: meal.sourceUrl,
        }));
      });
    } else if (timeFrame === 'day') {
      mealPlan.day = data.meals.map((meal) => ({
        id: meal.id,
        title: meal.title,
        image: `https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg`,
        time: meal.readyInMinutes,
        serving: meal.servings,
        url: meal.sourceUrl,
      }));
    }

    res.json(mealPlan); 
  } catch (error) {
    console.error('Error fetching meal plan:', error.message);
    res.status(500).json({ error: error.message });
  }
});


app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const User = require('./models/User');


app.post('/api/auth/signup', async (req, res) => {
  const { name, user, email, password, password_confirmation } = req.body;

  try {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({
      name,
      user,
      email,
      password: hashedPassword,
    });

    // Save the user
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Respond with user data and token
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      user: newUser.user,
      email: newUser.email,
      token,
    });
  } catch (error) {
    console.error('Error in signup route:', error); // Log the error
    res.status(500).json({ message: 'Server Error' });
  }
});



app.post('/api/auth/login', async (req, res) => {
  const { user, password } = req.body;

  try {
    const foundUser = await User.findOne({ user });

    if (foundUser) {
  
      const isMatch = await foundUser.matchPassword(password);
      if (!isMatch) {
        console.log("Password mismatch"); 
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      
      const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
      res.json({
        _id: foundUser._id,
        user: foundUser.user,
        name: foundUser.name,
        email: foundUser.email,
        token,
      });
    } else {
      console.log("User not found"); 
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error("Server error:", error); 
    res.status(500).json({ message: 'Server Error' });
  }
});

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};


app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'You have access to this protected route' });
});

const Item = require('./models/Item');


app.post('/bmi', async (req, res) => {
  try {
    const { weight, height, gender, bmiCategory, bmi } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const id = jwt.verify(token, process.env.JWT_SECRET).id;
    const newBmi = {
      weight,
      height,
      gender,
      bmiCategory,
      bmi,
    };

    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.info = newBmi;

  
    await user.save();

    res.status(201).json(newBmi);  
  } catch (error) {
    console.error('Error saving BMI:', error);
    res.status(400).json({ message: 'Error saving BMI', error });
  }
});

app.post('/allergies', async (req, res) => {
  try {
    const { allergies } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const id = jwt.verify(token, process.env.JWT_SECRET).id;

    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.info) {
      return res.status(404).json({ error: 'User info not found' });
    }

   
    user.info.allergies = allergies;

   
    await user.save();

    res.status(200).json({ message: 'Allergies added successfully', userInfo: user.info });
  } catch (error) {
    console.error('Error saving allergies:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get("/items", async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token is required" });
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.id;

    // Find the user and populate their items
    const user = await User.findById(userid).populate("items");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the populated user data
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching items:", error);

    // Handle specific error types for better debugging
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    res.status(500).json({ message: "Error fetching items", error });
  }
});

app.post('/items', async (req, res) => {

  try {
    const { item, quantity, expire, id,unit } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    const expiryDate = new Date(expire);
    const timeDifference = expiryDate - new Date();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    const newItem = new Item({
      item,
      quantity,
      expire,
      unit,
      id,
      dayLeft: daysLeft,
    });
     


    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const userid = decoded.id;
    const user = await User.findById(userid);
    user.items.push(newItem);
    await user.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(400).json({ message: 'Error adding item', error });
  }
});

app.delete('/items', async (req, res) => {
  try {
    const { id } = req.body;


    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.id;

    const user = await User.findByIdAndUpdate(
      userid,
      { $pull: { items: { id: id } } },
      { new: true }
    );

    res.status(201).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(400).json({ message: 'Error deleteing item', error });
  }

})
app.put('/items', async (req, res) => {
  try {
    const { id, item, quantity, expire } = req.body; 
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.id;

    // Calculate new daysLeft based on the updated expiry date
    const expiryDate = new Date(expire);
    const timeDifference = expiryDate - new Date();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Update the specific item in the user's inventory
    const user = await User.findOneAndUpdate(
      { _id: userid, 'items.id': id }, // Find user and specific item by ID
      {
        $set: {
          'items.$.item': item,
          'items.$.quantity': quantity,
          'items.$.expire': expire,
          'items.$.daysLeft': daysLeft
        }
      },
      { new: true } // Return the updated user document
    ).populate('items');

    if (!user) {
      return res.status(404).json({ message: 'Item not found or unauthorized.' });
    }

    res.status(200).json({ message: 'Item updated successfully.', items: user.items });
  } catch (error) {

    res.status(400).json({ message: 'Error updating item.', });
  }
});
app.put('/update-items', async (req, res) => {
  try {
    const { previousdate } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    // Verify if token exists
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    // Decode the token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.id;

    // Update the previousdate for the user
    const user = await User.findOneAndUpdate(
      { _id: userid }, // Match user by ID
      { $set: { previousdate: previousdate } }, // Update previousdate field
      { new: true } // Return the updated document
    );

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found or unauthorized.' });
    }

    // Send success response
    res.status(200).json({ 
      message: 'Date updated successfully.', 
      previousdate: user.previousdate 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating previous date.' });
  }
});

app.get('/userdata', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userid = decoded.id;

    const user2 = await User.findById(userid)


    res.status(201).json(user2);
  } catch (error) {
    console.error('Error  getting user:', error);
    res.status(400).json({ message: 'Error getting user', error });
  }
})
app.put('/update-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);


    const { name, email, gender, weight, height, allergies } = req.body;


    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          email,
          'info.gender': gender,
          'info.weight': weight,
          'info.height': height,
          'info.allergies': allergies.split(',').map((a) => a.trim()),
          'info.gender': gender
        },
      },
      { new: true }
    );

    if (!updatedUser) throw new Error('User not found');

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ message: 'Error updating profile', error });
  }
});

app.get('/api/moodrecipes', async (req, res) => {
  const { mealType, cuisine } = req.query;


  if (!mealType || !cuisine) {
    return res.status(400).json({ message: 'Meal type and cuisine are required' });
  }

  try {
    const API_URL = "https://api.spoonacular.com/recipes/complexSearch?"
    const url = `${API_URL}?mealType=${mealType}&cuisine=${cuisine}&excludeIngredients=beef,pork&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();


    if (data.error) {
      return res.status(500).json({ message: 'Error fetching recipes' });
    }

    
    res.status(200).json(data.results);
  } catch (error) {
    console.error('Error fetching data from Spoonacular:',);
    res.status(500).json({ message: 'Error fetching data from Spoonacular' });
  }
});

app.get("/getrecipe", async (req, res) => {
  const { id } = req.query;  

  if (!id) {
    return res.status(400).json({ error: 'Recipe ID is required' });
  }
   
   
  try {
    const recipeDetailResponse = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
    );
    
    
    if (!recipeDetailResponse.ok) {
      return res.status(recipeDetailResponse.status).json({
        error: `Error fetching details for recipe ID ${id}: ${recipeDetailResponse.statusText}`,
      });
    }
       
    const recipeData = await recipeDetailResponse.json();  
    
    
    res.json(recipeData); 

  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});

app.get("/api/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Recipe name is required." });
  }

  try {

    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
      params: {
        query,

        number: 6,
        apiKey: process.env.SPOONACULAR_API_KEY,
      },
    });

    if (response.data.results && response.data.results.length > 0) {
      return res.json({ data: response.data.results });
    } else {

      return res.status(404).json({ message: "No recipes found for the given query." });
    }
  } catch (error) {
    console.error("Error fetching data from Spoonacular API:", error);

    res.status(500).json({ error: "Failed to fetch recipes." });
  }
});


app.post("/api/converse", async (req, res) => {
  const { text, contextId } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // Prepare query parameters for Spoonacular API
    const response = await axios.get(
      "https://api.spoonacular.com/food/converse",
      {
        params: {
          text: text, // User's input
          contextId: contextId || "342938", // Optional contextId for conversation memory
          apiKey: process.env.SPOONACULAR_API_KEY, // API key from environment variable
        },
        headers: {
          "Content-Type": "application/json", // Request content type
        },
      }
    );


    // Send the response back to the frontend
    res.json({
      answer: response.data,

    });
  } catch (error) {
    console.error("Error communicating with Spoonacular:", error);
    res.status(500).json({ error: "Failed to communicate with Spoonacular" });
  }
});

app.delete('/delete-account', async (req, res) => {
  try {
   
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token format.' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload.' });
    }


    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Error deleting account:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' });
    }
    res.status(500).json({ error: 'Failed to delete account.' });
  }
});

app.use(bodyParser.json());


app.get("/fav", async (req, res) => {
  try {
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
         
 
    const favRecipes = user.recipe.favourite;
    if (!favRecipes || favRecipes.length === 0) {
      return res.status(200).json([]); 
    }

    
    const ids = favRecipes.join(',');

    try {
      
      const recipeDetailResponse = await fetch(
        `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}&apiKey=${process.env.SPOONACULAR_API_KEY}`
      );

      if (!recipeDetailResponse.ok) {
        return res.status(recipeDetailResponse.status).json({
          error: `Error fetching details for recipe IDs: ${recipeDetailResponse.statusText}`,
        });
      }
     
      const recipeData = await recipeDetailResponse.json();
      res.json(recipeData);

    } catch (error) {
      console.error('Error fetching recipe details:', error);
      res.status(500).json({ error: 'Failed to fetch recipe details from Spoonacular' });
    }

  } catch (error) {
    console.error("Error fetching favorites:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: 'Token expired' });
    }

    // Catch any other internal server errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/fav', async (req, res) => {
  try {
    const { id} = req.body; 
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.recipe) {
      user.recipe = { favourite: [] }; // Initialize `recipe` with an empty `favourite` array
    }


    
    if (user.recipe.favourite.includes(id)) {
      return res.status(200).json({ 
        success: false, 
        message: 'Recipe already exists in favourites' 
      });
    }
    user.recipe.favourite.push(id); 
    await user.save();

    res.status(201).json({ 
      success: true, 
      recipe: user.recipe 
    });
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(400).json({ message: 'Error saving recipe', error });
  }
})


app.delete('/fav', async (req, res) => {
  const { id } = req.body; 
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
     
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      user.recipe.favourite= user.recipe.favourite.filter(fav => fav.toString() !== id);
      await user.save();
      res.status(200).json({ message: 'Recipe removed from favorites', favourite: user.recipe.favourite });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
