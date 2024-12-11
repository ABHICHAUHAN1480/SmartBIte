import React from 'react'
import '../index.css/'
import logo from "../assets/biii2.png"
import logo2 from "../assets/logo2.png"
import logo_name from "../assets/logo_name.png"
const Logo = () => {
  return (
    <div className='cursor-default flex gap-0' >
       <img src={logo} className='w-[160px]'  />
       {/* <img src={logo2} className='w-[200px] h-[150px]'  />
       <img src={logo_name} className='w-[200px] h-[150px]'  /> */}
    </div>
    

/* <div className='m-2 cursor-default' >
<span className='text-[24px] font-bold font-Inter, text-red-400'>SMART</span>
<span className='text-[24px] font-bold font-serif text-red-300'></span>
<span className='text-[20px] font-bold font-serif text-green-200'>Bite</span>
</div> */
    
  )
}

export default Logo


