import React from 'react'

const Footer = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-zinc-950 to-gray-900 rounded-xl w-full text-center py-12 shadow-xl">
    <div className="max-w-[95%] mx-auto px-4 sm:px-6">
      {/* Footer Container */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-center">
        {/* Left Column */}
        <div className="space-y-4 text-left md:text-center">
          <div className="text-white text-xl font-bold md:text-2xl">Smartbite</div>
          <p className="text-gray-400 text-sm leading-relaxed md:text-base">
            Your go-to platform for personalized diet planning and health management.
            <span className="block mt-2">Stay healthy, stay smart.</span>
          </p>
          <a
            href="/about"
            className="text-blue-400 hover:underline hover:text-blue-500 text-sm transition md:text-base"
          >
            Learn More About Us →
          </a>
        </div>
  
        
        <div className="space-y-0 md:space-y-4">
        
          <div className="flex justify-center space-x-4 sm:space-x-6">
            <a
              href="https://www.facebook.com/profile.php?id=100026904045026"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition duration-300"
              aria-label="Facebook"
            >
              <lord-icon
                src="https://cdn.lordicon.com/gnqwqcgx.json"
                trigger="morph"
                stroke="light"
                state="morph-circle"
                colors="primary:#e4e4e4,secondary:#e4e4e4,tertiary:#545454"
                style={{ width: 25, height: 25 }}
              />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition duration-300"
              aria-label="Twitter"
            >
              <lord-icon
                src="https://cdn.lordicon.com/jchehboq.json"
                trigger="hover"
                stroke="light"
                state="loop-cycle"
                colors="primary:#e4e4e4,secondary:#e4e4e4,tertiary:#545454"
                style={{ width: 25, height: 25 }}
              />
            </a>
            <a
              href="https://www.instagram.com/abhishekrajput1480/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition duration-300"
              aria-label="Instagram"
            >
              <lord-icon
                src="https://cdn.lordicon.com/nnfbxwtf.json"
                trigger="hover"
                state="hover-rotate"
                colors="primary:#e4e4e4,secondary:#e4e4e4,tertiary:#e4e4e4,quaternary:#e4e4e4,quinary:#000000"
                style={{ width: 25, height: 25 }}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/abhishek-chauhan-a5b717259"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition duration-300"
              aria-label="LinkedIn"
            >
              <lord-icon
                src="https://cdn.lordicon.com/fgctxlnd.json"
                trigger="hover"
                state="hover-draw"
                colors="primary:#e4e4e4,secondary:#000000"
                style={{ width: 25, height: 25 }}
              />
            </a>
          </div>
         
          <div className="space-y-4">
            <p className="text-gray-400 text-sm md:text-base">
              Stay updated with our latest news and tips:
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-400  md:w-72"
              />
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-blue-600 transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
  
        
        <div className="space-y-4 text-center md:text-right">
          <div className="text-white text-xl font-bold md:text-2xl">Quick Links</div>
          <ul className=" flex  gap-4 justify-center text-sm md:flex-col ">
            <li>
              <a
                href="/privacy-policy"
                className="text-gray-400 hover:text-white transition"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="text-gray-400 hover:text-white transition"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="text-gray-400 hover:text-white transition"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>
  
      {/* Decorative Glow */}
      <div className="absolute inset-0 blur-3xl opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-1/3 h-64 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-1/3 h-72 bg-green-500 rounded-full animate-pulse"></div>
      </div>
  
      {/* Bottom Bar */}
      <div className="mt-3 text-gray-500 text-xs sm:text-sm">
        <p>
          &copy; 2024 All Rights Reserved. Powered by{" "}
          <span className="text-blue-400 font-semibold">Smartbite</span>.
        </p>
      </div>
    </div>
  </div>
  
  

  
  
  
  
  )
}

export default Footer
