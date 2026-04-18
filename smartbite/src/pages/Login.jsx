import React from 'react'
import login from '../assets/login.jpg'
import { Link } from 'react-router-dom'
import { useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/smartbiteApi';

const Login = () => {
  const navigate = useNavigate();
  const [form, setform] = useState({user : "", password: "" });
  const HandleChange=(e)=>{
    setform({ ...form, [e.target.name]: e.target.value })
   
  }
  const [loading, setloading] = useState(false);
  

  const handleSubmit = async (e) => {
    setloading(true);
    e.preventDefault();
    try {
      const response = await authApi.login(form);
      setloading(false);
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/")
    } catch (error) {
      setloading(false);
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials, please try again.");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
  };
  
  return (
    <div className="page-shell flex items-center justify-center px-4 py-10">
      {loading && (
        <div className="modal-overlay z-50 flex items-center justify-center">
          <div className="glass-card flex flex-col items-center gap-4 px-8 py-6">
            <lord-icon
              src="https://cdn.lordicon.com/dupxuoaa.json"
              trigger="loop"
              state="loop-transparency"
              colors="primary:#ffffff"
              style={{ width: 78, height: 78 }}
            ></lord-icon>
            <span className="text-sm font-medium text-slate-100">Loading, please wait...</span>
          </div>
        </div>
      )}

      <img className="absolute inset-0 h-full w-full object-cover opacity-15" src={login} alt="Background" />

      <div className="glass-card z-10 w-full max-w-md p-7 sm:p-8">
        <p className="badge-soft mb-3">Welcome Back</p>
        <h1 className="section-title mb-1 text-left">Log in</h1>
        <p className="section-subtitle mb-6">Continue your nutrition journey with Smartbite.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="input-label" htmlFor="user">Username</label>
            <input
              id="user"
              onChange={HandleChange}
              className="input-field"
              type="text"
              name="user"
              value={form.user}
              placeholder="Enter your username"
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
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Log in
          </button>

          <Link to="/signup" className="block text-center text-sm font-medium text-emerald-300 hover:text-emerald-200">
            New user? Create an account
          </Link>
        </form>
      </div>
    </div>
  
  )
}

export default Login


