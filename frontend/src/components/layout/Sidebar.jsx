import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Home, Map, BookOpen, GraduationCap, Users, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { logout } = useAuth();
  
  const careerPath = localStorage.getItem('careerPath');
  let prefix = '';
  if (careerPath === 'Higher Education') prefix = '/higher';
  else if (careerPath === 'Placement Preparation') prefix = '/placement';
  else if (careerPath === 'Government Exams') prefix = '/government';

  const navItems = [
    { name: 'Dashboard', path: `${prefix}/dashboard`, icon: LayoutDashboard },
    { name: 'Roadmap', path: `${prefix}/roadmap`, icon: Map },
    { name: 'Courses', path: `${prefix}/courses`, icon: BookOpen },
    { name: 'Grades', path: `${prefix}/grades`, icon: GraduationCap },
    { name: 'Community', path: `${prefix}/community`, icon: Users },
    { name: 'Profile', path: `${prefix}/profile`, icon: User },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col h-full shrink-0 transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Study2Success
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}
