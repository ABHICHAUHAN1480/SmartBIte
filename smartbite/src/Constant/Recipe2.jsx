import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import chaticon from "../assets/chatboxicon.svg"
const Recipe2 = ({ data }) => {
  const [mealType, setMealType] = useState('Dessert');
  const [cuisine, setCuisine] = useState('Italian');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();
  const detailsRef = useRef(null);
  const moodOptions = [
  
        { mood: "Happy", cuisine: "Italian", mealType: "Dessert" },
        { mood: "Very Happy", cuisine: "Indian", mealType: "Dessert" },
        { mood: "Sad", cuisine: "American", mealType: "Dessert" },
        { mood: "Very sad", cuisine: "Italian", mealType: "Dessert" },

        { mood: "Energetic", cuisine: "Mediterranean", mealType: "High Protein" },
        { mood: "Romantic", cuisine: "French", mealType: "Dinner" },
        { mood: "Comfort", cuisine: "Southern", mealType: "Comfort Food" },
        { mood: "Comforted", cuisine: "Southern", mealType: "Comfort Food" },
        { mood: "Adventurous", cuisine: "Indian", mealType: "Fusion" },
        { mood: "Excited", cuisine: "Japanese", mealType: "Light" },
        { mood: "Very sad", cuisine: "Italian", mealType: "Dessert" },
        { mood: "Neutral", cuisine: "Japanese", mealType: "Light" },
        { mood: "Motivated", cuisine: "Indian", mealType: "Protein-packed" },
        { mood: "Sophisticate", cuisine: "American", mealType: "Gourmet" },
        { mood: "Cozy", cuisine: "American", mealType: "Stew" },
        { mood: "Refreshing", cuisine: "Vegan", mealType: "Salads" },
        { mood: "Indulgent", cuisine: "American", mealType: "Rich, Decadent" },
        { mood: "Playful", cuisine: "Mexican", mealType: "Tacos" },
        { mood: "Angry", cuisine: "American", mealType: "Sweet" },
      
  ];

  useEffect(() => {
    if (data) {
      const matchedMood = moodOptions.find(option => option.mood === data);
      if (matchedMood) {
        setCuisine(matchedMood.cuisine);
        setMealType(matchedMood.mealType);
        handleFetchRecipes(matchedMood.cuisine, matchedMood.mealType);
      }
    }
  }, [data]);

  const handleFav = async (id) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert("You need to be logged in to add favorites!");
      return;
    }
  
    try {
      const response = await fetch("https://smartbite-g813.onrender.com/fav", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }), // Shorthand syntax
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Parse server error response
        console.error("Error adding to favorites:", errorData.message || response.statusText);
        alert(`Failed to add to favorites: ${errorData.message || "Unknown error"}`);
        return;
      }
  
      const data = await response.json(); // Parse server response
      if(!data.success){
        toast.error(data.message)
    }else{
      toast.success("Recipe added to Favourites sucessfuly")
    }
    
   
  
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };
  

  const handleFetchRecipes = async (cuisine, mealType) => {
    try {
      const response = await axios.get('https://smartbite-g813.onrender.com/api/moodrecipes', {
        params: { cuisine, mealType },
      });
      setRecipes(response.data);
    } catch (error) {
      toast.error('Error fetching recipes');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (selectedRecipe && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedRecipe]);

  const handleFetchRecipeDetails = async (id) => {
    try {
      const response = await axios.get('https://smartbite-g813.onrender.com/getrecipe', { params: { id } });
      console.log(response);
      
      
      setSelectedRecipe(response.data);
      detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      toast.error('Error fetching recipe details');
      console.error('Error:', error);
    }
  };

  const renderInstructions = (instructions) => {
    if (!instructions) {
        return <p className="text-red-500 text-[20px]">No instructions available.</p>;
      }
    if (Array.isArray(instructions)) {
      return (
        <ol className="list-decimal text-[20px] ml-5">
          {instructions.map((step, index) => <li key={index}>{step}</li>)}
        </ol>
      );
    } else {
      return (
        <div>
          {instructions.includes('<ol>') || instructions.includes('<ul>') ? (
            <div className="text-[20px]" dangerouslySetInnerHTML={{ __html: instructions }} />
          ) : (
            <ol className="flex flex-col ml-5 text-[20px]">
              {instructions.split(/\d+\.\s+/).map((step, index) =>
                step ? <li key={index}>{step.trim()}</li> : null
              )}
            </ol>
          )}
        </div>
      );
    }
  };

  const closeRecipe = () => navigate("/recipe");

  return (
    <div className="absolute bg-black bg-opacity-90 overflow-y-scroll div3 z-20 w-full h-full">
      <ToastContainer autoClose={3000} hideProgressBar={false} closeOnClick />
     
      <span
        className="absolute top-3 right-3 cursor-pointer text-black text-xl"
        onClick={closeRecipe}
      >
        <lord-icon
          src="https://cdn.lordicon.com/nqtddedc.json"
          trigger="hover"
          state="hover-cross-2"
          colors="primary:#fff"
          style={{ width: 35, height: 35 }}
        />
      </span>
      
      <div className="recipes-list">
        <h2 className="text-2xl text-white text-center my-4">Recipes:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <div
                key={index}
                className="bg-slate-700 bg-opacity-90 p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
              >
                <div className='relative'>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-50 object-cover rounded-t-lg"
                />
                   <span  onClick={() => handleFav(recipe.id)}   className="absolute z-20 top-0 right-0">
  <lord-icon
    src="https://cdn.lordicon.com/ulnswmkk.json"
    trigger="click"
    state="morph-heart"
    colors="primary:#000"
    style={{ width: 45, height: 45 }}
  ></lord-icon></span></div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{recipe.title}</h3>
                  <button
                    onClick={() => handleFetchRecipeDetails(recipe.id)}
                    className="bg-blue-500 text-white mt-3 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Get Recipe
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white text-center">No recipes found.</p>
          )}
        </div>
      </div>

      {selectedRecipe && (
  <div
    ref={detailsRef}
    className="recipe-details flex flex-col lg:flex-row gap-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 p-12 rounded-3xl shadow-2xl mt-8 transform transition-all duration-300"
  >
    {/* Recipe Title and Image Section */}
    <div className="flex-1 flex flex-col items-center lg:items-start">
      <h2 className="text-4xl font-serif font-bold text-yellow-400 mb-6 text-center lg:text-left hover:scale-105 transition-transform duration-300">
        {selectedRecipe.title}
      </h2>
      <div className="relative group">
        <img
          src={selectedRecipe.image}
          alt={selectedRecipe.title}
          className="w-full lg:w-[750px] h-auto object-cover rounded-3xl shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-2xl"
        />
      
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-3xl"></div>
        <span className="absolute bottom-4 right-6 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full text-sm group-hover:scale-105 group-hover:shadow-lg transform transition-transform duration-300">
          High-Resolution Image
        </span>
      </div>
    </div>

    {/* Ingredients and Instructions Section */}
    <div className="flex-1 lg:w-1/3 overflow-y-auto div3 h-[70vh] bg-gray-800 bg-opacity-90 border border-gray-700 p-8 rounded-3xl shadow-inner">
      {/* Ingredients Section */}
      <div className="mb-8">
        <h3 className="text-3xl font-serif font-extrabold text-yellow-400 mb-6 border-b border-yellow-500 pb-2">
          Ingredients
        </h3>
        <ul className="list-disc list-inside space-y-4 text-gray-300 text-lg leading-relaxed">
          {selectedRecipe.extendedIngredients.map((i, index) => (
            <li key={index} className="hover:text-yellow-400 transition-colors duration-200">
              {i.original}{" "}
              <span className="text-gray-400 text-sm">({i.originalName})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions Section */}
      <div className="mb-8">
        <h3 className="text-3xl font-serif font-extrabold text-yellow-400 mb-6 border-b border-yellow-500 pb-2">
          Instructions
        </h3>
        <p className="text-gray-300 text-lg leading-loose">
          {renderInstructions(selectedRecipe.instructions)}
        </p>
      </div>

     
      <button
  onClick={() => handleFav(selectedRecipe.id)} // Uncomment the onClick for functionality
  className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:from-green-600 hover:via-green-700 hover:to-green-800"
>
  <span>Add to Favourites</span>
  <lord-icon
    src="https://cdn.lordicon.com/ulnswmkk.json"
    trigger="hover"
    state="morph-heart"
    colors="primary:#ffffff"
    style={{ width: 30, height: 30 }}
  ></lord-icon>
</button>


<a
  href={`https://spoonacular.com/recipes/${selectedRecipe.title}-${selectedRecipe.id}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center gap-2 w-full py-3 px-6 mt-4 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-gray-900 font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:from-yellow-600 hover:via-yellow-700 hover:to-yellow-800"
>
  <span>View Full Recipe</span>
  <lord-icon
    src="https://cdn.lordicon.com/ipnwkgdy.json"
    trigger="hover"
    state="hover-1"
    colors="primary:#000000"
    style={{ width: 30, height: 30 }}
  ></lord-icon>
</a>
     
    </div>
  </div>
)}



    </div>
  );
};

export default Recipe2;
