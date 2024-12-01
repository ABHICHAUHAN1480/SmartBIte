import React from 'react'
import "../index.css"
import oip from "../assets/OIP.jpeg"
import { useState,useEffect,useRef } from 'react'
import Login from './Login'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
const Allergies = () => {

  let s1 = [
    "Milk", "Eggs", "Fish", "Shellfish", "Tree Nuts", "Peanuts", "Wheat", "Soy", "Sesame", "Corn", "Beef", "Pork", "Chicken", "Apples", "Bananas", "Citrus Fruits", "Carrots", "Celery", "Tomatoes", "Potatoes", "Mustard", "Coriander", "Garlic", "Chocolate", "Gelatin", "Mushrooms", "Oats", "Barley", "Rye", "Buckwheat", "Chickpeas", "Lentils", "Sunflower Seeds", "Poppy Seeds", "Honey", "Yeast", "Quinoa", "Avocado", "Pineapple", "Kiwifruit", "Strawberries", "Paprika", "Coconut", "Eggplant", "Mango", "Lupin", "Durian", "Watermelon", "Lychee", "Persimmon", "Passion Fruit", "Goji Berries", "Figs", "Raspberries", "Blackberries", "Mulberries", "Grapes", "Pomegranate", "Dragon Fruit", "Starfruit", "Cranberries", "Rhubarb", "Chia Seeds", "Pumpkin Seeds", "Flaxseeds","Spirulina","Algae","Saffron","Vanilla","Cloves","Anise","Allspice","Nutmeg","Bay Leaves","Lemongrass","Turmeric","Horseradish","Turnips","Rutabaga","Radish","Leeks","Okra","Bok Choy","Bamboo Shoots","Artichoke","Cabbage","Cauliflower", "Broccoli", "Asparagus", "Green Beans", "Snow Peas", "Sugar Snap Peas", "Water Chestnuts", "Brussels Sprouts", "Kale", "Swiss Chard", "Arugula", "Spinach", "Basil", "Dill", "Thyme", "Parsley", "Rosemary", "Cilantro","Sweet potato","Seafood"
  ];
  const [form, setform] = useState({search: "" });
  const [s2, sets2] = useState(s1);
  const [s3, setS3] = useState(new Set());
  const navigate = useNavigate(); 
  const handleChange = (e) => {
    const searchTerm = e.target.value;
    setform({ ...form, search: searchTerm });
    if (searchTerm === "") {
      sets2(s1);
    } else {
      sets2(s1.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase())));
    }
  };
  const handleSubmit = (item) => {
    setS3((prevSet) => new Set([...prevSet, item]));
    sets2(s2.filter(i => i !== item));
  };

  const handleRemove = (item) => {
    setS3((prevSet) => {
      const newSet = new Set(prevSet);
      newSet.delete(item);
      return newSet;
    });
    sets2([...s2, item]);
  };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://smartbite-g813.onrender.com/allergies',
        { allergies: Array.from(s3) },  // Convert Set to array
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
    } catch (error) {
      console.error('Error saving allergies:', error.response?.data || error.message);
    }
    navigate('/'); 
  };
  


  return (
    <div className="relative min-h-screen w-full overflow-hidden font-serif">
    <div className="bg-zinc-950 h-screen  flex">
      <img className="absolute h-full w-full object-cover opacity-30" src={oip} />
      <div className="m-auto z-10 div1 bg-opacity-50 rounded-2xl bg-zinc-900">
        <div className="text-[35px] sm:text-[40px] md:text-[55px] text-center mt-16">
          Allergy hai to btade abhi hi
        </div>
        <div className="flex flex-col justify-around mt-16 sm:mt-24 md:mt-32 gap-5 md:gap-11 items-center">
          <div className="w-full md:w-1/2">
            <input
              onChange={handleChange}
              className="w-6/12 md:w-7/12 mr-16 py-2 px-4 text-slate-50 rounded-2xl bg-black bg-opacity-35"
              placeholder="Search"
              value={form.search}
              name="search"
            />
            <button onClick={handleSave} className="py-2 px-6 bg-blue-700 rounded-3xl hover:border">
              Save
            </button>
          </div>
          <div className="mx-auto w-[100vw] md:w-[70vw] lg:w-[50%] h-[400px] div3 overflow-y-scroll gap-4 md:gap-14 flex flex-wrap">
            {Array.from(s3).map((i, index) => (
              <div
                key={index}
                className="bg-zinc-800 bg-opacity-70 h-11 cursor-pointer flex items-center gap-2 md:gap-4 hover:border text-slate-50 px-2 sm:px-4 py-2 rounded-2xl"
                onClick={() => handleRemove(i)}
              >
                {i}
                <span className="invert">
                  <lord-icon
                    src="https://cdn.lordicon.com/oqdmuxru.json"
                    trigger="hover"
                  ></lord-icon>
                </span>
              </div>
            ))}
            {s2.map((i, index) => (
              <span
                key={index}
                onClick={() => handleSubmit(i)}
                className="bg-zinc-800 bg-opacity-70 h-11 cursor-pointer hover:border text-slate-50 px-4 text-sm sm:text-[18px] sm:px-10 py-2 rounded-2xl"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default Allergies
