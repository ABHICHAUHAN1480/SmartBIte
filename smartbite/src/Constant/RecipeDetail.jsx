import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const RecipeDetail = ({ recipe }) => {
    if (!recipe) return null; 
   
   
    const handleremovefav = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast("No token found. Please login again.");
            setTimeout(() => navigate("/login"), 3000);
            return;
        }
        try {
            const res = await fetch("http://localhost:3001/fav", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });
            if (!res.ok) {
                throw new Error("Failed to Delete  items.");
            }
            toast.success("Recipe added to Favourites sucessfuly");
            

        } catch (error) {
            console.error("Error in getFavs:", error);
            toast("An error occurred while fetching favorite recipes.");
        }
    }
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
            body: JSON.stringify({ id }), 
          });
      
          if (!response.ok) {
            const errorData = await response.json(); 
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
      



    return (
        <><ToastContainer autoClose={3000}  closeOnClick />
        <div className="flex flex-col bg-gray-800 text-white shadow-lg hover:shadow-2xl rounded-3xl overflow-hidden transition-transform transform hover:scale-105 duration-300 min-w-[93%] max-w-[400px]">
  {/* Recipe Image */} 
  {recipe.image && (
    <div className="relative">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-56 object-cover"
      />
      
      {/* <span className='absolute z-30 top-3 right-3 cursor-pointer' onClick={()=>{handleFav(recipe.id)}}><lord-icon
      src="https://cdn.lordicon.com/ulnswmkk.json"
      trigger="click"
      colors="primary:#ff4d4d,secondary:#ffffff"
       state="morph-heart"
      style={{width:40,height:40}}>
  </lord-icon></span> */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h3 className="text-xl sm:text-2xl font-bold text-white text-center px-4">
          {recipe.title}
        </h3>
      </div>
    </div>
  )}

  {/* Card Content */}
  <div className="p-6">
    {/* Ingredients Section */}
    <div className="mb-4 ">
      <h4 className="font-semibold text-lg text-orange-400 border-b-2 border-orange-400 pb-1 mb-2">
        Ingredients
      </h4>
      <ul className="flex flex-row justify-start flex-wrap w-full overflow-x-auto text-sm text-gray-300 gap-x-4 gap-y-2 max-h-24 whitespace-nowrap div3">
  {(recipe.extendedIngredients || []).map((ingredient, index) => (
    <li
      key={index}
      className="min-w-[150px] max-w-1/2 text-left bg-gray-900 rounded-lg px-3 py-1 shadow-md"
    >
      {ingredient.original || ingredient.originalName || "Unknown ingredient"}
    </li>
  ))}
</ul>


    </div>

    {/* Instructions Section */}
    <div>
      <h4 className="font-semibold text-lg text-orange-400 border-b-2 border-orange-400 pb-1 mb-2">
        Instructions
      </h4>
      {Array.isArray(recipe.instructions) ? (
        <ol className="list-decimal list-inside  text-gray-300 space-y-2 min-h-32 max-h-32  overflow-y-auto div3">
          {recipe.instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      ) : recipe.instructions?.includes("<ol>") || recipe.instructions?.includes("<ul>") ? (
        <div
          className=" text-gray-300 min-h-32 max-h-32 overflow-y-auto div3"
          dangerouslySetInnerHTML={{ __html: recipe.instructions }}
        />
      ) : (
        <ol className="list-decimal list-inside  text-gray-300 space-y-2 min-h-32 max-h-32  overflow-y-auto div3">
          {recipe.instructions
            ?.split(/\d+\.\s+/)
            .map((step, index) => step && <li key={index}>{step.trim()}</li>)}
        </ol>
      )}
    </div>
  </div>

  {/* bg-gray-700 p-4 mb-4 text-center flex gap-16 justify-center */}
  <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-5 text-center flex flex-wrap gap-6 justify-center items-center rounded-2xl shadow-2xl">
 
  <a
    href={`https://spoonacular.com/recipes/${recipe.title}-${recipe.id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 "
  >
    View Full Recipe
    <lord-icon
      src="https://cdn.lordicon.com/ipnwkgdy.json"
      trigger="hover"
      state="hover-1"
      colors="primary:#e4e4e4"
     
      style={{ width: 30, height: 30 }}
    ></lord-icon>
  </a>

  
  <button onClick={()=>handleFav(recipe.id)}
    className="py-3 px-6 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 "
  >
    Add to Favourites
    <lord-icon
      src="https://cdn.lordicon.com/ulnswmkk.json"
      trigger="click"
      state="morph-heart"
      colors="primary:#fff"
    
      style={{ width: 30, height: 30 }}
    ></lord-icon>
  </button>
</div>






</div></>

      

    
    );
};

export default RecipeDetail;
