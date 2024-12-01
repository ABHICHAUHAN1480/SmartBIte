import React from 'react'
import login from '../assets/login.jpg'
import { Link } from 'react-router-dom'
import { useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [form, setform] = useState({user : "", password: "" });
  const HandleChange=(e)=>{
    setform({ ...form, [e.target.name]: e.target.value })
   
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://smartbite-g813.onrender.com/api/auth/login", form);
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/")
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials, please try again.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
    <div className="bg-zinc-950 h-screen flex items-center justify-center">
      <img 
        className="absolute w-full h-full object-cover opacity-20" 
        src={login} 
        alt="Background" 
      />
      <div className="z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg bg-opacity-50 rounded-2xl bg-zinc-900 p-6 shadow-lg">
        <h1 className="text-center text-2xl sm:text-3xl text-slate-100 font-bold mb-6">
          Log in
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input 
            onChange={HandleChange} 
            className="text-[16px] md:text-[18px] text-slate-50 rounded-md p-3 outline-none bg-zinc-800 focus:ring focus:ring-blue-500 transition" 
            type="text" 
            name="user" 
            value={form.user} 
            placeholder="User Name" 
          />
          <input 
            onChange={HandleChange} 
            className="text-[16px] md:text-[18px] text-slate-50 rounded-md p-3 outline-none bg-zinc-800 focus:ring focus:ring-blue-500 transition" 
            type="password" 
            name="password" 
            value={form.password} 
            placeholder="Password" 
          />
          <button 
            className="bg-blue-500 hover:bg-blue-700 w-full sm:w-2/3 lg:w-1/3 mx-auto mt-3 text-slate-100 font-bold py-2 px-4 rounded shadow-md transition hover:scale-105">
            Log in
          </button>
          <Link 
            to="/signup" 
            className="text-blue-800 hover:text-blue-600 mx-auto text-[16px] sm:text-[18px] transition">
            New user? Create an account
          </Link>
        </form>
      </div>
    </div>
  </div>
  
  )
}

export default Login
