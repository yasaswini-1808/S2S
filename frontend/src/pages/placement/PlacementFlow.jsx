import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from '../../context/AlertContext';
import { UploadCloud, FileText, CheckCircle2, Loader2, PlayCircle } from 'lucide-react';

export default function PlacementFlow() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const { addAlert } = useAlert();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data);
      addAlert('Resume analyzed successfully!', 'success');
      setStep(2);
      localStorage.setItem('resumeUploaded', 'true');
    } catch (err) {
      addAlert(err.response?.data?.detail || 'Failed to upload and analyze resume', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mt-6">
      <h3 className="text-xl font-bold dark:text-white mb-6">Placement Preparation Flow</h3>
      
      {/* Stepper */}
      <div className="flex items-center gap-4 mb-8 text-sm font-medium">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>1</div>
          Resume
        </div>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>2</div>
          Analysis
        </div>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>3</div>
          AI Interview
        </div>
      </div>

      {step === 1 && (
        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <UploadCloud className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold dark:text-white">Upload your Resume (PDF)</h4>
          <p className="text-gray-500 mt-2 mb-6">Our AI will extract your skills and find the gaps.</p>
          
          <input
            type="file"
            id="resume"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="resume"
            className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <FileText className="w-5 h-5" />
            {file ? file.name : 'Choose PDF File'}
          </label>
          
          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="ml-4 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-70"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
              {uploading ? 'Analyzing...' : 'Upload & Analyze'}
            </button>
          )}
        </div>
      )}

      {step === 2 && analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800/30">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Skills Found
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.skills?.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 rounded-md text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-800/30">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-4 flex items-center gap-2">
                Missing/Recommended Skills
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
                {analysis.missing_skills?.map(skill => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-4">Target Roles for You</h4>
            <div className="flex flex-wrap gap-3">
              {analysis.suggested_roles?.map(role => (
                <div key={role} className="flex-1 min-w-[200px] bg-white dark:bg-gray-800 p-4 rounded-xl text-center shadow-sm font-medium dark:text-gray-200">
                  {role}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
            >
              Start Mini AI Interview <PlayCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <PlayCircle className="w-10 h-10" />
          </div>
          <h4 className="text-2xl font-bold dark:text-white mb-2">Mini AI Interview</h4>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Our AI will ask you 5 questions based on your resume to evaluate your readiness.
          </p>
          <button
            onClick={() => addAlert('Interview module coming soon!', 'info')}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Start Interview
          </button>
        </div>
      )}
    </div>
  );
}
