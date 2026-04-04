import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Map, ArrowRightLeft, LogOut, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const careerPath = localStorage.getItem('careerPath') || 'Not Selected';

  const handleChangeStream = () => {
    localStorage.removeItem('careerPath');
    navigate('/select-path');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold dark:text-white">Your Profile</h2>
        <p className="text-gray-500 mt-2">Manage your account settings and career track.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10 relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex flex-shrink-0 items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {user?.name || 'Loading...'}
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </h3>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium">
              <Mail className="w-5 h-5 opacity-70" />
              <span>{user?.email || 'Loading...'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium pb-2">
              <Map className="w-5 h-5 opacity-70" />
              <span>Track: <span className="text-blue-600 dark:text-blue-400 font-bold">{careerPath}</span></span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex border-b pb-8 mb-8 gap-12 relative z-10">
           <div className="flex-1">
             <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Change your Stream</h4>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Explore a different career path. Your progress in the current track will be saved.</p>
             <button 
                onClick={handleChangeStream}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors w-full sm:w-auto"
             >
               <ArrowRightLeft className="w-5 h-5" /> Switch Career Track
             </button>
           </div>
        </div>

        <div className="relative z-10">
          <button 
             onClick={handleLogout}
             className="flex items-center justify-center gap-2 px-6 py-3 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-500 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full sm:w-auto"
          >
            <LogOut className="w-5 h-5" /> Logout from Account
          </button>
        </div>

      </div>
    </div>
  );
}
