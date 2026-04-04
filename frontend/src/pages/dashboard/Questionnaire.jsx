import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { Loader2, ArrowRight, BrainCircuit } from 'lucide-react';

export default function Questionnaire() {
  const { updateUser } = useAuth();
  const { addAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    interests: '',
    cgpa: '',
    skills: '',
    financial_condition: 'stable',
    time_availability: '4',
    career_preference: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Split comma separated lists
      const payload = {
        ...formData,
        interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        cgpa: parseFloat(formData.cgpa) || 0,
        time_availability: parseInt(formData.time_availability) || 0,
      };

      const res = await axios.post('http://localhost:8000/api/career/analyze', payload);
      const suggestedPath = res.data.suggested_path;
      
      addAlert(`AI Analyzed: ${res.data.reasoning}`, 'info');
      addAlert(`Path selected: ${suggestedPath}`, 'success');
      
      // Update global context which will redirect to dashboard
      updateUser({ selected_path: suggestedPath });
      
    } catch (err) {
      addAlert('Failed to analyze career path. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 dark:bg-blue-900/40 dark:text-blue-400">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold dark:text-white">Let's find your path</h2>
        <p className="text-gray-500 mt-2">Our AI will analyze your profile and suggest the best possible path forward.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Interests</label>
              <input
                type="text"
                name="interests"
                required
                placeholder="e.g. AI, Web Dev, Management"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                value={formData.interests}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Technical Skills</label>
              <input
                type="text"
                name="skills"
                required
                placeholder="e.g. Python, React, Java"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current CGPA</label>
              <input
                type="number"
                name="cgpa"
                step="0.1"
                required
                placeholder="e.g. 8.5"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                value={formData.cgpa}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Availability (hrs/day)</label>
              <input
                type="number"
                name="time_availability"
                required
                placeholder="e.g. 4"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                value={formData.time_availability}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Financial Condition</label>
            <select
              name="financial_condition"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              value={formData.financial_condition}
              onChange={handleChange}
            >
              <option value="needs_immediate_job">Need immediate job / financial support</option>
              <option value="stable">Stable / can afford masters/prep</option>
              <option value="good">Good / can afford international studies</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Any specific career preference?</label>
            <input
              type="text"
              name="career_preference"
              placeholder="e.g. Software Engineer, UPSC, MS in US"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              value={formData.career_preference}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate AI Path'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
