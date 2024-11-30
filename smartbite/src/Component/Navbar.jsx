import React from 'react'
import Logo from '../Constant/Logo'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Profile from '../Constant/Profile'

const Navbar = () => {
  const [data, setdata] = useState(null)
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'text-red-300' : 'text-white';




  const handledata = async () => {
    const token = localStorage.getItem('token');
    let res = await fetch("http://localhost:3001/userdata", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    if (res.ok) {
      const userData = await res.json();
      setdata(userData);


      setShowProfile(prevState => !prevState);
    } else {
      console.error('Failed to fetch user data');
    }
  }
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
<>
  <div className="z-20 block w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 fixed shadow-lg">
    <div className="py-3 px-4 m-2 rounded-lg flex items-center justify-between">
      {/* Logo */}
      <Logo />

      {/* Hamburger Menu for Small Screens */}
      <div className="md:hidden flex gap-4 justify-center items-center">
        <button
          onClick={()=>{toggleMenu();setShowProfile(false)}}
          className="text-white focus:outline-none focus:ring-2 focus:ring-red-500 p-2"
        >
          <lord-icon
            src="https://cdn.lordicon.com/mecwbjnp.json"
            trigger="click"
            colors="primary:#e4e4e4,secondary:#e4e4e4"
            style={{ width: 35, height: 35 }}
          ></lord-icon>
        </button>
        <span onClick={handledata} className="cursor-pointer">
              
                <lord-icon
                  src="https://cdn.lordicon.com/hrjifpbq.json"
                  trigger="hover"
                  colors="primary:#e4e4e4"
                  style={{ width: 35, height: 35 }}
                ></lord-icon>
              
            </span>
      </div>

      {/* Navigation Links for Desktop */}
      <ul className="hidden md:flex text-[18px] lg:text-[22px] gap-6 lg:gap-12 mx-6">
        <Link to="/">
          <li
            className={`cursor-pointer font-medium transition duration-300 ${isActive(
              "/"
            )} hover:text-red-400 hover:scale-110`}
          >
            Home
          </li>
        </Link>
        <Link to="/recipe">
          <li
            className={`cursor-pointer font-medium transition duration-300 ${isActive(
              "/recipe"
            )} hover:text-red-400 hover:scale-110`}
          >
            Recipes
          </li>
        </Link>
        <Link to="/inventory">
          <li
            className={`cursor-pointer font-medium transition duration-300 ${isActive(
              "/inventory"
            )} hover:text-red-400 hover:scale-110`}
          >
            Inventory
          </li>
        </Link>
        <Link to="/favourites">
          <li
            className={`cursor-pointer font-medium transition duration-300 ${isActive(
              "/favourites"
            )} hover:text-red-400 hover:scale-110`}
          >
            Favorite
          </li>
        </Link>
        <span onClick={handledata} className="cursor-pointer">
          <li className="flex items-center justify-center">
            <lord-icon
              src="https://cdn.lordicon.com/hrjifpbq.json"
              trigger="hover"
              colors="primary:#e4e4e4"
              style={{ width: 40, height: 40 }}
            ></lord-icon>
          </li>
        </span>
      </ul>
    </div>

    {/* Mobile Menu with Overlay */}
    {menuOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-30">
         
        <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-lg z-40">
        <span className='absolute top-4 left-4'><Logo /></span>
          <button
             onClick={() => { closeMenu();setShowProfile(false);}}
            className="absolute top-4 right-4 text-white hover:text-red-400"
          >
            <lord-icon
              src="https://cdn.lordicon.com/rivoakkk.json"
              trigger="click"
              colors="primary:#e4e4e4"
              style={{ width: 30, height: 30 }}
            ></lord-icon>
          </button>
          <ul className="space-y-6 text-[18px] mt-8">
            <Link to="/">
              <li
                className={`cursor-pointer font-medium ${isActive(
                  "/"
                )} hover:text-red-300 hover:scale-105 transition`}
                onClick={closeMenu}
              >
                Home
              </li>
            </Link>
            <Link to="/recipe">
              <li
                className={`cursor-pointer font-medium ${isActive(
                  "/recipe"
                )} hover:text-red-300 hover:scale-105 transition`}
                onClick={closeMenu}
              >
                Recipes
              </li>
            </Link>
            <Link to="/inventory">
              <li
                className={`cursor-pointer font-medium ${isActive(
                  "/inventory"
                )} hover:text-red-300 hover:scale-105 transition`}
                onClick={closeMenu}
              >
                Inventory
              </li>
            </Link>
            <Link to="/favourites">
              <li
                className={`cursor-pointer font-medium ${isActive(
                  "/favourites"
                )} hover:text-red-300 hover:scale-105 transition`}
                onClick={closeMenu}
              >
                Favorite
              </li>
            </Link>
        
          </ul>
        </div>
      </div>
    )}
  </div>

  {/* Profile Section */}
  {showProfile && (
    <Profile
      data={data}
      setShowProfile={setShowProfile}
      setdata={setdata}
      onClose={() => setShowProfile(false)}
    />
  )}
</>

  
  

  )
}

export default Navbar
