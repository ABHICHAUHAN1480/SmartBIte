import React, { useState, useEffect } from 'react';
import RecipeDetail from '../Constant/RecipeDetail'; // Renders individual recipe details
import foodbg from "../assets/foodbg.jpeg"; // Background image for the main container
import Navbar from './Navbar'; // Navigation bar component
import Footer from './Footer'; // Footer component
import Chatbox from '../Constant/Chatbox';
import chaticon from "../assets/chatboxicon.svg"

const RecipeMaker = () => {
    // State for input and control elements
    const [showchatbox, setshowchatbox] = useState(false)
    const [ingredients, setIngredients] = useState('');
    const [mealType, setMealType] = useState('Lunch');
    const [cuisine, setCuisine] = useState('Italian');
    const [diet, setDiet] = useState('');
    const [searchByNutrition, setSearchByNutrition] = useState(false);
    const [maxCalories, setMaxCalories] = useState('');
    const [maxProtein, setMaxProtein] = useState('');
    const [maxCarbs, setMaxCarbs] = useState('');
    const [maxFat, setMaxFat] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ingredientsUpdatedByRecipe, setIngredientsUpdatedByRecipe] = useState(false);

    // Fetch ingredients from user's inventory and update state
    const ingredientsracipe = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("No token found. Please login again.");
            return;
        }

        try {
            let res = await fetch("http://localhost:3001/items", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            let presentdata = await res.json();
            presentdata=presentdata.items;
            
            
            const formattedData = presentdata.map(item => item.item);
            const formattedString = formattedData.join(", ");
            setIngredients(formattedString);
            setIngredientsUpdatedByRecipe(true);
        } catch (err) {
            alert("Error fetching ingredients");
        }
    };

    // Fetch recipes based on either ingredients or nutrition
    const fetchRecipe = async () => {
        setLoading(true);
        setError('');
        setRecipes([]);
        let url = `http://localhost:3001/recipemaker`;

        if (searchByNutrition) {
            url += `/nutrition?maxCalories=${maxCalories}&maxProtein=${maxProtein}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`;
        } else {
            url += `?ingredients=${encodeURIComponent(ingredients)}&diet=${diet}`;
        }

        try {
            const response = await fetch(url);
           
            
            if (!response.ok) throw new Error('Error fetching recipe');
            const data = await response.json();
            setRecipes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Trigger recipe fetch when ingredients are updated by recipe action
    useEffect(() => {
        if (ingredientsUpdatedByRecipe) {
            fetchRecipe();
            setIngredientsUpdatedByRecipe(false);
        }
    }, [ingredients, ingredientsUpdatedByRecipe]);

    useEffect(() => {
        window.scrollTo({
          top: 0,
        });
      
    }, [])
    return (
        <div 
            className="relative min-h-screen w-full overflow-hidden"
           
        >
            <Navbar />
            <span className="z-[50] "> {showchatbox && <Chatbox/>}</span>
          
            <div
  className="min-h-[80vh] mt-20 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-900 via-gray-900 to-black"
>
  {/* Chatbox Toggle */}
  <span
    onClick={() => setshowchatbox((prev) => !prev)}
    className={`fixed z-50 ${
      !showchatbox ? "bg-gray-900" : "bg-orange-500"
    } flex items-center justify-center w-[70px] h-[70px] md:w-[60px] md:h-[60px] bottom-8 right-8 rounded-full shadow-lg border-2 border-orange-500 hover:border-orange-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}
  >
    <img
      className="w-2/3 p-1 invert transition-transform duration-300 ease-in-out"
      src={chaticon}
      alt="Chatbox Icon"
    />
  </span>

  {/* Form Container */}
  <div className="max-w-3xl w-full">
    <form
      className="bg-white bg-opacity-20 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-gray-700 transition-transform transform hover:scale-105 duration-300"
      onSubmit={(e) => {
        e.preventDefault();
        fetchRecipe();
      }}
    >
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center text-white mb-8 drop-shadow-lg">
        Recipe Maker
      </h1>

      {/* Toggle Search Mode */}
      <div className="flex justify-between items-center text-white mb-8">
        <span
          className={`text-lg ${
            !searchByNutrition ? "font-bold text-blue-400" : ""
          }`}
        >
          Search by Ingredients
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={searchByNutrition}
            onChange={() => setSearchByNutrition(!searchByNutrition)}
            className="sr-only peer"
          />
          <span className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:left-1 after:top-1 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-all"></span>
        </label>
        <span
          className={`text-lg ${
            searchByNutrition ? "font-bold text-blue-400" : ""
          }`}
        >
          Search by Nutrition
        </span>
      </div>

      {/* Input Fields */}
      <div className="transition-all ease-in-out duration-500">
        {!searchByNutrition ? (
          <>
            <input
              type="text"
              placeholder="Ingredients (comma separated)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-6"
            />
            <div className="mb-4">
              <label
                htmlFor="diet"
                className="block font-medium text-white mb-2"
              >
                Diet Preference:
              </label>
              <select
                id="diet"
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="">All</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescetarian">Pescetarian</option>
                <option value="gluten free">Gluten Free</option>
                <option value="ketogenic">Ketogenic</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <input
              type="number"
              placeholder="Max Calories"
              value={maxCalories}
              onChange={(e) => setMaxCalories(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4"
            />
            <input
              type="number"
              placeholder="Max Protein (g)"
              value={maxProtein}
              onChange={(e) => setMaxProtein(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4"
            />
            <input
              type="number"
              placeholder="Max Carbs (g)"
              value={maxCarbs}
              onChange={(e) => setMaxCarbs(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4"
            />
            <input
              type="number"
              placeholder="Max Fat (g)"
              value={maxFat}
              onChange={(e) => setMaxFat(e.target.value)}
              className="w-full p-4 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4"
            />
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Get Recipe
        </button>
        <button
          type="button"
          onClick={ingredientsracipe}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Kitchen Ingredients
        </button>
      </div>
    </form>

    {/* Display Results */}
    {loading && (
      <p className="text-white text-center mt-4 animate-pulse">Loading...</p>
    )}
    {error && <p className="text-red-500 text-center mt-4">{error}</p>}


{error && <p className="text-red-500 text-center mt-4">{error}</p>}

{recipes.length > 0 && (
  <div className="mt-8 -ml-36 w-[70vw] relative">
    <h2 className="text-xl font-semibold text-white mb-4">Recipes:</h2>

    {/* Horizontal Scroll Container */}
    <div className="flex items-center">
      {/* Back Button */}
      <button
  onClick={() => document.getElementById("recipe-scroll").scrollBy({ left: -950, behavior: "smooth" })}
  className="absolute left-0  z-10 bg-gray-700 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg group"
  style={{ top: "50%", transform: "translateY(-50%)" }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-white transition-all duration-300 ease-in-out"
  >
  
    <path
      d="M5 12h14"
      className="transition-transform duration-300 ease-in-out group-hover:scale-x-[1.05] group-hover:text-orange-500"
    ></path>

 
    <path
      d="M12 5l-7 7 7 7"
      className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1 group-hover:text-orange-100"
    ></path>
  </svg>
</button>


    
      <div
        id="recipe-scroll"
        className="overflow-x-auto flex gap-10  mx-9 ml-10  div3  py-4 px-8 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-900"
        style={{ scrollBehavior: "smooth" }}
      >
        {recipes.map((recipe) => (
          <RecipeDetail
            key={recipe.id}
            recipe={recipe}
            className="flex-shrink-0  bg-gray-800 text-white rounded-xl p-4 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          />
        ))}
      </div>

      
      <button
  onClick={() => document.getElementById("recipe-scroll").scrollBy({ left: 950, behavior: "smooth" })}
  className="absolute right-0 -mr-6 z-10 bg-gray-700 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg group"
  style={{ top: "50%", transform: "translateY(-50%)" }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-white transition-all duration-300 ease-in-out"
  >
    {/* Horizontal Line */}
    <path
      d="M5 12h14"
      className="transition-transform duration-300 ease-in-out group-hover:scale-x-[1.05] group-hover:text-orange-500"
    ></path>

    {/* Arrowhead */}
    <path
      d="M12 5l7 7-7 7"
      className="transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:text-orange-100"
    ></path>
  </svg>
</button>
    </div>
  </div>
)}


  </div>
</div>

            <Footer />
        </div>
    );
};

export default RecipeMaker
