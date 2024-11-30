import React, { useState, useEffect } from 'react';
import RecipeDetail from '../Constant/RecipeDetail'; 
import foodbg from "../assets/foodbg.jpeg"; 
import Navbar from './Navbar'; 
import Footer from './Footer'; 
import Chatbox from '../Constant/Chatbox';
import chaticon from "../assets/chatboxicon.svg"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const RecipeMaker = () => {
  
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


  const ingredientsracipe = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("No token found. Please login again.");
      return;
      
    }

    try {
      let res = await fetch("https://smartbite-g813.onrender.com/items", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      let presentdata = await res.json();
      presentdata = presentdata.items;
     


      if (presentdata.length === 0) {
        toast("Your inventory is empty.");
        return;
      }


      const formattedData = presentdata.map(item => item.item);
      const formattedString = formattedData.join(", ");
      setIngredients(formattedString);
      setIngredientsUpdatedByRecipe(true);
    } catch (err) {
      alert("Error fetching ingredients");
      console.log("err is:", err);

    }
  };

 
  const fetchRecipe = async () => {
    setLoading(true);
    setError('');
   

    setRecipes([]);
    let url = `https://smartbite-g813.onrender.com/recipemaker`;

    if (searchByNutrition) {
      if(maxCalories===""){
        toast("Add maxCalories first")
        setLoading(false)
         return 
         }
      if(maxProtein===""){
          toast("Add maxProtein first")
          setLoading(false)
           return 
           }
       if(maxCarbs===""){
          toast("Add maxCarbs first")
           setLoading(false)
           return 
             }
         if(maxFat===""){
          toast("Add maxFat first")
          setLoading(false)
            return 
               }
      url += `/nutrition?maxCalories=${maxCalories}&maxProtein=${maxProtein}&maxCarbs=${maxCarbs}&maxFat=${maxFat}`;
    } else {
    if(ingredients===""){
   toast("Add ingredients first")
   setLoading(false)
    return 
    }
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
  return (<>
   <ToastContainer autoClose={3000} hideProgressBar={false} closeOnClick />
    <div
      className="relative min-h-screen cursor-default w-full overflow-hidden"
    >
      <Navbar />
      <span className="z-[50] "> {showchatbox && <Chatbox  setshowchatbox={setshowchatbox}/>}</span>

      <div
        className="min-h-[80vh] mt-20 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-900 via-gray-900 to-black"
      >
       
        <span
          onClick={() => setshowchatbox((prev) => !prev)} className={`fixed z-50 ${!showchatbox ? "bg-gray-900" : "bg-orange-500 hidden"     } flex sm:flex items-center cursor-pointer justify-center w-[70px] h-[70px] md:w-[60px] md:h-[60px] bottom-8 right-8 rounded-full shadow-lg border-2 border-orange-500 hover:border-orange-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300`} >
          <img
            className="w-2/3 p-1 invert transition-transform duration-300 ease-in-out"
            src={chaticon}
            alt="Chatbox Icon"
          />
        </span>

        
        <div className="max-w-3xl w-full">
        <form
  className="bg-white bg-opacity-20 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-700 transition-transform transform hover:scale-105 duration-300 max-w-lg mx-auto"
  onSubmit={(e) => {
    e.preventDefault();
    fetchRecipe();
  }}
>
  {/* Form Title */}
  <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-6 sm:mb-8 drop-shadow-lg">
    Recipe Maker
  </h1>

  {/* Toggle Between Search Modes */}
  <div className="flex flex-col sm:flex-row justify-between items-center text-white mb-8">
    <span
      className={`text-base sm:text-lg ${!searchByNutrition ? "font-bold text-blue-400" : ""}`}
    >
      Search by Ingredients
    </span>
    <label className="relative inline-flex items-center cursor-pointer my-2 sm:my-0">
      <input
        type="checkbox"
        checked={searchByNutrition}
        onChange={() => setSearchByNutrition(!searchByNutrition)}
        className="sr-only peer"
      />
      <span className="w-10 h-5 sm:w-12 sm:h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:left-1 after:top-1 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-all"></span>
    </label>
    <span
      className={`text-base sm:text-lg ${searchByNutrition ? "font-bold text-blue-400" : ""}`}
    >
      Search by Nutrition
    </span>
  </div>

  {/* Form Content Based on Search Mode */}
  <div className="transition-all ease-in-out duration-500">
    {!searchByNutrition ? (
      <>
        {/* Search by Ingredients */}
        <input
          type="text"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full p-3 sm:p-4 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-6"
        />
        <div className="mb-4">
          <label htmlFor="diet" className="block font-medium text-white mb-2">
            Diet Preference:
          </label>
          <select  id="diet" value={diet} onChange={(e) => setDiet(e.target.value)}   className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none">
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
          className="w-full p-3 sm:p-4 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4"
        />
        <input
          type="number"
          placeholder="Max Protein (g)"
          value={maxProtein}
          onChange={(e) => setMaxProtein(e.target.value)}
          className="w-full p-3 sm:p-4 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4"
        />
        <input
          type="number"
          placeholder="Max Carbs (g)"
          value={maxCarbs}
          onChange={(e) => setMaxCarbs(e.target.value)}
          className="w-full p-3 sm:p-4 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4"
        />
        <input
          type="number"
          placeholder="Max Fat (g)"
          value={maxFat}
          onChange={(e) => setMaxFat(e.target.value)}
          className="w-full p-3 sm:p-4 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none mb-4"
        />
      </>
    )}
  </div>

  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
    <button
      type="submit"
      className="bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
    >
      Get Recipe
    </button>
    <button
      type="button"
      onClick={ingredientsracipe}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
    >
      Kitchen Ingredients
    </button>
  </div>
</form>


          {loading && (
            <p className="text-white text-center mt-4 animate-pulse">Loading...</p>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}


          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

         


        </div>
        {recipes.length > 0 && (
            <div className="mt-8  w-[98vw] sm:w-[80vw] md:w-[70vw] relative">
              <h2 className="text-xl font-semibold text-white mb-4">Recipes:</h2>

              <div className="relative flex items-center">

  <button
    onClick={() =>
      document.getElementById("recipe-scroll").scrollBy({
        left: -window.innerWidth * 0.65,
        behavior: "smooth",
      })
    }
    className="absolute left-0 z-10 bg-gray-700 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg group hidden md:flex"
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
      className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-all duration-300 ease-in-out"
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
    className="overflow-x-auto div3 flex gap-2 sm:gap-8 sm:mx-4 md:mx-8 py-4 px-2 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-900"
    style={{ scrollBehavior: "smooth" }}
  >
    {recipes.map((recipe) => (
      <RecipeDetail
        key={recipe.id}
        recipe={recipe}
        className="flex-shrink-0 bg-gray-800 text-white rounded-xl p-4 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-[80%] sm:w-[70%] md:w-[45%] lg:w-[30%]"
      />
    ))}
  </div>


  <button
    onClick={() =>
      document.getElementById("recipe-scroll").scrollBy({
        left: window.innerWidth * 0.65,
        behavior: "smooth",
      })
    }
    className="absolute right-0 z-10 bg-gray-700 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg group hidden md:flex"
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
      className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-all duration-300 ease-in-out"
    >
      <path
        d="M5 12h14"
        className="transition-transform duration-300 ease-in-out group-hover:scale-x-[1.05] group-hover:text-orange-500"
      ></path>
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

      <Footer />
    </div>
    </>
  );
};

export default RecipeMaker
