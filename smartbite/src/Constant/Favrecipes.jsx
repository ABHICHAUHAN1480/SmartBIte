import React from 'react'
import { useEffect } from 'react';
const Favrecipes = ({setSelectedRecipe,selectedRecipe,getFavs,toast}) => {
    useEffect(() => {
        // Add class to disable scrolling
        document.body.classList.add("body-no-scroll");

        return () => {
            // Remove class to re-enable scrolling when modal closes
            document.body.classList.remove("body-no-scroll");
        };
    }, []);
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
            toast("Recipe removed sucessfully")
            getFavs();

        } catch (error) {
            console.error("Error in getFavs:", error);
            toast("An error occurred while fetching favorite recipes.");
        }
    }
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
  return (<div className='absolute top-20 ml-auto mr-auto '>
   
    <div   className="recipe-details flex flex-col lg:flex-row gap-12 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-700 p-12 rounded-3xl shadow-2xl mt-8 mx-4 lg:mx-0 transform transition-all duration-300">
    <span onClick={()=>{setSelectedRecipe(null)}}
     className='absolute ml-[93.5%] -mt-12 cursor-pointer'> <lord-icon
        src="https://cdn.lordicon.com/nqtddedc.json"
        trigger="hover"
        state="hover-cross-2"
        colors="primary:#e8e230"
        style={{ width: 43, height: 43 }}
      /></span>
    <div className="flex-1 flex flex-col items-center lg:items-start">
        <h2 className="text-4xl font-serif font-bold text-yellow-400 mb-6 text-center lg:text-left hover:scale-105 transition-transform duration-300">
            {selectedRecipe.title}
        </h2>
        <div className="relative ">
            <img
                src={selectedRecipe.image || "https://via.placeholder.com/750x500?text=No+Image+Available"}
                alt={selectedRecipe.title}
                className="w-full lg:w-[750px] h-auto object-cover rounded-3xl shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-2xl"
            />
        </div>
    </div>

    {/* Ingredients & Instructions */}
    <div className="flex-1 lg:w-1/3 overflow-y-auto div3 cursor-default h-[70vh] bg-gray-800 bg-opacity-90 border border-gray-700 p-8 rounded-3xl shadow-inner  transition-all duration-300 hover:shadow-lg">
{/* Ingredients Section */}
<h3 className="text-3xl font-serif font-extrabold text-yellow-400 mb-6 border-b-2 border-yellow-500 pb-2 drop-shadow-lg">
Ingredients
</h3>
<ul className="list-disc space-y-4 text-gray-300 text-lg leading-relaxed">
{selectedRecipe.extendedIngredients.map((i, index) => (
    <li key={index} className="hover:text-yellow-400 transition-colors duration-300">
        {i.original}{" "}
        <span className="text-sm text-gray-400 italic">({i.originalName})</span>
    </li>
))}
</ul>

{/* Instructions Section */}
<h3 className="text-3xl font-serif font-extrabold text-yellow-400 mt-8 mb-6 border-b-2 border-yellow-500 pb-2 drop-shadow-lg">
Instructions
</h3>
<div className="text-gray-300 text-lg leading-loose">
{renderInstructions(selectedRecipe.instructions)}
</div>

{/* Buttons Section */}
<div className="flex gap-6 mt-10">
{/* Remove from Favorites Button */}
<button
    onClick={() => handleremovefav(`${selectedRecipe.id}`)}
    className="w-1/2 py-4 px-6 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-semibold shadow-lg hover:shadow-[0_0_15px_rgba(255,0,0,0.7)] transition-all duration-300 transform hover:scale-105"
>
    Remove from Favorites
</button>

{/* View Full Recipe Button */}
<a
    href={`https://spoonacular.com/recipes/${selectedRecipe.title}-${selectedRecipe.id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 w-1/2 py-4 px-6 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 text-gray-900 font-semibold shadow-lg hover:shadow-[0_0_15px_rgba(255,223,0,0.7)] transition-all duration-300 transform hover:scale-105"
>
    <span className="flex items-center gap-2">
        View Full Recipe
        <lord-icon
            src="https://cdn.lordicon.com/ipnwkgdy.json"
            trigger="hover"
            state="hover-1"
            colors="primary:#000000"
            style={{ width: 30, height: 30 }}
        ></lord-icon>
    </span>
</a>
</div>
</div>


</div>
</div>                  
  )
}

export default Favrecipes

