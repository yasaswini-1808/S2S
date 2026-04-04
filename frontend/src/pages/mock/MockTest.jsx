import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

export default function MockTest() {
  const [searchParams] = useSearchParams();
  const topic = searchParams.get('topic') || 'General aptitude';
  const topicsJson = searchParams.get('topics');
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [topic, topicsJson]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      
      // Step 6: Performance - Check localStorage cache first
      const cacheKey = `mock_test_${topic}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        console.log("Loading questions from cache...");
        setQuestions(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const careerPath = localStorage.getItem('careerPath') || 'General';
      
      // Parse topics from JSON string or use the title as fallback
      let topicsList = [topic];
      if (topicsJson) {
        try {
          topicsList = JSON.parse(decodeURIComponent(topicsJson));
        } catch (e) {
          console.error("Failed to parse topics JSON", e);
        }
      }

      const res = await axios.post('http://localhost:8000/api/mock/test', {
        topics: topicsList, 
        careerPath
      }, { headers: { Authorization: `Bearer ${token}` }});
      
      const newQuestions = res.data.questions || [];
      if (newQuestions.length > 0) {
        setQuestions(newQuestions);
        // Step 6: Performance - Cache the result
        localStorage.setItem(cacheKey, JSON.stringify(newQuestions));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (opt) => {
    if (showExplanation) return;
    setSelectedOpt(opt);
    setShowExplanation(true);
    if (opt === questions[currentIdx].correct_answer) {
      setScore(s => s + 1);
    }
  };

  const saveScore = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/roadmap/save-score', {
        topic,
        score: score,
        total: questions.length,
        assessment_type: "test"
      }, { headers: { Authorization: `Bearer ${token}` }});
    } catch (err) {
      console.error("Score saving failed", err);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelectedOpt(null);
      setShowExplanation(false);
    } else {
      saveScore();
      setFinished(true);
    }
  };

  const handleRegenerate = async () => {
    const cacheKey = `mock_test_${topic}`;
    localStorage.removeItem(cacheKey);
    setCurrentIdx(0);
    setScore(0);
    setSelectedOpt(null);
    setShowExplanation(false);
    setFinished(false);
    fetchTest();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  if (questions.length === 0) return <div className="text-center py-20">Failed to load test. Please try again.</div>;

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-lg text-center border border-gray-100 dark:border-gray-800">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold dark:text-white mb-2">Test Complete!</h2>
          <p className="text-gray-500 text-lg mb-8">You scored {score} out of {questions.length} on {topic} module.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all hover:bg-gray-200">Go Back to Roadmap</button>
            <button onClick={handleRegenerate} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
              <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}/> Retake Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">AI Adaptive Mock Test</h2>
          <p className="text-sm font-medium text-gray-500">Topic: {topic}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRegenerate} 
            className="p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-400 hover:text-blue-500 transition-colors shadow-sm"
            title="Regenerate Questions"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl">
            Question {currentIdx + 1} of {questions.length}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-xl font-semibold dark:text-gray-100 mb-8">{q.question}</h3>
        
        <div className="space-y-4">
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === opt;
            const isCorrect = opt === q.correct_answer;
            
            let btnClass = "border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20";
            if (showExplanation) {
              if (isCorrect) btnClass = "bg-green-100 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-400";
              else if (isSelected) btnClass = "bg-red-100 dark:bg-red-900/40 border-red-500 text-red-700 dark:text-red-400";
              else btnClass = "opacity-50 border border-gray-200 dark:border-gray-800";
            }
            
            return (
              <button 
                key={i} 
                onClick={() => handleSelect(opt)}
                className={`w-full text-left px-5 py-4 rounded-2xl transition-all font-medium text-gray-700 dark:text-gray-300 flex justify-between items-center ${btnClass}`}
              >
                <span>{opt}</span>
                {showExplanation && isCorrect && <CheckCircle className="w-5 h-5 text-green-500"/>}
                {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500"/>}
              </button>
            )
          })}
        </div>

        {showExplanation && (
          <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-2xl border border-blue-100 dark:border-blue-800/40">
            <h4 className="font-bold flex items-center gap-2 mb-2">Explanation</h4>
            <p className="text-sm">{q.explanation}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button 
            disabled={!showExplanation}
            onClick={handleNext} 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 hover:bg-blue-700 transition"
          >
            {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Test'} 
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
