import React from 'react'

const Footer = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-zinc-950 to-gray-900   rounded-xl w-full text-center py-12 shadow-xl">
  <div className="max-w-[95%] mx-auto px-6">
    {/* Footer Container */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      {/* Left Column */}
      <div className="text-left space-y-6">
        <div className="text-white text-2xl font-bold">Smartbite</div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Your go-to platform for personalized diet planning and health management. 
          <span className="block mt-2">Stay healthy, stay smart.</span>
        </p>
        <a
          href="/about"
          className="text-blue-400 hover:underline hover:text-blue-500 text-sm transition"
        >
          Learn More About Us →
        </a>
      </div>

      {/* Center Column */}
      <div className="text-center space-y-8">
        {/* Social Media Links */}
        <div className="flex justify-center space-x-6">
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
    style={{width:30,height:30}}>
</lord-icon>
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
    style={{width:30,height:30}}>
</lord-icon>
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
    style={{width:30,height:30}}>
</lord-icon>
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
    style={{width:30,height:30}}>
</lord-icon>
          </a>
        </div>
        {/* Newsletter Subscription */}
        <div className="text-gray-400 text-sm">
          <p className="font-medium">Stay updated with our latest news and tips:</p>
          <div className="flex justify-center mt-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-72 shadow-inner"
            />
            <button className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition duration-300 shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="text-right space-y-6">
        <div className="text-white text-2xl font-bold">Quick Links</div>
        <ul className="space-y-2 text-sm">
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
