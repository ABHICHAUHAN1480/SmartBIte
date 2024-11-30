import React, { useEffect } from 'react'
import Navbar from '../Component/Navbar'
import Footer from '../Component/Footer'
import mood from '../assets/mood3.jpg'
import m3 from '../assets/m3.jpg'
import m5 from '../assets/m5.jpg'
import inv from '../assets/inventory.jpg'
import del from '../assets/fire.svg'

import Ring from '../Constant/Ring'
import  NutritionalGraphs from '../Constant/BarGraphs'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
const Home = () => {
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    const offset = 50; 
    const elementPosition = featuresRef.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
  
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  
}, [])


  const navigate = useNavigate();
  // trail k liye hai nakli data
  const activityData = [
    { value: 0.7,  startColor: '#FF6347',endColor: '#FFC300',icon: del }, 
   
  ];
  // const nutrientData = [
  //   { label: 'Protein', value: 30, color: '#4CAF50' },
  //   { label: 'Fat', value: 20, color: '#FF5722' },
  //   { label: 'Carbs', value: 50, color: '#2196F3' },]
  const gotomoodmeals = () => {
    navigate("/mood");
  };
  const gotoinventory=()=>{
  navigate("/inventory")
  };

  const gotobmi=()=>{
    navigate("/bmi")
  }
  const gotoFavoriteRecipes=()=>{
    navigate('/favourites')
  }
  const proteinData = [
    { day: 'Mon', Protein: 50, Calories: 200, Fat: 70 },
    { day: 'Tue', Protein: 40, Calories: 220, Fat: 80 },
    { day: 'Wed', Protein: 55, Calories: 210, Fat: 75 },
    { day: 'Thu', Protein: 65, Calories: 430, Fat: 55 },
    { day: 'Fri', Protein: 10, Calories: 440, Fat: 90 },
    { day: 'Sat', Protein: 60, Calories: 220, Fat: 60 },
    { day: 'Sun', Protein: 50, Calories: 0, Fat: 70 },
  ];
 
  return (
   <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#333] to-[#555] animate-gradient-animate">
  <Navbar />
  <div className="mt-20 mb-20">
    {/* Hero Section */}
    <div
      className="relative text-center py-20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      <h1 className="text-6xl font-extrabold text-white drop-shadow-md animate-fade-in">
        Welcome to <span className="text-green-500">SmartBite</span>
      </h1>
      <p className="text-xl text-gray-200 mt-6 max-w-3xl mx-auto animate-slide-in">
        Your AI-powered partner in personalized diet planning. Discover recipes, track nutrition, and manage your meals effortlessly.
      </p>
      <div className="flex flex-col items-center mt-8">
        <button className="bg-green-600 hover:bg-green-500 text-xl text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 mb-4">
          Get Started
        </button>
        <button
              onClick={scrollToFeatures}
              className="text-green-400 hover:text-green-300 text-lg transition-colors animate-bounce"
            >
              Learn More <i className="ml-2 fas fa-arrow-down"></i>
            </button>
      </div>
    </div>
{/*       
       <div className="mt-10 px-4 sm:px-12 relative">
  <h2 className="text-4xl text-white font-semibold mb-12 text-center">
    Your Daily Activity Rings
  </h2>
  <div className="flex justify-center items-center gap-10 h-[380px] mb-12 bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800 p-6 rounded-lg shadow-lg">
    {[
      { color: "text-green-500", label: "Protein", value: 46, icon: "🥩" },
      { color: "text-red-500", label: "Fat", value: 23, icon: "🛢️" },
      { color: "text-blue-500", label: "Carbs", value: 89, icon: "🍞" },
      { color: "text-yellow-500", label: "Calories", value: 2100, icon: "🔥" },
    ].map((item, index) => (
      <div
        key={index}
        className="flex flex-col items-center gap-4 transition-transform transform hover:scale-110 duration-300 group"
      >
        <div className="relative">
          <Ring data={activityData} size={150} strokeWidth={15} label={item.value}  ican={item.icon} />
          <span className="absolute inset-0 flex items-center justify-center -mt-8 text-4xl">
            {item.icon}
           
          </span>
          <span  className="absolute inset-0 flex items-center justify-center -mb-10 text-2xl">{item.value}</span>
        </div>
        <span className={`text-4xl font-serif ${item.color} transform hover:translate-y-1`}>
          {item.label}
        </span>
      </div>
    ))}
  </div>
</div>
    <div className="mb-16">
  <h2 className="text-4xl text-white font-semibold mb-12 text-center">
    Nutritional Breakdown
  </h2>
  <div className="flex justify-center gap-8 flex-wrap">
    {["Protein", "Calories", "Fat"].map((nutrient, index) => (
      <div
      className='w-[30%]'
        key={index}
      >
       
        <NutritionalGraphs proteinData={proteinData} nutrient={nutrient} />
      </div>
    ))}
  </div>
</div> */}

 {/* mt-20 */}
    <div ref={featuresRef} id="features" className="space-y-16 px-4 sm:px-8 lg:px-16 ">
  <h2 className="text-4xl text-white font-semibold mb-12 text-center">
    Explore Features
  </h2>
  <div className="space-y-16">
    {[
      {
        title: "Mood-Based Meals",
        description:
          "Discover meals tailored to your mood. Whether you're feeling energetic, calm, or in need of comfort, we have something for you.",
        color: "green",
        icon: "🍲",
        quickFacts: [
          "100+ mood-specific recipes",
          "AI-powered mood analysis",
          "Save favorite meals easily",
        ],
    
        onClick: gotomoodmeals,
      },
      {
        title: "Your Inventory",
        description:
          "Manage your inventory effortlessly. Add, remove, and update items in just a few clicks.",
        color: "blue",
        icon: "📦",
        quickFacts: [
          "Track expiry dates",
          "Smart suggestions based on inventory",
          "Sync across devices",
        ],
        image: "https://via.placeholder.com/150", // Replace with actual image URL
        onClick: gotoinventory,
      },
      {
        title: "BMI Calculator",
        description:
          "Quickly calculate your Body Mass Index (BMI) to understand your health status and guide your health decisions.",
        color: "yellow",
        icon: "📊",
        quickFacts: [
          "Customizable for gender/age",
          "BMI-based health tips",
          "Track BMI trends over time",
        ],
        image: "https://via.placeholder.com/150", // Replace with actual image URL
        onClick: gotobmi,
      },
      {
        title: "Favorite Recipes",
        description:
          "Easily access and manage your favorite recipes in one place. Find inspiration from your saved dishes and create delightful meals effortlessly.",
          color: "purple",
          icon: "💜",
        quickFacts: [
          "Quick access to saved recipes",
          "Organize your favorites",
          "Seamless navigation",
        ],
        onClick: gotoFavoriteRecipes, // Define this function to navigate to the Favorite Recipes page
      },
    ].map((card, index) => (
      <div
        key={index}
        className={`relative group flex flex-col lg:flex-row items-center lg:items-start bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800 rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition-transform duration-500 overflow-hidden border-2 border-transparent hover:border-${card.color}-500`}
      >
        {/* Background Glow */}
        <div
          className={`absolute inset-0 rounded-lg blur-3xl opacity-0  group-hover:opacity-50 transition-all duration-700 ${card.color === 'yellow' ? 'bg-yellow-500' : (card.color==='purple'?`bg-purple-500`:`bg-${card.color}-500`)}`}
        ></div>

        {/* Left Section (Icon + Image) */}
        <div className="p-0 flex flex-col items-center lg:p-8 md:p-6 sm:p-4  lg:w-1/3">
          <div
            className="text-[100px] lg:text-[175px] md:text-[150px] sm:text-[130px]  text-white drop-shadow-md transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500" >
            {card.icon}
          </div>
          {/* <img
            src={card.image}
            alt={`${card.title} illustration`}
            className="w-full mt-6 rounded-md shadow-md transform group-hover:scale-105 transition-transform duration-500"
          /> */}
        </div>

        {/* Right Section (Content + Buttons) */}
        <div className="flex-1 p-8 lg:px-12">
          <h3
            className={`text-4xl  text-${card.color === 'yellow' ? 'yellow-500' : (card.color==='purple'?`purple-500`:`${card.color}-500`)} font-bold mb-4 leading-tight`}
          >
            {card.title}
          </h3>
          <p className="text-lg text-slate-300 mb-6">{card.description}</p>

          {/* Quick Facts */}
          <ul className="list-disc list-inside text-slate-400 mb-6 space-y-2">
            {card.quickFacts.map((fact, factIndex) => (
              <li key={factIndex} className="text-base">
                {fact}
              </li>
            ))}
          </ul>

          {/* Buttons */}
          <div className="  flex  flex-col gap-4  sm:flex-row">
            <button
              onClick={card.onClick}
              className={`${card.color === 'yellow' ? 'bg-yellow-600' : (card.color==='purple'?`bg-purple-600`:`bg-${card.color}-600`)}  hover:${card.color === 'yellow' ? 'bg-yellow-500' : (card.color==='purple'?`bg-purple-500`:`bg-${card.color}-500`)} text-white font-bold py-3 w-full sm:px-8 sm:w-auto rounded-md shadow-lg transform hover:scale-105 transition-transform duration-300`}
            >
              Explore {card.title}
            </button>
            <button
              className="  bg-zinc-700 hover:bg-zinc-600 text-slate-300  font-bold py-3  w-full sm:px-8 sm:w-auto  rounded-md shadow-lg transform hover:scale-105 transition-transform duration-300"  >
              Learn More
            </button>
          </div>
        </div>

        {/* Decorative Circle */}
        <div
          className={`absolute bottom-0 right-0 h-96 w-32 lg:h-48 lg:w-48 rounded-full   ${card.color === 'yellow' ? 'bg-yellow-600' : `bg-${card.color}-600`}  opacity-20 blur-3xl transform scale-125 lg:scale-150`}
        ></div>
      </div>
    ))}
  </div>
</div>







  </div>
  <Footer />
</div>

  
  
  

  )
}

export default Home
