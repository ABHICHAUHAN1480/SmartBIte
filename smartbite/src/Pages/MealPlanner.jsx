import React, { useState,useEffect,useRef } from "react";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Favrecipes from "../Constant/Favrecipes";
import axios from "axios";
const MealPlanner = () => {
    const [mealPlan, setMealPlan] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timeFrame, settimeFrame] = useState("day");
    const [diet, setdiet] = useState("All");
    const [targetCalories, settargetCalories] = useState(2000);
    const [exclude, setexclude] = useState("");
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showremove, setshowremove] = useState(false)
    const detailsRef = useRef(null);
    const showToast = (message) => {
        toast(message);
    };
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
    const fetchMealPlan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMealPlan(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("You must log in to fetch meal plans.");

            const params = new URLSearchParams({
                timeFrame,
                targetCalories,
                diet,
                exclude,
            });

            const response = await fetch(
                `http://localhost:3001/mealplan?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch meal plan.");

            const data = await response.json();
            setMealPlan(data);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const scrollToFeatures = () => {
        if (detailsRef.current) {
          detailsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",  
          });
        }
      };
      useEffect(() => {
        if (mealPlan) {
            scrollToFeatures();
        }
    }, [mealPlan]);
    useEffect(() => {
       
        window.scrollTo({ top: 0 });
    }, [selectedRecipe]);
    const goup = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getFavs=()=>{
        setSelectedRecipe(null);
       setTimeout(() => {
        scrollToFeatures();
       }, 1000); 
    }

    const handlerecipe = async (id) => {
        try {
          setLoading(true)
          const response = await axios.get("http://localhost:3001/getrecipe", {
            params: { id },
          });
          setSelectedRecipe(response.data);
        
          setLoading(false)
          
         
        } catch (error) {
          toast.error("Error fetching recipe details");
          console.error("Error:", error);
        }
      };
    

    return (<>
    <ToastContainer autoClose={3000} closeOnClick />
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-poppins">
    <Navbar />
    <div className="mt-28 mb-20">
        <div className="mx-auto mb-12 px-6">
            {/* Form */}
            <div className="bg-gray-800/70 w-11/12 md:w-2/3 lg:w-1/2 mx-auto p-8 rounded-2xl shadow-2xl backdrop-blur-xl border border-gray-700/50">
  <h2 className="text-3xl font-extrabold text-center mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 animate-gradient">
    Create Your Meal Plan
  </h2>
  <form onSubmit={fetchMealPlan} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Time Frame */}
      <div className="flex flex-col">
        <label htmlFor="timeFrame" className="text-sm font-medium mb-1">
          Time Frame
        </label>
        <select
          id="timeFrame"
          value={timeFrame}
          onChange={(e) => settimeFrame(e.target.value)}
          className="p-3 bg-gray-700/80 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 transition duration-300 hover:bg-gray-600/80"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
        </select>
      </div>

      {/* Diet */}
      <div className="flex flex-col">
        <label htmlFor="diet" className="text-sm font-medium mb-1">
          Diet
        </label>
        <select
          id="diet"
          value={diet}
          onChange={(e) => setdiet(e.target.value)}
          className="p-3 bg-gray-700/80 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 transition duration-300 hover:bg-gray-600/80"
        >
          <option value="">All</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="Gluten Free">Gluten Free</option>
          <option value="Pescetarian">Pescetarian</option>
          <option value="Whole30">Whole30</option>
        </select>
      </div>
    </div>

    {/* Target Calories */}
    <div className="flex flex-col">
      <label htmlFor="calories" className="text-sm font-medium mb-1">
        Target Calories
      </label>
      <input
        id="calories"
        type="number"
        min="0"
        placeholder="e.g., 2000"
        value={targetCalories}
        onChange={(e) => settargetCalories(Number(e.target.value))}
        className="p-3 bg-gray-700/80 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 transition duration-300 hover:bg-gray-600/80"
      />
    </div>

    {/* Exclude Ingredients */}
    <div className="flex flex-col">
      <label htmlFor="exclude" className="text-sm font-medium mb-1">
        Exclude Ingredients
      </label>
      <input
        id="exclude"
        type="text"
        value={exclude}
        onChange={(e) => setexclude(e.target.value)}
        className="p-3 bg-gray-700/80 text-white rounded-lg focus:ring-4 focus:ring-indigo-500 transition duration-300 hover:bg-gray-600/80"
        placeholder="e.g., shellfish, olives"
      />
    </div>

    <button
      type="submit"
      className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50"
    >
      {loading ? "Fetching..." : "Get Meal Plan"}
    </button>
  </form>
</div>


            {/* Error Message */}
            {error && (
                <p className="mt-6 text-center text-red-400 font-medium">
                    {error}
                </p>
            )}

            {/* Meal Plan Display */}
            {mealPlan && (
  <div ref={detailsRef} className="mt-12">
    <h2 className="text-4xl font-bold text-center mb-8">
      Your Meal Plan
    </h2>
    {Object.keys(mealPlan).map((day) => (
      <div key={day} className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 animate-gradient">
          {day.toUpperCase()}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mealPlan[day].map((meal) => (
            <div
              key={meal.id}
              className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-300 border border-gray-700/50 hover:border-indigo-500/50 hover:scale-105"
            >
              <h4 className="text-2xl font-semibold mb-3 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-gradient">
                {meal.title}
              </h4>
              <img
                src={meal.image || "https://via.placeholder.com/150?text=No+Image+Available"}
                alt={meal.title}
                className="w-full h-40 object-cover rounded-xl mb-4 shadow-md"
              />
              <p className="text-sm text-gray-300 mb-4">
                <strong className="text-indigo-400">Serving Time:</strong>{" "}
                {meal.time || "N/A"}
              </p>
              <div className="flex justify-between items-center">
                <button
                  className="text-indigo-400 hover:text-indigo-500 underline decoration-dotted"
                  onClick={() => {
                    handlerecipe(meal.id), goup();
                  }}
                >
                  View Recipe
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-lg hover:from-indigo-500 hover:to-purple-600 transition transform hover:scale-110"
                  onClick={() => handleFav(meal.id)}
                >
                  Add to Favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)}

            {selectedRecipe && (
                <Favrecipes
                    showremove={showremove}
                    selectedRecipe={selectedRecipe}
                    getFavs={getFavs}
                    setSelectedRecipe={setSelectedRecipe}
                    toast={showToast}
                />
            )}
        </div>
    </div>
    <Footer />
</div>


    </>
    );
};

export default MealPlanner;
