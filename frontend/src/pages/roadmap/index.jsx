import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import { Loader2, ArrowRight, Map, CheckCircle, Target, Award, PlayCircle } from 'lucide-react';

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { addAlert } = useAlert();
  
  const [formData, setFormData] = useState({
    role: '',
    time_weeks: '12',
    hours_per_day: '4'
  });
  
  const [completedModules, setCompletedModules] = useState([]);
  const navigate = useNavigate();
  const careerPath = localStorage.getItem('careerPath');

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/roadmap/me', { headers: { Authorization: `Bearer ${token}` }});
      setRoadmap(res.data);
      
      const compRes = await axios.get('http://localhost:8000/api/roadmap/completed-modules', { headers: { Authorization: `Bearer ${token}` }});
      setCompletedModules(compRes.data.completed || []);
    } catch (err) {
      if (err.response?.status !== 404) {
        addAlert('Failed to fetch roadmap', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        role: formData.role,
        time_weeks: parseInt(formData.time_weeks),
        hours_per_day: parseInt(formData.hours_per_day)
      };
      const res = await axios.post('http://localhost:8000/api/roadmap/generate', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoadmap(res.data);
      addAlert('Roadmap generated successfully!', 'success');
    } catch (err) {
      addAlert('Failed to generate roadmap', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const markModuleComplete = async (moduleTopic) => {
    if (completedModules.includes(moduleTopic)) return;
    try {
      setCompletedModules(prev => [...prev, moduleTopic]);
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/roadmap/complete-module', { module_id: moduleTopic }, { headers: { Authorization: `Bearer ${token}` }});
      addAlert('Module marked as completed!', 'success');
    } catch(err) {
      console.error(err);
    }
  };

  const handleNavigateToCourses = async (taskText, moduleTopic) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/roadmap/complete-task', {
        module_topic: moduleTopic,
        task_text: taskText
      }, { headers: { Authorization: `Bearer ${token}` }});
    } catch (err) {
      console.error("Task sync failed", err);
    }

    const cleanTopic = taskText.replace(/User /ig, "").split(" for ")[0];
    const prefix = window.location.pathname.split('/')[1];
    navigate(`/${prefix}/courses?topic=${encodeURIComponent(cleanTopic)}`);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  if (!roadmap) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Map className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold dark:text-white">Generate Your Roadmap</h2>
          </div>
          
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Role / Goal</label>
              <input type="text" name="role" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" placeholder="e.g. Frontend Developer" value={formData.role} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeframe (Weeks)</label>
                <input type="number" name="time_weeks" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.time_weeks} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hours per Day</label>
                <input type="number" name="hours_per_day" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" value={formData.hours_per_day} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" disabled={generating} className="w-full flex justify-center items-center gap-2 py-4 shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 transition disabled:opacity-70">
              {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate with AI'}
              {!generating && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold dark:text-white">Your Action Plan</h2>
          <p className="text-gray-500 mt-2">Target: {roadmap.goal} ({roadmap.time_weeks} weeks, {roadmap.daily_hours}h/day)</p>
        </div>
        <button onClick={() => setRoadmap(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition">Regenerate</button>
      </div>

      <div className="space-y-6">
        {roadmap.plan?.map((weekData, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-6 items-start">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/50">
              <span className="text-[10px] font-black uppercase tracking-wider">Week</span>
              <span className="text-2xl font-black">{weekData.week}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold dark:text-white mb-4 flex items-center justify-between">
                {weekData.topic}
                {completedModules.includes(weekData.topic) && <span className="text-sm font-bold text-green-500 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Verified</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {weekData.tasks.map((task, tidx) => (
                  <button 
                    key={tidx}
                    onClick={() => handleNavigateToCourses(task, weekData.topic)}
                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all flex items-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    {task}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-3">
                {!completedModules.includes(weekData.topic) && (
                  <button onClick={() => markModuleComplete(weekData.topic)} className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 font-bold rounded-xl text-sm transition-all border border-green-100 dark:border-green-800/50">
                    Mark as Completed
                  </button>
                )}
                <button 
                  onClick={() => {
                    const topicsParam = encodeURIComponent(JSON.stringify(weekData.tasks));
                    navigate(`/${window.location.pathname.split('/')[1]}/mock-test?topic=${encodeURIComponent(weekData.topic)}&topics=${topicsParam}`);
                  }} 
                  className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 font-bold rounded-xl text-sm flex items-center gap-1 transition-all border border-purple-100 dark:border-purple-800/50"
                >
                  <Target className="w-4 h-4" /> Take Mock Test
                </button>
                {careerPath !== 'Higher Education' && (
                  <button onClick={() => navigate(`/${window.location.pathname.split('/')[1]}/mock-interview`)} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 font-bold rounded-xl text-sm flex items-center gap-1 transition-all border border-indigo-100 dark:border-indigo-800/50">
                    <Award className="w-4 h-4" /> Take Mock Interview
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
