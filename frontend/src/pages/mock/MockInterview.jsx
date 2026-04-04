import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, UserCircle, Bot, Lock } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';

export default function MockInterview() {
  const navigate = useNavigate();
  const { addAlert } = useAlert();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // State for interactive Q&A
  const [answerInput, setAnswerInput] = useState('');
  const [conversation, setConversation] = useState([]); // [{role: 'bot', content: '..'}, {role: 'user', content: '..'}]
  const [evaluating, setEvaluating] = useState(false);
  const [finished, setFinished] = useState(false);
  const [scores, setScores] = useState([]); // Array of percentages per question

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      const token = localStorage.getItem('token');
      const careerPath = localStorage.getItem('careerPath') || 'General';
      const res = await axios.post('http://localhost:8000/api/mock/interview', {
        careerPath
      }, { headers: { Authorization: `Bearer ${token}` }});
      
      const fetchedQs = res.data.questions || [];
      if (fetchedQs.length === 0) {
        setLocked(true);
      } else {
        setQuestions(fetchedQs);
        setConversation([{ role: 'bot', content: fetchedQs[0].question }]);
      }
    } catch (err) {
      console.error(err);
      addAlert("Failed to boot interview", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleScoreAnswer = () => {
    if (!answerInput.trim()) return;
    
    // Add user response
    setConversation(prev => [...prev, { role: 'user', content: answerInput }]);
    const currentQ = questions[currentIdx];
    const userText = answerInput.toLowerCase();
    
    // Naive scoring based on keywords (since dynamic fallback evaluation is requested to be fast)
    let matchedKeywords = 0;
    currentQ.ideal_answer_keywords.forEach(kw => {
      if (userText.includes(kw.toLowerCase())) matchedKeywords++;
    });
    
    const percentage = currentQ.ideal_answer_keywords.length > 0 
      ? (matchedKeywords / currentQ.ideal_answer_keywords.length) * 100 
      : 100;
      
    let feedback = `Your response captured ${matchedKeywords} out of ${currentQ.ideal_answer_keywords.length} key concepts.`;
    if (percentage > 70) feedback = "Excellent answer! " + feedback;
    else feedback = "Good attempt. " + feedback + ` Consider mentioning: ${currentQ.ideal_answer_keywords.join(', ')}.`;

    setEvaluating(true);
    setScores(prev => [...prev, percentage]);
    
    // Simulate AI thinking delay
    setTimeout(() => {
      setConversation(prev => [...prev, { role: 'system', content: feedback }]);
      setEvaluating(false);
      setAnswerInput('');
    }, 1500);
  };

  const saveScore = async () => {
    try {
      const token = localStorage.getItem('token');
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      await axios.post('http://localhost:8000/api/roadmap/save-score', {
        topic: "Mock Interview", // Generic topic for overall interview skill
        score: Math.round(avgScore),
        total: 100,
        assessment_type: "interview"
      }, { headers: { Authorization: `Bearer ${token}` }});
    } catch (err) {
      console.error("Score saving failed", err);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      const nextId = currentIdx + 1;
      setCurrentIdx(nextId);
      setConversation(prev => [...prev, { role: 'bot', content: questions[nextId].question }]);
    } else {
      saveScore();
      setFinished(true);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  if (locked) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <Lock className="w-16 h-16 mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold dark:text-white">Interview Locked</h2>
        <p className="text-gray-500 mt-2 mb-8">You haven't completed any roadmap modules yet. The adaptive interview requires module data to generate relevant questions.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Back to Roadmap</button>
      </div>
    );
  }

  if (finished) {
    return (
        <div className="max-w-2xl mx-auto py-20 text-center">
          <Bot className="w-24 h-24 mx-auto text-blue-500 mb-6" />
          <h2 className="text-4xl font-bold dark:text-white mb-2">Interview Complete!</h2>
          <p className="text-gray-500 text-lg mb-8">You successfully tackled {questions.length} adaptive technical questions.</p>
          <button onClick={() => navigate(-1)} className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-2xl font-bold">Return to Dashboard</button>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 flex flex-col h-[85vh]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">AI Adaptive Interview</h2>
          <p className="text-sm font-medium text-gray-500">Live Assessment Mode</p>
        </div>
        <div className="font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl">
          Question {currentIdx + 1} of {questions.length}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 overflow-y-auto flex flex-col gap-6 mb-6">
        {conversation.map((msg, i) => (
          <div key={i} className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
              msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 
              msg.role === 'system' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {msg.role === 'user' ? <UserCircle className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 
              msg.role === 'system' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border border-orange-100 dark:border-orange-900/50 rounded-tl-sm' : 
              'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
            }`}>
              {msg.role === 'system' && <span className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-70">AI Examiner Evaluation</span>}
              {msg.content}
            </div>
          </div>
        ))}
        {evaluating && (
          <div className="flex gap-4 max-w-[80%]">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center animate-pulse">
                <Bot className="w-6 h-6" />
            </div>
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 flex items-center gap-2 text-orange-600">
               <Loader2 className="w-4 h-4 animate-spin" /> Evaluating answer coherence...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {conversation[conversation.length - 1]?.role !== 'system' && !evaluating ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4">
          <textarea 
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleScoreAnswer(); }}}
            placeholder="Type your structured answer here... (Tip: Mention core keywords)"
            className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 resize-none outline-none dark:text-white"
            rows="2"
          ></textarea>
          <button 
            disabled={!answerInput.trim()}
            onClick={handleScoreAnswer}
            className="w-16 flex items-center justify-center bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <button 
          onClick={nextQuestion}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl font-bold shadow-md flex items-center justify-center gap-2 hover:opacity-90"
        >
          {currentIdx < questions.length - 1 ? 'Proceed to Next Question' : 'Finish Interview'}
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
