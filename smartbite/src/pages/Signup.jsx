import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/smartbiteApi';
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
      const response = await authApi.signup({
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
  <div className="page-shell flex items-center justify-center px-4 py-10">
    <img className="absolute inset-0 h-full w-full object-cover opacity-15" src={login} alt="Background" />

    <div className="glass-card z-10 w-full max-w-lg p-7 sm:p-8">
      <p className="badge-soft mb-3">Get Started</p>
      <h1 className="section-title mb-1 text-left">Create account</h1>
      <p className="section-subtitle mb-6">Set up your profile and unlock personalized meal planning.</p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="input-label" htmlFor="name">Full name</label>
          <input
            id="name"
            onChange={HandleChange}
            className="input-field"
            type="text"
            name="name"
            value={form.name}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="input-label" htmlFor="user">Username</label>
          <input
            id="user"
            onChange={HandleChange}
            className="input-field"
            type="text"
            name="user"
            value={form.user}
            placeholder="Pick a username"
          />
        </div>

        <div>
          <label className="input-label" htmlFor="email">Email</label>
          <input
            id="email"
            onChange={HandleChange}
            className="input-field"
            type="email"
            name="email"
            value={form.email}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="input-label" htmlFor="password">Password</label>
          <input
            id="password"
            onChange={HandleChange}
            className="input-field"
            type="password"
            name="password"
            value={form.password}
            placeholder="Create a password"
          />
        </div>

        <div>
          <label className="input-label" htmlFor="password_confirmation">Confirm password</label>
          <input
            id="password_confirmation"
            onChange={HandleChange}
            className="input-field"
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            placeholder="Re-enter password"
          />
        </div>

        <button className="btn-primary w-full">Sign up</button>
        <Link to="/login" className="block text-center text-sm font-medium text-emerald-300 hover:text-emerald-200">
          Already have an account?
        </Link>
      </form>
    </div>
  </div>

    </>  
    );
}

export default Signup;


