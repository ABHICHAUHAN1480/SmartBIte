import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import login from '../assets/login.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setform] = useState({ name: "", user: "", email: "", password: "", password_confirmation: "" });

  const HandleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match.");
      return;
    }
   else if(form.password.length<7){
      toast.info("Password should be greater than then 7 Characters");
      return;
    }
    else if(form.password.includes(" ")){
      toast.info("Password should not contain the spaces")
      return;
    }
    
    try {
      const response = await axios.post("http://localhost:3001/api/auth/signup", {
        name: form.name,
        user: form.user,
        email: form.email,
        password: form.password.trim(),
      });

     
        toast.success("Signup successful!");
    
      
      localStorage.setItem("token", response.data.token);
      setTimeout(() => navigate("/bmi"), 1000);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        toast.error("Signup failed. Please try again later.");
      }
    }
  };

  return (
    <>
  <ToastContainer autoClose={3000} hideProgressBar={false} closeOnClick  theme= "dark" position="top-right"/>
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className='bg-zinc-950 h-screen flex'>
        <img className='absolute m-2 w-full opacity-30' src={login} alt="Background" />
        <div className='m-auto z-10 w-1/4 bg-opacity-50 rounded-2xl bg-zinc-900'>
          <form className="flex flex-col px-4 py-10" onSubmit={handleSubmit}>
            <input onChange={HandleChange} className='text-[20px] text-slate-50 rounded-md p-2 outline-none hover:border cursor-pointer m-3 bg-zinc-800' type='text' name='name' value={form.name} placeholder='Name' />
            <input onChange={HandleChange} className='text-[20px] text-slate-50 rounded-md p-2 outline-none hover:border cursor-pointer m-3 bg-zinc-800' type='text' name='user' value={form.user} placeholder='User Name' />
            <input onChange={HandleChange} className='text-[20px] text-slate-50 rounded-md p-2 outline-none hover:border cursor-pointer m-3 bg-zinc-800' type='email' name='email' value={form.email} placeholder='Email ID' />
            <input onChange={HandleChange} className='text-[20px] text-slate-50 rounded-md p-2 outline-none hover:border cursor-pointer m-3 bg-zinc-800' type='password' name='password' value={form.password} placeholder='Set Password' />
            <input onChange={HandleChange} className='text-[20px] text-slate-50 rounded-md p-2 outline-none hover:border cursor-pointer m-3 bg-zinc-800' type='password' name='password_confirmation' value={form.password_confirmation} placeholder='Confirm Password' />
            <button className="bg-blue-500 hover:bg-blue-700 w-1/3 m-auto mt-3 text-slate-100 font-bold py-2 px-4 rounded">Sign up</button>
            <Link to='/login' className='text-blue-800 hover:text-blue-700 mx-auto mt-5 text-[18px]'>Already have an account?</Link>
          </form>
        </div>
      </div>
    </div>
    </>  
    );
}

export default Signup;
