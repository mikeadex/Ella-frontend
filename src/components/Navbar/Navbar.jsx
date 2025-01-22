import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 h-11 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[rgba(251,251,253,0.8)]' 
          : 'bg-[rgba(251,251,253,0.8)]'
      } backdrop-blur-[50px]`}>
        <div className="max-w-[980px] mx-auto h-full flex items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-lg font-semibold text-[#1d1d1f] hover:opacity-80 transition-opacity"
          >
            Ella
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-9">
            <Link 
              to="/" 
              className="text-xs font-normal text-[#1d1d1f] hover:opacity-80 transition-opacity"
            >
              Home
            </Link>

            <Link 
              to="/write" 
              className="text-xs font-normal text-[#1d1d1f] hover:opacity-80 transition-opacity"
            >
              Write CV
            </Link>
            <Link 
              to="/templates" 
              className="text-xs font-normal text-[#1d1d1f] hover:opacity-80 transition-opacity"
            >
              Templates
            </Link>
            <Link 
              to="/features" 
              className="text-xs font-normal text-[#1d1d1f] hover:opacity-80 transition-opacity"
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-xs font-normal text-[#1d1d1f] hover:opacity-80 transition-opacity"
            >
              Pricing
            </Link>
            {/* Search Icon */}
            <button className="text-[#1d1d1f] hover:opacity-80 transition-opacity">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Bag Icon */}
            <button className="text-[#1d1d1f] hover:opacity-80 transition-opacity">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-xs text-[#1d1d1f] hover:opacity-80 transition-opacity"
                >
                  {/* Profile Icon */}
                  <div className="w-6 h-6 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white">
                    {user.email[0].toUpperCase()}
                  </div>
                  {/* <span className="hidden sm:block">{user.email}</span> */}
                  <svg
                    className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[rgba(251,251,253,0.98)] rounded-xl shadow-lg py-1 backdrop-blur-xl border border-gray-200">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-[#1d1d1f]">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Free Plan</p>
                    </div>

                    {/* Main Options */}
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2 text-xs text-[#1d1d1f] hover:bg-gray-50"
                      >
                        <svg
                          className="w-3.5 h-3.5 mr-2 opacity-60"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18" />
                        </svg>
                        My CVs
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-xs text-[#1d1d1f] hover:bg-gray-50"
                      >
                        <svg
                          className="w-3.5 h-3.5 mr-2 opacity-60"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Profile Settings
                      </Link>
                      <Link
                        to="/subscription"
                        className="flex items-center px-4 py-2 text-xs text-[#1d1d1f] hover:bg-gray-50"
                      >
                        <svg
                          className="w-3.5 h-3.5 mr-2 opacity-60"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 7h-9M20 11h-9M20 15h-9M3 7h2M3 11h2M3 15h2" />
                        </svg>
                        Subscription
                      </Link>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-gray-100"></div>

                    {/* Logout Option */}
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-xs text-[#1d1d1f] hover:bg-gray-50"
                      >
                        <svg
                          className="w-3.5 h-3.5 mr-2 opacity-60"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                          <path d="M16 17l5-5-5-5" />
                          <path d="M21 12H9" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-normal text-[#1d1d1f] hover:opacity-80 transition-opacity"
              >
                Log In
              </Link>
            )}

            
          </div>

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Search Icon */}
            <button className="p-2 -mr-2 text-[#1d1d1f] hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Bag Icon */}
            <button className="p-2 -mr-2 text-[#1d1d1f] hover:opacity-80 transition-opacity">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-[#1d1d1f] hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-0 top-11 bg-[rgba(251,251,253,0.98)] backdrop-blur-xl transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } md:hidden`}
      >
        <div className="px-8 py-4 space-y-1 border-t border-gray-200">
          <Link
            to="/"
            className="block py-3 text-sm text-[#1d1d1f] hover:opacity-80 transition-opacity"
          >
            Home
          </Link>
          <Link
            to="/templates"
            className="block py-3 text-sm text-[#1d1d1f] hover:opacity-80 transition-opacity"
          >
            Templates
          </Link>
          <Link
            to="/features"
            className="block py-3 text-sm text-[#1d1d1f] hover:opacity-80 transition-opacity"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="block py-3 text-sm text-[#1d1d1f] hover:opacity-80 transition-opacity"
          >
            Pricing
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block py-3 text-sm text-[#1d1d1f] hover:opacity-80 transition-opacity border-b border-gray-100"
              >
                <div className="flex items-center px-4">
                  <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white mr-3">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-gray-500">Free Plan</p>
                  </div>
                </div>
              </Link>
              <div className="px-4">
                <Link
                  to="/dashboard"
                  className="block py-3 text-sm text-[#1d1d1f] hover:opacity-80 transition-opacity"
                >
                  My CVs
                </Link>
                <Link
                  to="/profile"
                  className="block py-3 text-sm text-[#1d1d1f] hover:opacity-80 transition-opacity"
                >
                  Profile Settings
                </Link>
                <Link
                  to="/subscription"
                  className="block py-3 text-sm text-[#1d1d1f] hover:opacity-80 transition-opacity"
                >
                  Subscription
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-3 text-sm text-[#1d1d1f] hover:opacity-80 transition-opacity"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="w-full text-left py-3 text-sm text-[#1d1d1f] hover:opacity-80 transition-opacity"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
