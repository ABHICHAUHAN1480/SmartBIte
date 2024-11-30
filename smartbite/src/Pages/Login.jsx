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
    <div className="relative  min-h-screen w-full overflow-hidden">
    <div className=' bg-zinc-950  h-screen flex'>
      <img className=' absolute m-2 w-full opacity-30' src={login} />
      
      <div className=' m-auto z-10 w-1/4 bg-opacity-50 rounded-2xl bg-zinc-900 ' >
        <form className="flex flex-col px-4  py-10 " onSubmit={handleSubmit} >
          <input onChange={HandleChange} className='text-[20px] w- text-slate-50 rounded-md p-2 outline-none  hover:border cursor-pointer  m-3 bg-zinc-800 ' type='text ' name='user' value={form.user} placeholder='User Name' />
          <input  onChange={HandleChange} className='text-[20px] text-slate-50 rounded-md p-2 outline-none  hover:border cursor-pointer  m-3 bg-zinc-800 ' type='password 'name='password' value={form.password} placeholder='Password' />
          <button  className="bg-blue-500 hover:bg-blue-700 w-1/3 m-auto mt-3 text-slate-100 font-bold py-2 px-4 rounded">
            Log in
          </button>
      <Link to='/signup' className='text-blue-800 hover:text-blue-700 mx-auto mt-5 text-[18px]'>New user! Create an account</Link>
        </form>
      </div>

    </div>
    </div>
  )
}

export default Login
