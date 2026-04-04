import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, LogOut, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Topbar() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangeStream = () => {
    localStorage.removeItem('careerPath');
    navigate('/select-path');
  };

  const careerPath = localStorage.getItem('careerPath');
  let prefix = '';
  if (careerPath === 'Higher Education') prefix = '/higher';
  else if (careerPath === 'Placement Preparation') prefix = '/placement';
  else if (careerPath === 'Government Exams') prefix = '/government';

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 transition-colors duration-200 z-10 relative">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white md:hidden">Study2Success</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button 
          onClick={() => navigate(`${prefix}/notifications`)}
          className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <Bell className="w-5 h-5 shrink-0" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative pl-4 border-l border-gray-200 dark:border-gray-700" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 focus:outline-none hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-sm text-left">
              <p className="font-semibold text-gray-800 dark:text-white leading-tight">{user?.name || 'User'}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Student</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
              </div>
              
              <Link 
                to={`${prefix}/profile`}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="w-4 h-4" /> View Profile
              </Link>
              
              <button 
                onClick={() => { setDropdownOpen(false); handleChangeStream(); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <ArrowRightLeft className="w-4 h-4" /> Change Stream
              </button>
              
              <div className="border-t border-gray-100 dark:border-gray-800 my-1 mt-1"></div>
              
              <button 
                onClick={() => { setDropdownOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left font-medium"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
