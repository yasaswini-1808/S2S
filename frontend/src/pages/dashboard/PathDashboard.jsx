import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, Award, Activity, Star, Calendar, ArrowRight } from 'lucide-react';
import PlacementFlow from '../placement/PlacementFlow';

const RECENT_ACTIVITY = [
  { id: 1, type: 'Module', title: 'Quantitative Aptitude - Week 1', status: 'Completed', time: '2 hours ago', score: '30/30' },
  { id: 2, type: 'Mock Test', title: 'Calculus & Algebra', status: 'Passed', time: '5 hours ago', score: '8/10' },
  { id: 3, type: 'Course', title: 'React Performance optimization', status: 'In Progress', time: '1 day ago', progress: '65%' },
];

export default function PathDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <Award size={200} />
        </div>
        <div className="relative z-10">
          <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">Study2Success AI</span>
          <h1 className="text-4xl font-black mb-2 leading-tight">Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p className="text-blue-100 text-lg">Your AI-suggested path: <span className="font-black text-white">{user?.selected_path}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Card 1 */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/40 text-green-600 rounded-2xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-green-500 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Progress Overview</p>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">25%</h3>
          <p className="text-gray-500 text-sm mt-1 font-medium">Overall completion</p>
        </div>

        {/* Stats Card 2 */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-blue-500 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded-lg">High</span>
          </div>
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Learning Time</p>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">8.5h</h3>
          <p className="text-gray-500 text-sm mt-1 font-medium">This active week</p>
        </div>

        {/* Stats Card 3 */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 rounded-2xl">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Current Streak</p>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">5 Days</h3>
          <p className="text-gray-500 text-sm mt-1 font-medium">Keep it going!</p>
        </div>

        {/* Stats Card 4 */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Next Milestone</p>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1 truncate">Week 2 Quiz</h3>
          <p className="text-gray-500 text-sm mt-1 font-medium">In 2 days</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black dark:text-white">Recent Activity</h3>
              </div>
              <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">View all history</button>
            </div>
            
            <div className="space-y-4">
              {RECENT_ACTIVITY.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 group hover:scale-[1.01] transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-2 h-10 rounded-full ${item.status === 'Completed' ? 'bg-green-500' : item.status === 'Passed' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{item.title}</h4>
                      <p className="text-xs text-gray-400 font-medium">{item.type} • {item.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block font-black text-gray-700 dark:text-gray-200">{item.score || item.progress}</span>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights / Quick Controls Side */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 h-full">
            <h3 className="text-xl font-black dark:text-white mb-6">Performance Insight</h3>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-2xl mb-6">
              <Award className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 leading-relaxed">
                "You’re doing great! Your aptitude scores in the recent mock test are in the <span className="font-black underline">Top 10%</span> of all users in your track."
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs font-black uppercase text-gray-400 tracking-widest px-1">Quick Discovery</p>
              <button className="w-full p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                <span className="font-bold dark:text-white group-hover:text-blue-600 transition-colors">Resume AI Review</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="w-full p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                <span className="font-bold dark:text-white group-hover:text-purple-600 transition-colors">Popular Courses</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Original Dynamic Content */}
      {user?.selected_path === 'Placement Preparation' && (
        <div className="mt-8">
           <PlacementFlow />
        </div>
      )}

      {user?.selected_path !== 'Placement Preparation' && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-black dark:text-white mb-4">Upcoming Tasks</h3>
          <p className="text-gray-500 text-sm font-medium">You haven't generated your roadmap yet. Go to the <a href="/roadmap" className="text-blue-600 font-bold dark:text-blue-400 hover:underline">Roadmap</a> section to start.</p>
        </div>
      )}
    </div>
  );
}
