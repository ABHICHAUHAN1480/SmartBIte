import React, { useState, useEffect } from 'react';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import happy from "../assets/emojies/happy.svg"
import neutral from "../assets/emojies/neutral.svg"
import sad from "../assets/emojies/sad.svg"
import tomato from "../assets/tomato.svg"
import broccoli from "../assets/broccoli.svg"
import pasta from "../assets/pasta.jpg"
import soup from "../assets/soup.webp"
import desert from "../assets/desert.jpg"
import chaticon from "../assets/chatboxicon.svg"
import Chatbox from '../Constant/Chatbox';
const Meal_Mood = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showchatbox, setshowchatbox] = useState(false)


  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  
}, [])
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast("No token found. Please login again.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [navigate]);

  const gotomoodmeals = () => {
    navigate("/mood");
  };
  const gotoingreidientsmeal =()=>{
    navigate("/recpiemaker")
  }

  const fetchMealPlan = async () => {
    setLoading(true);
    setError('');
    setMealPlan(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/mealplan`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch meal plan.');
      const data = await response.json();
      setMealPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const gotoingrecipe=()=>{
    navigate("/searchrecipe")
  }

  return (
    <div className="relative w-full overflow-hidden min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <ToastContainer autoClose={3000} hideProgressBar={false} closeOnClick />
      <Navbar />
      <span className="z-[9999]"> {showchatbox && <Chatbox/>}</span>
      <div className="mt-36 mb-20">
  {/* Hero Section */}
  <span
    onClick={() => setshowchatbox((prev) => !prev)}
    className={`flex fixed z-50 ${!showchatbox ? 'bg-gray-800' : 'bg-orange-600'} bg-opacity-95 ml-[94%] mt-[39%] items-center w-[80px] h-[80px] md:w-[70px] md:h-[70px] justify-center border-4 border-orange-500 rounded-full shadow-xl hover:border-orange-700 hover:shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out`}
  >
    <img
      className="w-[70%] p-1 filter transition-transform duration-300 ease-in-out invert"
      src={chaticon}
      alt="chatbox"
    />
  </span>

  {/* Welcome Section */}
  <div className="text-center cursor-default">
    <div className="py-16 w-[90%] mx-auto bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-2xl rounded-3xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
      <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-md">
        Welcome to Your Diet Planner
      </h1>
      <p className="text-lg font-light text-gray-200">
        Generate a personalized meal plan tailored to your needs!
      </p>
      <button
        onClick={fetchMealPlan}
        className="mt-8 px-8 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition duration-300 transform hover:scale-105"
      >
        Generate Meal Plan
      </button>
    </div>
    <div className="mt-6">
      {loading && (
        <p className="text-gray-300 animate-pulse text-xl">
          Loading meal plan...
        </p>
      )}
      {error && <p className="text-red-400 text-lg">{error}</p>}
    </div>
  </div>

  {/* Meal Plan Display */}
  {mealPlan && (
    <div className="mt-12 px-6">
      <h2 className="text-3xl font-bold text-center text-white mb-8">
        Your Meal Plan
      </h2>
      {Object.keys(mealPlan).map((day) => (
        <div key={day} className="mb-8">
          <h3 className="text-2xl font-bold text-gray-300 mb-4">
            {day.toUpperCase()}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mealPlan[day].map((meal) => (
              <div
                key={meal.id}
                className="bg-gray-700 bg-opacity-80 p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <h4 className="font-semibold text-lg text-gray-100 mb-3">
                  {meal.title}
                </h4>
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-40 object-cover rounded-lg mb-3 transition-transform duration-300 transform hover:scale-110"
                />
                <button
                  className="text-green-400 font-medium hover:underline"
                  onClick={() => window.open(meal.sourceUrl, '_blank')}
                >
                  View Recipe
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Mood-Based Meals Section */}
  <div className="py-16 text-center w-[90%] mx-auto bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 shadow-2xl rounded-3xl mt-12 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
    <h1 className="text-4xl font-extrabold mb-6 text-white">
      Mood-Based Meals
    </h1>
    <p className="text-lg font-light text-gray-200">
      Discover meals tailored to your mood, whether you’re feeling happy,
      relaxed, or need an energy boost!
    </p>
    <p className="text-sm text-gray-300 mt-4">
      Our AI recommends the perfect dishes to match your feelings.
    </p>
    <div className="flex justify-center mt-8 space-x-6">
      <img
        src={sad}
        alt="Sad Meal"
        className="rounded-full w-24 h-24 object-cover shadow-lg transform hover:scale-110 transition duration-300"
      />
      <img
        src={neutral}
        alt="Neutral Meal"
        className="rounded-full w-24 h-24 object-cover shadow-lg transform hover:scale-110 transition duration-300"
      />
      <img
        src={happy}
        alt="Happy Meal"
        className="rounded-full w-24 h-24 object-cover shadow-lg transform hover:scale-110 transition duration-300"
      />
    </div>
    <button
      onClick={gotomoodmeals}
      className="mt-8 px-8 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition duration-300 transform hover:scale-105"
    >
      Explore Mood Meals
    </button>
  </div>

  {/* Recipe by Ingredients Section */}
  <div className="py-16 text-center w-[90%] mx-auto bg-gradient-to-r from-teal-400 via-cyan-500 to-indigo-600 shadow-2xl rounded-3xl mt-12 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
    <h1 className="text-4xl font-extrabold mb-6 text-white">
      Recipe by Ingredients & Nutrients
    </h1>
    <p className="text-lg font-light text-gray-200">
      Generate recipes based on what you have and your nutritional goals.
    </p>
    <p className="text-sm text-gray-300 mt-4">
      Enter the ingredients you have and specify dietary preferences.
    </p>
    <div className="flex justify-center mt-8 space-x-4">
      <img
        src={tomato}
        alt="Tomato"
        className="w-32 h-32 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
      />
      <img
        src={broccoli}
        alt="Broccoli"
        className="w-32 h-32 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
      />
    </div>
    <button
      onClick={gotoingreidientsmeal}
      className="mt-8 px-8 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition duration-300 transform hover:scale-105"
    >
      Get Recipes by Ingredients
    </button>
  </div>

  {/* Recipe by Name Section */}
  <div className="py-16 text-center w-[90%] mx-auto bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-2xl rounded-3xl mt-12 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
    <h1 className="text-4xl font-extrabold mb-6 text-white">
      Recipe by Name
    </h1>
    <p className="text-lg font-light text-gray-200">
      Search for recipes by name and explore nutritional details.
    </p>
    <div className="flex justify-center mt-8 space-x-6">
      <img
        src={pasta}
        alt="Pasta Recipe"
        className="w-28 h-28 rounded-full object-cover shadow-lg transform hover:scale-110 transition duration-300"
      />
      <img
        src={soup}
        alt="Soup Recipe"
        className="w-28 h-28 rounded-full object-cover shadow-lg transform hover:scale-110 transition duration-300"
      />
      <img
        src={desert}
        alt="Dessert Recipe"
        className="w-28 h-28 rounded-full object-cover shadow-lg transform hover:scale-110 transition duration-300"
      />
    </div>
    <button
      onClick={gotoingrecipe}
      className="mt-8 px-8 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition duration-300 transform hover:scale-105"
    >
      Search Recipes
    </button>
  </div>
</div>




      <Footer />
    </div>
  );
};

export default Meal_Mood;
