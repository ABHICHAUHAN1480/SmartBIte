import React from 'react'
import Logo from '../Constant/Logo'
import { Link,useLocation } from 'react-router-dom'
import { useState } from 'react'
import Profile from '../Constant/Profile'

const Navbar = () => {
  const [data, setdata] = useState(null)
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'text-red-300' : 'text-white';
  



  const handledata =async()=>{
     const token=localStorage.getItem('token');
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
  return (
    <>
    <div className=' z-20 block w-full bg-zinc-800 fixed ' >
      <div className='py-3    m-2 rounded-lg bg-zinc-900 flex items-center justify-between'>
            <Logo />
            {/* <p className='text-[24px] ml-9 font-normal cursor-default flex items-center gap-3'>addng bhadang </p> */}
            <ul className='flex text-[24px] gap-14  mx-10'>
               <Link to="/" ><li className={`cursor-pointer font-medium ${isActive('/')} hover:text-red-300`}>Home</li></Link> 
              {/* <Link to=""> <li className='cursor-pointer font-medium hover:text-red-300'>Contact us</li></Link>  */}
               
                <Link className= {`cursor-pointer font-medium ${isActive('/recipe')}`} to="/recipe"><li>Recipes</li></Link>
                <Link className={`cursor-pointer font-medium ${isActive('/inventory')}`} to="/inventory"><li>Inventory</li></Link>
                <Link className={`cursor-pointer font-medium ${isActive('/favourites')}`} to="/favourites"><li>Favorite</li></Link>
               <span onClick={handledata} className='cursor-pointer'> <li ><lord-icon src="https://cdn.lordicon.com/hrjifpbq.json" trigger="hover" colors="primary:#e4e4e4" style={{width:40,height:40}}></lord-icon></li></span>
            </ul>
      </div>
    </div>
    {showProfile && <Profile data={data} setShowProfile={setShowProfile} setdata={setdata}   onClose={() => setShowProfile(false)} />}
    </>
  )
}

export default Navbar
