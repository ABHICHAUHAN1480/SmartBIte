import React from 'react'

const Footer = () => {
  return (
    <footer className="relative mt-16 border-t border-white/10 bg-slate-950/90 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-44 w-44 rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="absolute -right-12 bottom-8 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"></div>
      </div>

      <div className="content-shell relative z-10">
        <div className="surface-card grid gap-8 p-6 md:grid-cols-3 md:items-start md:p-8">
          <div className="space-y-3 text-left">
            <p className="text-2xl font-bold text-slate-50">Smartbite</p>
            <p className="text-sm leading-relaxed text-slate-300">
              Personalized diet planning with simple tools for healthier daily decisions.
            </p>
            <a href="/about" className="text-sm font-medium text-emerald-300 hover:text-emerald-200">
              Learn More About Us
            </a>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=100026904045026"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-600/50 bg-slate-800/70 p-2 hover:border-emerald-300/50"
                aria-label="Facebook"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/gnqwqcgx.json"
                  trigger="morph"
                  stroke="light"
                  state="morph-circle"
                  colors="primary:#e4e4e4,secondary:#e4e4e4,tertiary:#545454"
                  style={{ width: 22, height: 22 }}
                />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-600/50 bg-slate-800/70 p-2 hover:border-emerald-300/50"
                aria-label="Twitter"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/jchehboq.json"
                  trigger="hover"
                  stroke="light"
                  state="loop-cycle"
                  colors="primary:#e4e4e4,secondary:#e4e4e4,tertiary:#545454"
                  style={{ width: 22, height: 22 }}
                />
              </a>
              <a
                href="https://www.instagram.com/abhishekrajput1480/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-600/50 bg-slate-800/70 p-2 hover:border-emerald-300/50"
                aria-label="Instagram"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/nnfbxwtf.json"
                  trigger="hover"
                  state="hover-rotate"
                  colors="primary:#e4e4e4,secondary:#e4e4e4,tertiary:#e4e4e4,quaternary:#e4e4e4,quinary:#000000"
                  style={{ width: 22, height: 22 }}
                />
              </a>
              <a
                href="https://www.linkedin.com/in/abhishek-chauhan-a5b717259"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-600/50 bg-slate-800/70 p-2 hover:border-emerald-300/50"
                aria-label="LinkedIn"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/fgctxlnd.json"
                  trigger="hover"
                  state="hover-draw"
                  colors="primary:#e4e4e4,secondary:#000000"
                  style={{ width: 22, height: 22 }}
                />
              </a>
            </div>

            <div>
              <p className="mb-2 text-center text-sm text-slate-300">Stay updated with nutrition tips</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input type="email" placeholder="Enter your email" className="input-field" />
                <button className="btn-primary whitespace-nowrap">Subscribe</button>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-left md:text-right">
            <p className="text-xl font-semibold text-slate-50">Quick Links</p>
            <ul className="space-y-1 text-sm text-slate-300">
              <li>
                <a href="/privacy-policy" className="hover:text-emerald-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-emerald-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-emerald-200">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400 sm:text-sm">
          &copy; 2026 All Rights Reserved. Powered by <span className="font-semibold text-emerald-300">Smartbite</span>.
        </p>
      </div>
    </footer>
  )
}

export default Footer


