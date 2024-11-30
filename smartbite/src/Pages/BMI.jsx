import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bmiimg from '../assets/bmi.jpeg';
import axios from 'axios';

const BMICalculator = () => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState('male');
  const [savedBMI, setSavedBMI] = useState([]);
  const [bmiCategory, setBmiCategory] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const [data, setdata] = useState(false)

  // Calculate BMI
  const calculateBMI = (weight, height) => (weight / ((height / 100) ** 2)).toFixed(1);
  const bmi = calculateBMI(weight, height);
  const minBMI = 15;
  const maxBMI = 40;
  const angle = ((bmi - minBMI) / (maxBMI - minBMI)) * 180;
  const clampedAngle = Math.max(0, Math.min(angle, 180));

  // Determine BMI Category
  useEffect(() => {
    if (bmi < 18.5) {
      setBmiCategory('Underweight');
    } else if (bmi < 22.9) {
      setBmiCategory('Normal');
    } else if (bmi < 27.4) {
      setBmiCategory('Overweight');
    } else {
      setBmiCategory('Obese');
    }
  }, [bmi]);

  // Set colors dynamically based on BMI Category
  let gaugeColor = '#10b981';
  let categoryColor = 'text-green-400';
  let glowEffect = 'shadow-green-500';

  if (bmi < 18.5) {
    gaugeColor = '#3b82f6';
    categoryColor = 'text-blue-400';
    glowEffect = 'shadow-blue-500';
  } else if (bmi >= 25 && bmi < 30) {
    gaugeColor = '#f59e0b';
    categoryColor = 'text-yellow-400';
    glowEffect = 'shadow-yellow-500';
  } else if (bmi >= 30) {
    gaugeColor = '#ef4444';
    categoryColor = 'text-red-400';
    glowEffect = 'shadow-red-500';
  }

  // Save BMI Data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://smartbite-g813.onrender.com/bmi',
        { weight, height, gender, bmiCategory, bmi },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedBMI([...savedBMI, response.data]);
      alert('BMI saved successfully');
      navigate('/allergies');
    } catch (error) {
      console.error('Error saving BMI:', error);
      alert('Failed to save BMI. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
  
      try {
        const res = await fetch("https://smartbite-g813.onrender.com/userdata", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (res.ok) {
          const userData = await res.json();
          console.log(userData.info.bmi)
          setdata(true);
         
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []); 
  const handleBack=()=>{
    navigate("/")
  }
  
  return (


    <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
      <img
        className="w-full h-full absolute -z-10 opacity-35 "
        src={bmiimg}
        alt="BMI Background"
      />
      <div className="flex relative flex-col items-center w-1/2 spediv p-3 rounded-3xl justify-center">
      {data && <span onClick={handleBack} className='absolute z-20 top-3 right-5'>   <lord-icon
        src="https://cdn.lordicon.com/nqtddedc.json"
        trigger="hover"
        state="hover-cross-2"
        colors="primary:#fff"
        style={{ width: 40, height: 40 }}
      /></span>}
        <h2 className="text-[40px] font-serif font-bold mb-8 text-indigo-400">BMI Calculator</h2>

        <div className="flex justify-center mb-8">
          <div className={`relative ${glowEffect}`}>
          <svg width="230" height="230" viewBox="0 0 200  150" xmlns="http://www.w3.org/2000/svg">

  <path
    d="M20,100 A80,80 0 0,1 180,100"
    stroke="#374151"
    strokeWidth="15"
    fill="none"
    strokeLinecap="round"
  />

  {/* Foreground Arc */}
  <path
    d="M20,100 A80,80 0 0,1 180,100" // Same path as the background arc
    stroke={gaugeColor } 
    strokeWidth="15"
    fill="none"
    strokeDasharray="251.32" // Semi-circle circumference: π * 80
    strokeDashoffset={`${251.32 - (clampedAngle / 180) * 251.32}`} // Calculate visible arc length
    strokeLinecap="round"
    style={{
      transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease",
    }}
  />

  {/* Needle */}
  <line
    x1="100"
    y1="100"
    x2="100"
    y2="30"
    stroke="red"
    strokeWidth="4"
    transform={`rotate(${clampedAngle - 90} 100 100)`} // Rotate needle based on clampedAngle
    style={{
      transition: "transform 0.6s ease",
    }}
  />

  {/* Center Circle */}
  <circle cx="100" cy="100" r="8" fill="red" stroke="red" strokeWidth="3" />

  {/* BMI Value */}
  <text
    x="100"
    y="130"
    textAnchor="middle"
    fill="white"
    fontSize="20"
    fontWeight="bold"
  >
    {bmi || "--"}
  </text>



</svg>


          </div>
        </div>

        <div className={`text-center font-semibold ${categoryColor} -my-20 text-lg mb-4`}>
          Category: {bmiCategory}
        </div>

        <div className="w-full max-w-md space-y-6">
          <div>
            <label htmlFor="weight-slider" className="block text-sm mb-2 text-indigo-300">
              Weight (kg): {weight}
            </label>
            <input
              id="weight-slider"
              type="range"
              min="40"
              max="150"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-2 bg-indigo-700 rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label htmlFor="height-slider" className="block text-sm mb-2 text-indigo-300">
              Height (cm): {height}
            </label>
            <input
              id="height-slider"
              type="range"
              min="140"
              max="220"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full h-2 bg-indigo-700 rounded-full appearance-none cursor-pointer"
            />
          </div>

          <div>
            <label htmlFor="gender-select" className="block text-sm mb-2 text-indigo-300">
              Gender:
            </label>
            <select
              id="gender-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-indigo-600 rounded-lg text-indigo-300 focus:outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Health Recommendations */}
        <div className="mt-8 bg-gray-800 p-4 rounded-lg text-center max-w-md shadow-lg">
          <h3 className="text-lg font-semibold text-indigo-300">Health Recommendations</h3>
          <p className="mt-2 text-sm text-gray-400">
            {bmiCategory === 'Underweight' &&
              'Consider a balanced diet with a focus on nutrient-dense foods.'}
            {bmiCategory === 'Normal' && 'Maintain your current lifestyle for overall well-being.'}
            {bmiCategory === 'Overweight' &&
              'Focus on regular physical activity and balanced nutrition.'}
            {bmiCategory === 'Obese' &&
              'Consider a structured health plan with guidance from a healthcare provider.'}
          </p>
        </div>

        {/* Save Button */}<span className='flex gap-8'>
        {data&& <button onClick={handleBack} className='mt-6 rounded-md text-white px-5 py-2 bg-indigo-600 hover:bg-indigo-700' >Go Back</button>}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`mt-6 px-5 py-2 ${
            isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } rounded-md text-white`}
        >
          {isSaving ? 'Saving...' :!data?'Save':'Save to profile'}

        </button>
        </span>
      </div>
    </div>
  );
};

export default BMICalculator;
