import React, { useState, useEffect, useRef } from 'react';

import Navbar from '../Component/Navbar';
import Chatbox from '../Constant/Chatbox';
import Footer from '../Component/Footer';
import chaticon from "../assets/chatboxicon.svg";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Favrecipes from '../Constant/Favrecipes';
import unlike from '../assets/unlike.svg'
const Favourite = () => {
    const [showchatbox, setshowchatbox] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [loading, setloading] = useState(false)
    const [showremove, setshowremove] = useState(true)

    useEffect(() => {
        getFavs();
        window.scrollTo({ top: 0 });
    }, []);


    const goup = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const showToast = (message) => {
        toast(message);
    };


    const getFavs = async () => {
        const token = localStorage.getItem("token");
        setloading(true)
        
        if (!token) {
            toast("No token found. Please login again.");
            setTimeout(() => navigate("/login"), 3000);
            return;
        }
        try {
            const res = await fetch("https://smartbite-g813.onrender.com/fav", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch items.");
            }

            const user = await res.json();
            if(user.length===0){
                toast("Add some recipes first ");
                setSelectedRecipe(null)
                setloading(false)

            }
            setSelectedRecipe(null)

            setRecipes(user);
            setloading(false)
        } catch (error) {
            setloading(false)
            console.error("Error in getFavs:", error);
            toast("An error occurred while fetching favorite recipes.");
        }
    };
    const handleremovefav = async (id) => {
        const token = localStorage.getItem("token");
    
        
        if (!token) {
            toast("No token found. Please login again.");
            setTimeout(() => navigate("/login"), 3000);
            return;
        }
        try {
            const res = await fetch("https://smartbite-g813.onrender.com/fav", {
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
            
            setTimeout(() => {
                getFavs();
            }, 1000);
        } catch (error) {
            console.error("Error in getFavs:", error);
            toast("An error occurred while fetching favorite recipes.");
        }
    }



    const renderSummary = (instructions) => {

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
                    {instructions.includes("<ol>") || instructions.includes("<ul>") || instructions.includes("<a") || instructions.includes("<br") ? (
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



    return (
        <>
            <ToastContainer autoClose={3000} closeOnClick />
            <div className="relative  w-full min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
                <Navbar />
                {loading && (
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

                <span className="z-[9999]"> {showchatbox && <Chatbox setshowchatbox={setshowchatbox}/>}</span>
                <div className="mt-36 mb-20  ">   <span
          onClick={() => setshowchatbox((prev) => !prev)} className={`fixed z-50 ${!showchatbox ? "bg-gray-900" : "bg-orange-500 hidden"     } flex sm:flex items-center cursor-pointer justify-center w-[70px] h-[70px] md:w-[60px] md:h-[60px] bottom-8 right-8 rounded-full shadow-lg border-2 border-orange-500 hover:border-orange-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300`} >
          <img
            className="w-2/3 p-1 invert transition-transform duration-300 ease-in-out"
            src={chaticon}
            alt="Chatbox Icon"
          />
        </span>
                    <div className='p-6 min-h-[50vh] flex-grow'>
                        <div className="text-center mb-12">
                            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 drop-shadow-md hover:drop-shadow-lg transition-shadow duration-300">
                                Your Favorite Recipes
                            </h1>
                            <p className="text-lg text-gray-300 mt-4 max-w-2xl mx-auto leading-relaxed">
                                A curated collection of your most loved recipes. Savor every bite and make every meal a memory!
                            </p>
                        </div>


                        <div className=''>

                            {recipes.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-12 px-6 sm:px-8 lg:px-16">
                                    {recipes.map((recipeObj, index) => (
                                        <div
                                            key={index}
                                            className="relative bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-gray-700 overflow-hidden group"
                                        >
                                            {/* Recipe Image */}
                                            <div className="relative overflow-hidden rounded-lg">
                                                <img
                                                    src={recipeObj.image || "https://via.placeholder.com/400x300?text=No+Image+Available"}
                                                    alt={recipeObj.title}
                                                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <span className='top-0 right-0 absolute cursor-pointer ' onClick={()=>handleremovefav(`${recipeObj.id}`)} ><lord-icon
                                                    src="https://cdn.lordicon.com/zxvuvcnc.json"
                                                   trigger="click"
                                                   state="hover-cross-3"
                                                    style={{width:35,height:35}}>
                                                </lord-icon></span>
                                                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent text-white text-center py-2 px-3">
                                                    <h4 className="text-lg font-bold truncate">{recipeObj.title}</h4>
                                                </div>
                                            </div>

                                            {/* Recipe Description and Button */}
                                            <div className="mt-4">
                                                <div className="text-sm max-h-32 overflow-y-auto div3 text-gray-300 mt-2">
                                                    {renderSummary(recipeObj.summary) || "No description available"}
                                                </div>
                                                <p className="text-sm text-gray-400 mt-2">
                                                    <strong>Prep Time:</strong> {recipeObj.readyInMinutes || "N/A"} mins
                                                </p>
                                                <button
                                                    onClick={() => { setSelectedRecipe(recipeObj), goup() }}
                                                    className="mt-4 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-6 rounded-full shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 hover:bg-gradient-to-l"
                                                >
                                                    View Recipe
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>) : (
                                <div className="flex flex-col items-center   justify-center text-center px-4">
                                    <div className="text-3xl text-center   text-orange-300 font-semibold" >

                                        No favorite recipes available. Start adding your favorites now!

                                    </div>
                                </div>
                            )}
                        </div>


                        {selectedRecipe && <Favrecipes showremove={showremove} setSelectedRecipe={setSelectedRecipe} selectedRecipe={selectedRecipe} getFavs={getFavs} toast={showToast} />}


                    </div>

                </div>


                <Footer />
            </div>

        </>
    );
};

export default Favourite;
