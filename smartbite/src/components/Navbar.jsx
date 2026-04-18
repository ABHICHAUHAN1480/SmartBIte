import React from 'react'
import Logo from '../components/Logo'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Profile from '../components/Profile'
import { userApi } from '../api/smartbiteApi';
const Navbar = () => {
  const [data, setdata] = useState(null)
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const isActive = (path) =>
    location.pathname === path
      ? 'text-emerald-200 bg-emerald-400/15 border border-emerald-300/30'
      : 'text-slate-200 hover:text-emerald-100';




  const handledata = async () => {
    try {
      const res = await userApi.getUserData();
      const userData = res.data;
      setdata(userData);
      setShowProfile(prevState => !prevState);
    } catch (_error) {
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

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Recipes', path: '/recipe' },
    { label: 'Inventory', path: '/inventory' },
    { label: 'Favorite', path: '/favourites' },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <nav className="content-shell">
          <div className="my-2 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/75 px-3 py-3 shadow-lg shadow-black/20 md:px-5">
            <Logo />

            <div className="flex items-center gap-3 md:hidden">
              <button
                aria-label="Open menu"
                onClick={() => {
                  toggleMenu();
                  setShowProfile(false);
                }}
                className="rounded-xl border border-slate-600/60 bg-slate-800/80 p-2"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/mecwbjnp.json"
                  trigger="click"
                  colors="primary:#e4e4e4,secondary:#e4e4e4"
                  style={{ width: 30, height: 30 }}
                ></lord-icon>
              </button>
              <button
                aria-label="Open profile"
                onClick={handledata}
                className="rounded-xl border border-slate-600/60 bg-slate-800/80 p-2"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/hrjifpbq.json"
                  trigger="hover"
                  colors="primary:#e4e4e4"
                  style={{ width: 30, height: 30 }}
                ></lord-icon>
              </button>
            </div>

            <ul className="hidden items-center gap-2 text-sm lg:text-base md:flex">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`inline-flex rounded-xl px-4 py-2 font-medium transition-all ${isActive(item.path)}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  aria-label="Open profile"
                  onClick={handledata}
                  className="ml-2 rounded-xl border border-slate-600/60 bg-slate-800/80 p-1.5 hover:border-emerald-300/60"
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/hrjifpbq.json"
                    trigger="hover"
                    colors="primary:#e4e4e4"
                    style={{ width: 34, height: 34 }}
                  ></lord-icon>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {menuOpen && (
          <div className="modal-overlay md:hidden">
            <div className="mx-4 mt-4 rounded-2xl border border-white/15 bg-slate-900/95 p-5 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <Logo />
                <button
                  aria-label="Close menu"
                  onClick={() => {
                    closeMenu();
                    setShowProfile(false);
                  }}
                  className="rounded-lg border border-slate-600/60 bg-slate-800/80 p-1.5"
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/rivoakkk.json"
                    trigger="click"
                    colors="primary:#e4e4e4"
                    style={{ width: 26, height: 26 }}
                  ></lord-icon>
                </button>
              </div>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`block rounded-xl px-4 py-3 font-medium ${isActive(item.path)}`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>

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


