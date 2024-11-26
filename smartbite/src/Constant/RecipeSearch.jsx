import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import { useNavigate } from "react-router-dom";
import Chatbox from "./Chatbox";
import chaticon from "../assets/chatboxicon.svg"

const RecipeSearch = () => {
  const [query, setQuery] = useState("");
const [trending, settrending] = useState(true)
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setloading2] = useState(false);
  const detailsRef = useRef(null);
  const navigate = useNavigate();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
const [showchatbox, setshowchatbox] = useState(false)
useEffect(() => {
  window.scrollTo({
    top: 0,
  });

}, [])
const handleFav = async (id) => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert("You need to be logged in to add favorites!");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/fav", {
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

    const data = await response.json(); 

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


const searchRecipes = async () => {
    if (!query) {
      toast.error("Please enter a recipe name.");
      return;
    }
    setRecipes([]);
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:3001/api/search", {
        params: { query },
      });

      if (response.data.data && response.data.data.length > 0) {
        setRecipes(response.data.data);
        settrending(false)
      } else {
        toast.warn("No recipes found for the given query.");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      if (error.response && error.response.status === 404) {
        toast.warn("No recipes found for the given query.");
      } else {
        toast.error("Error fetching recipes. Please try again.");
      }
    } finally {
      setLoading(false);
      setloading2(false);
    }
  };

  const handlerecipe = async (id) => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3001/getrecipe", {
        params: { id },
      });
      setSelectedRecipe(response.data);
    
      setLoading(false)
      
      detailsRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      toast.error("Error fetching recipe details");
      console.error("Error:", error);
    }
  };
  const renderInstructions = (instructions) => {
    if (Array.isArray(instructions)) {
      return (
        <ol className="list-decimal text-lg ml-5 leading-relaxed">
          {instructions.map((step, index) => (
            <li key={index} className="mb-2">
              {step}
            </li>
          ))}
        </ol>
      );
    } else {
      return (
        <div>
          {instructions.includes("<ol>") || instructions.includes("<ul>") ? (
            <div
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: instructions }}
            />
          ) : (
            <ol className="flex flex-col ml-5 text-lg leading-relaxed">
              {instructions.split(/\d+\.\s+/).map((step, index) =>
                step ? (
                  <li key={index} className="mb-2">
                    {step.trim()}
                  </li>
                ) : null
              )}
            </ol>
          )}
        </div>
      );
    }
  };

  const closeRecipe = () => {
    navigate("/recipe");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
    <Navbar />
   <span className="z-[9999]"> {showchatbox && <Chatbox/>}</span>
   {(loading && loading2 ) && (
                    <div className="fixed inset-0 z-50  flex items-center justify-center bg-black bg-opacity-50">
                        <div className="flex flex-col items-center gap-4">
                            <lord-icon
                                src="https://cdn.lordicon.com/dupxuoaa.json"
                                trigger="loop"
                                state="loop-transparency"
                                colors="primary:#ffffff"
                                style={{ width: 80, height: 80 }}
                            ></lord-icon>
                            <span className="text-white text-lg font-medium">Loading, please wait...</span>
                        </div>
                    </div>
                )}
    <div className="mt-36 mb-20">
    <span onClick={() => setshowchatbox((prev) => !prev)} className={`flex fixed z-50 ${!showchatbox ? "bg-gray-900":"bg-orange-500"}  bg-opacity-90 ml-[94%] mt-[39%] items-center w-[80px] h-[80px] md:w-[70px] md:h-[70px] justify-center border-2 border-orange-500 rounded-full shadow-lg  hover:border-orange-700 hover:shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out`}>
  <img className="w-[70%] p-1 invert  transition-transform duration-300 ease-in-out" src={chaticon} alt="chatbox" />
</span>
      <div className="p-6">
        <span
          className="absolute top-24 right-5 cursor-pointer text-xl"
          onClick={closeRecipe}
        >
          <lord-icon
            src="https://cdn.lordicon.com/nqtddedc.json"
            trigger="hover"
            state="hover-cross-2"
            colors="primary:#fff"
            style={{ width: 45, height: 45 }}
          />
        </span>
        <ToastContainer />
  
        {/* Informational Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl font-semibold font-serif text-blue-400 mb-4">
            Find Your Perfect Recipe
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            Discover new recipes tailored to your preferences. Simply enter a dish
            name or ingredient, and we'll find delicious options for you. Whether
            you're looking for quick snacks or gourmet meals, we've got you
            covered!
          </p>
        </div>
  
        {/* Search Form */}
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-xl shadow-2xl max-w-lg mx-auto transition-transform duration-300 hover:scale-105">
          <h1 className="text-4xl mb-6 font-bold font-serif tracking-wide text-blue-400">
            Recipe Search
          </h1>
          <input
            type="text"
            placeholder="Enter recipe name (e.g., Butter Chicken)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-4 rounded-lg w-full mb-4 bg-gray-900 text-white placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
         <button
  onClick={() => {
    searchRecipes();
    setSelectedRecipe(""); // Reset the selected recipe
  }}
  className={`bg-gradient-to-r flex justify-center items-center from-blue-500 to-purple-600 px-6 py-3 rounded-full text-lg font-semibold text-white shadow-md transition duration-300 ${
    loading ? "opacity-75 cursor-not-allowed" : "hover:from-blue-600 hover:to-purple-700 hover:shadow-lg"
  }`}
  disabled={loading} 
>
  {loading ? (
    <span className="flex items-center gap-2">
      Searching
      <lord-icon
        src="https://cdn.lordicon.com/jpgpblwn.json"
        trigger="loop"
        state="loop-juggle"
        colors="primary:#a5e830"
        style={{ width: 30, height: 30 }}
      ></lord-icon>
    </span>
  ) : (
    "Search"
  )}
</button>

        </div>
  
        
        {trending && (
  <div className="mt-16">
    <h3 className="text-3xl font-bold font-serif text-center text-blue-400 mb-8">
      Trending Recipes
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          title: "Chicken Pasta Primavera - Flower Patch Farmgirl Style",
          image: "https://img.spoonacular.com/recipes/638236-556x370.jpg",
          ak: 638236,
        },
        {
          title: "Paneer Makhani",
          image: "https://img.spoonacular.com/recipes/654534-556x370.jpg",
          ak: 654534,
        },
        {
          title: "French Silk Chocolate Cake",
          image: "https://img.spoonacular.com/recipes/643394-556x370.jpg",
          ak: 643394,
        },
      ].map((recipe) => (
        <div
          key={recipe.ak}
          className="border border-gray-700 rounded-lg p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 hover:shadow-2xl hover:border-blue-400 hover:scale-105 transform transition-all duration-300"
        >
          <div className="relative overflow-hidden rounded-md">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover rounded-lg mb-4 transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-100 mb-2 hover:text-blue-400 transition-colors duration-300">
            {recipe.title}
          </h2>
          <span
            onClick={() => {handlerecipe(recipe.ak),setloading2(true)}}
            className="text-blue-400 cursor-pointer mt-2 block hover:text-blue-300 hover:underline transition-colors duration-200"
          >
            View Recipe
          </span>
        </div>
      ))}
    </div>
  </div>
)}






  
        {/* Results Section */}
        <div className="mt-8">
          {recipes.length > 0  && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="border border-gray-700 rounded-lg p-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 hover:shadow-2xl hover:border-blue-400 hover:scale-105 transform transition-all duration-300"
        >
          <div className="relative overflow-hidden rounded-md">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-48 object-cover rounded-lg mb-4 transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-100 mb-2 hover:text-blue-400 transition-colors duration-300">
            {recipe.title}
          </h2>
          <p className="text-sm text-gray-400 mb-2">{recipe.summary}</p>
          <span
            onClick={() => {handlerecipe(recipe.id),setloading2(true)}}
            className="text-blue-400 cursor-pointer mt-2 block hover:text-blue-300 hover:underline transition-colors duration-200"
          >
            View Recipe
          </span>
        </div>
      ))}
            </div>
          ) }
        </div>
  
        {/* CTA Banner */}
       
  
        {/* Recipe Details */}
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
    trigger="click"
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


         <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold text-white mb-2">
            Explore More Recipes
          </h3>
          <p className="text-lg text-gray-200 mb-4">
            Discover hundreds of recipes curated for every taste and occasion.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
          >
            Explore Recipes
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  
  
  );
};

export default RecipeSearch;
