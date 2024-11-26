import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../index.css"
import oip from "../assets/bg.jpg"
import { useState,useEffect,useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Recipe2 from '../Constant/Recipe2'
const Lately = () => {
  const location = useLocation();
  const { moodLevel, moodText } = location.state || {};
    let s1 = [
        "Education","Workout","Running","Reading","Playing","Sleep","Working ","video games","Writting","Walking","Nothing","Singing"
];
const [form, setform] = useState({search: "" });
const [s2, sets2] = useState(s1);
const [s3, setS3] = useState(new Set());
const navigate = useNavigate();
const [showRecipe, setshowRecipe] = useState(false); 

const check=()=>{
  const token = localStorage.getItem('token');

if (!token) {
   toast("No token found. Please login again.");
   setTimeout(() => navigate("/login"), 3000);
   return;
}
}
useEffect(() => {
  check();
  }
, [])
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
const handleSave = () => {
 setshowRecipe(true);
   
};
const handlecross=()=>{
  navigate("/mood")
}
  return (
    <div className="relative  min-h-screen w-full overflow-hidden font-serif">
     {showRecipe && <Recipe2 data={moodText}/>}
        <ToastContainer
        
        autoClose={3000}
        hideProgressBar={false}
      
        closeOnClick
      />
    <div className=' bg-zinc-950  h-screen flex'>
   
      <img className=' absolute h-full w-full opacity-50' src={oip} />
    
      <div className=' m-auto z-10 div1 bg-opacity-50 rounded-2xl bg-zinc-900   ' >
        <span onClick={handlecross} className='absolute ml-[96%] mt-5'>
      <lord-icon
    src="https://cdn.lordicon.com/nqtddedc.json"
    trigger="in"
    delay="500"
    state="in-cross"
    colors="primary:#b4b4b4"
    style={{ width: "40px", height: "40px" }}>
</lord-icon>
</span>
        <div className='text-[55px] text-center mt-16 '>What are u doing lately   </div>
        <div className='flex flex-col justify-around mt-32  gap-11 items-center '>
         <div className='w-1/2 '>  <input onChange={handleChange} className=' w-8/12  mr-16 py-2  px-4 text-slate-50 rounded-2xl   bg-black bg-opacity-35' placeholder='Search' value={form.search} name='search' />
         <button onClick={handleSave} className='py-2 px-6 bg-blue-700 rounded-3xl hover:border'>Save</button></div>
          <div className='mx-auto  div2 overflow-y-scroll gap-14 flex flex-wrap '>
          {Array.from(s3).map((i, index) => (
              <div 
                key={index} 
                className='bg-zinc-800 bg-opacity-70 h-11 cursor-pointer flex items-center gap-4 hover:border text-slate-50 px-4 py-2 rounded-2xl'
                onClick={() => handleRemove(i)}
              >
                {i}
                <span className='invert'>
                  <lord-icon src="https://cdn.lordicon.com/oqdmuxru.json" trigger="hover"></lord-icon>
                </span>
              </div>
            ))}
            {s2.map((i, index) => (
              <span key={index} onClick={() => handleSubmit(i)}  className='bg-zinc-800 bg-opacity-70 h-11 cursor-pointer hover:border text-slate-50  px-10 py-2 rounded-2xl'>{i}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  </div>
  )
}

export default Lately
