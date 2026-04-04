import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { GraduationCap, Briefcase, Landmark, Loader2 } from 'lucide-react';

export default function SelectPath() {
  const { updateUser } = useAuth();
  const { addAlert } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSelection = async (pathName, prefix) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/career/select-path', { path: pathName });
      
      // Store locally
      localStorage.setItem('careerPath', pathName);
      updateUser({ selected_path: pathName });
      
      addAlert(`Career path saved: ${pathName}`, 'success');
      
      // Safe redirection to correct module
      if (pathName === 'Placement Preparation') {
         navigate('/placement/upload', { replace: true });
      } else {
         navigate(`${prefix}/dashboard`, { replace: true });
      }
    } catch (err) {
      addAlert('Failed to select career path', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Select the focus area for your personalized study journey. You will automatically receive insights and roadmaps tailored specifically for this track.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center my-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div 
              className="group bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all cursor-pointer hover:-translate-y-2 flex flex-col items-center text-center"
              onClick={() => handleSelection('Higher Education', '/higher')}
            >
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white mb-3">Higher Education</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 flex-1">
                Prepare for exams like GATE, GRE, CAT. Get study modules structured around your post-graduate aspirations.
              </p>
              <button className="w-full py-3 bg-blue-50 text-blue-600 font-semibold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Select Track
              </button>
            </div>

            <div 
              className="group bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-md hover:shadow-2xl border-2 border-indigo-100 hover:border-indigo-500 dark:border-gray-800 dark:hover:border-indigo-500 transition-all cursor-pointer hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
              onClick={() => handleSelection('Placement Preparation', '/placement')}
            >
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white mb-3">Placement Prep</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 flex-1">
                Land your dream job. Requires mandatory resume upload to extract insights and conduct mini AI interviews.
              </p>
              <button className="w-full py-3 bg-indigo-50 text-indigo-600 font-semibold rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                Select Track
              </button>
            </div>

            <div 
              className="group bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all cursor-pointer hover:-translate-y-2 flex flex-col items-center text-center"
              onClick={() => handleSelection('Government Exams', '/government')}
            >
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Landmark className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold dark:text-white mb-3">Government Exams</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 flex-1">
                Structured guidance and roadmap creation for UPSC, SSC, state jobs, and banking exams.
              </p>
              <button className="w-full py-3 bg-emerald-50 text-emerald-600 font-semibold rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                Select Track
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
