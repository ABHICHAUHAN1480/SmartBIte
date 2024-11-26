import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ye wali sliders me ayyegngi  
import neutral from "../assets/emojies/neutral.svg";
import sad from "../assets/emojies/sad.svg";
import happy from "../assets/emojies/happy.svg";
import bad from "../assets/emojies/bad.svg";
import haha1 from "../assets/emojies/haha1.svg";
import haha2 from "../assets/emojies/haha2.svg";
// ye wali hai niche

import cry from "../assets/emojies/cry.svg";
import smile from "../assets/emojies/smile.svg";
import angry from "../assets/emojies/angry.svg";
import demon from "../assets/emojies/demon.svg";
import playful from "../assets/emojies/playful.svg";
import comfort from "../assets/emojies/comfort.svg"
import love from "../assets/emojies/love.svg"
import focused from "../assets/emojies/focused.svg"
import motivated from "../assets/emojies/motivated.svg"
import dizzy from "../assets/emojies/dizzy.svg"
import cozy from "../assets/emojies/cozy.svg"
import refreshing from "../assets/emojies/refreshing.svg"
import Indulgent from "../assets/emojies/Indulgent.svg"
const Mood = () => {
  const navigate = useNavigate();
  const moodarray=[{
    emoji:dizzy,
    text:"Sophisticate"
  },
  {
    emoji:cry,
    text:"Very sad"
  },
  {
    emoji:smile,
    text:"Comforted"
  },
  {
    emoji:angry,
    text:"Angry"
  },
  {
    emoji:demon,
    text:"Adventurous"
  },
  {
    emoji:motivated,
    text:"Motivated"
  },

  {
    emoji:cozy,
    text:"Cozy"
  },
  {
    emoji:refreshing,
    text:"Refreshing"
  },
  {
    emoji:Indulgent,
    text:"Indulgent"
  },
 
  {
    emoji:comfort,
    text:"Comfort"
  },
 
  {
    emoji:love,
    text:"Romantic"
  },
 
 
 
  
  {
    emoji:focused,
    text:"focused"
  },
 
  { emoji: playful, text: "Playful" },
 
  

  
]
  const [mood, setMood] = useState(50)
  const [isDragging, setIsDragging] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState('sad');
  const [currentLabel, setCurrentLabel] = useState('Sad');
  const sliderRef = useRef(null);

  
  useEffect(() => {
    let emoji;
    let label;

    if (mood <= 20) {
      emoji = sad;
      label = "Sad";
    } else if (mood > 55 && mood <= 70) {
      emoji = happy;
      label = "Happy";
    } else if (mood >= 45 && mood <= 55) {
      emoji = neutral;
      label = "Neutral";
    } else if (mood > 20 && mood <= 45) {
      emoji = bad;
      label = "Bad";
    } else if (mood > 70 && mood <= 95) {
      emoji = haha2;
      label = "Very Happy";
    } else {
      emoji = haha1;
      label = "Excited";
    }

    setCurrentEmoji(emoji);
    setCurrentLabel(label);
  }, [mood]); 

 
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging && sliderRef.current) {
      const slider = sliderRef.current;
      const rect = slider.getBoundingClientRect();
      const newMood = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      setMood(newMood);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleSave = () => {
    navigate('/lately', { state: { moodLevel: Math.round(mood), moodText: currentLabel } });
  };
  const handleback=()=>{
    navigate('/recipe')
  }

  const handleEmojiClick = (emojiText) => {
    navigate('/lately', { state: { moodLevel: null, moodText: emojiText } });
  };
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleSliderClick = (e) => {
    const slider = sliderRef.current;
    const rect = slider.getBoundingClientRect();
    const newMood = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    setMood(newMood);
  };

  const getSliderColor = () => {
    const red = Math.min(255, Math.max(0, 255 - (mood * 2.55))); // Red decreases as mood increases
    const green = Math.min(255, Math.max(0, mood * 2.55)); // Green increases as mood increases
    const blue = 100; // Keeping blue constant for smooth transition
    return `linear-gradient(to right, rgba(${red}, ${green}, ${blue}, 0.2), rgba(${green}, ${red}, ${blue}, 0.8))`;
  };




  return (
    <div className="h-screen  w-full absolute text-white flex flex-col items-center p-6"
    style={{
      background: `radial-gradient(circle at center, rgba(${255 - mood * 2.5}, ${
        mood * 2.5
      }, 255, 0.8), rgba(${30 + mood}, ${30 + mood}, 50, 0.9))`,
      transition: "background 0.8s ease",
    }}
    >
    {/* Back Button */}
    <span
      onClick={handleback}
      className="absolute top-6 right-6 cursor-pointer"
    >
      <lord-icon
        style={{ width: "50px", height: "50px" }}
        src="https://cdn.lordicon.com/nqtddedc.json"
        trigger="hover"
        colors="primary:#66eece"
      ></lord-icon>
    </span>
  
    {/* Header */}
    <div className="mt-12 text-center">
      <h2 className="text-5xl font-bold font-serif mb-4">How are you feeling?</h2>
      <p className="text-lg text-gray-300">Move the slider or select an emoji below to express your mood.</p>
    </div>
  
    {/* Mood Emoji and Label */}
    <div className="flex flex-col items-center mt-10">
      <img
        src={currentEmoji}
        alt="Current Mood Emoji"
        className="h-20 w-20 transition-transform duration-300"
      />
      <span className="text-4xl font-semibold mt-4">{currentLabel}</span>
    </div>
  
    {/* Slider */}
    <div className="w-1/2 mt-8 bg-gray-700 bg-opacity-50 p-4 rounded-2xl shadow-lg">
      <div
        ref={sliderRef}
        className="relative h-2 rounded-lg cursor-pointer"
        style={{ background: getSliderColor() }} 
        onClick={handleSliderClick}
      >
        <div
          className="absolute top-0 -mt-2 w-6 h-6 bg-blue-500 rounded-full cursor-pointer shadow-md transition-transform duration-300 ease-in-out"
          style={{ left: `${mood}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
        ></div>
      </div>
    </div>
  
    {/* Mood Level and Save Button */}
    <div className="flex items-center mt-6 text-lg">
      <p>
        Mood Level: <span className="font-semibold text-yellow-400">{Math.round(mood)}</span>
      </p>
      <button
        onClick={handleSave}
        className="ml-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-transform duration-300 transform hover:scale-105"
      >
        Save
      </button>
    </div>
  
    {/* Mood Emoji Grid */}
    <div className="mt-8 w-11/12 max-h-[40vh] overflow-y-auto div3 grid grid-cols-3 md:grid-cols-5 gap-6 p-4 bg-gray-800 bg-opacity-40 rounded-3xl shadow-lg">
      {moodarray.map((emoji, index) => (
        <div
          key={index}
          onClick={() => handleEmojiClick(emoji.text)}
          className="flex flex-col items-center cursor-pointer p-4 bg-gray-700 bg-opacity-50 rounded-xl shadow-md hover:bg-opacity-100 hover:scale-105 transition-transform duration-300"
        >
          <img src={emoji.emoji} alt={emoji.text} className="h-14 mb-2" />
          <span className="text-sm font-semibold">{emoji.text}</span>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Mood;
