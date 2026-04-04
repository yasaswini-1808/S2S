import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, Award, BookOpen, CheckCircle, Clock, BarChart3, ChevronRight } from 'lucide-react';

export default function GradesPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/roadmap/grades', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch grades', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  const careerPath = localStorage.getItem('careerPath') || 'Placement Preparation';
  
  const mockDataByPath = {
    'Higher Education': [
      { name: "Quant & Logical Reasoning", week: 1, submitted: 3, total_tasks: 3, status: "Completed", learning_score: 30, learning_total: 30, mock_test_score: 9, mock_test_total: 10, interview_score: 0, interview_total: 0, final_score: 39, final_total: 40 },
      { name: "Verbal & Reading Comprehension", week: 2, submitted: 2, total_tasks: 4, status: "In Progress", learning_score: 20, learning_total: 40, mock_test_score: 7, mock_test_total: 10, interview_score: 0, interview_total: 0, final_score: 27, final_total: 50 },
      { name: "GRE/TOEFL Strategy", week: 3, submitted: 0, total_tasks: 3, status: "Not Started", learning_score: 0, learning_total: 30, mock_test_score: 0, mock_test_total: 10, interview_score: 0, interview_total: 0, final_score: 0, final_total: 40 },
      { name: "Research & SOP Drafting", week: "Final", submitted: 0, total_tasks: 2, status: "Not Started", learning_score: 0, learning_total: 20, mock_test_score: 0, mock_test_total: 0, interview_score: 88, interview_total: 100, final_score: 88, final_total: 120 }
    ],
    'Government Exams': [
      { name: "Quantitative Aptitude", week: 1, submitted: 3, total_tasks: 3, status: "Completed", learning_score: 30, learning_total: 30, mock_test_score: 8, mock_test_total: 10, interview_score: 0, interview_total: 0, final_score: 38, final_total: 40 },
      { name: "General Reasoning", week: 2, submitted: 2, total_tasks: 4, status: "In Progress", learning_score: 20, learning_total: 40, mock_test_score: 6, mock_test_total: 10, interview_score: 0, interview_total: 0, final_score: 26, final_total: 50 },
      { name: "Current Affairs & GK", week: 3, submitted: 0, total_tasks: 3, status: "Not Started", learning_score: 0, learning_total: 30, mock_test_score: 0, mock_test_total: 10, interview_score: 0, interview_total: 0, final_score: 0, final_total: 40 },
      { name: "Mock Interview & Ethics", week: "Final", submitted: 0, total_tasks: 2, status: "Not Started", learning_score: 0, learning_total: 20, mock_test_score: 0, mock_test_total: 0, interview_score: 92, interview_total: 100, final_score: 92, final_total: 120 }
    ],
    'Placement Preparation': [
      { name: "Quantitative Aptitude", week: 1, submitted: 3, total_tasks: 3, status: "Completed", learning_score: 30, learning_total: 30, mock_test_score: 8, mock_test_total: 10, interview_score: 0, interview_total: 0, final_score: 38, final_total: 40 },
      { name: "Data Structures & Algorithms", week: 2, submitted: 2, total_tasks: 4, status: "In Progress", learning_score: 20, learning_total: 40, mock_test_score: 7, mock_test_total: 10, interview_score: 0, interview_total: 0, final_score: 27, final_total: 50 },
      { name: "DBMS & SQL Essentials", week: 3, submitted: 0, total_tasks: 3, status: "Not Started", learning_score: 0, learning_total: 30, mock_test_score: 0, mock_test_total: 10, interview_score: 0, interview_total: 0, final_score: 0, final_total: 40 },
      { name: "System Design & HR Mock", week: "Final", submitted: 0, total_tasks: 2, status: "Not Started", learning_score: 0, learning_total: 20, mock_test_score: 0, mock_test_total: 0, interview_score: 85, interview_total: 100, final_score: 85, final_total: 120 }
    ]
  };

  const mockModules = mockDataByPath[careerPath] || mockDataByPath['Placement Preparation'];

  const hasData = data && data.modules && data.modules.length > 0;
  const displayModules = hasData ? data.modules : mockModules;
  const displayOverall = hasData ? data.overall : { completed: 1, total: 4, average: 65.5 };

  const filteredModules = displayModules.filter(m => filter === 'All' || m.status === filter);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {!hasData && (
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3 text-amber-800 dark:text-amber-400">
            <Award className="w-5 h-5" />
            <p className="text-sm font-bold">Viewing <span className="underline decoration-amber-400">Demo Data</span>. Generate your own roadmap to see real progress!</p>
          </div>
          <button 
            onClick={() => navigate(`/${window.location.pathname.split('/')[1]}/roadmap`)}
            className="text-sm font-black text-amber-900 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-100 transition-colors"
          >
            Go to Roadmap →
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Performance Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your roadmap progress and assessment scores</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white dark:bg-gray-900 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</p>
              <p className="text-xl font-bold dark:text-white">{displayOverall.completed} / {displayOverall.total}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg. Score</p>
              <p className="text-xl font-bold dark:text-white">{displayOverall.average}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Completed', 'In Progress', 'Not Started'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              filter === f 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Module / Week</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Learning Score</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mock Score</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Final Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredModules.map((module, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-black text-gray-900 dark:text-gray-100">{module.name}</p>
                    <p className="text-[10px] font-black uppercase text-gray-400 mt-1 flex items-center gap-1 tracking-widest"><Clock className="w-3 h-3" /> Week {module.week}</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-[60px] h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500" 
                          style={{ width: `${(module.submitted / module.total_tasks) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{module.submitted}/{module.total_tasks}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      module.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      module.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500'
                    }`}>
                      {module.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold dark:text-white">{module.learning_score}</span>
                    <span className="text-xs text-gray-400"> / {module.learning_total}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-semibold dark:text-white">{module.mock_test_score + module.interview_score}</span>
                    <span className="text-xs text-gray-400"> / {module.mock_test_total + module.interview_total}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <span className="text-lg font-black text-blue-600 dark:text-blue-400">{module.final_score}</span>
                       <span className="text-xs text-gray-400">/ {module.final_total}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
