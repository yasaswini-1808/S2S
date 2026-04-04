import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, PlayCircle, BookOpen, Loader2, ExternalLink } from 'lucide-react';

const placementData = {
  categories: [
    {
      name: "Core Programming",
      description: "Fundamentals of programming and databases",
      subtopics: [
        {
          name: "DBMS",
          videos: [
            { id: "1", title: "Introduction to DBMS", url: "https://www.youtube.com/embed/kBdlM6hNDAE" },
            { id: "2", title: "Normalization & ER Models", url: "https://www.youtube.com/embed/vDqXk4R-vT0" }
          ]
        },
        {
          name: "SQL",
          videos: [
            { id: "3", title: "SQL Basics & Queries", url: "https://www.youtube.com/embed/HXV3ze8EGqY" },
            { id: "4", title: "Advanced Joins", url: "https://www.youtube.com/embed/0OQJTbp2k_k" }
          ]
        },
        {
          name: "HTML",
          videos: [{ id: "html1", title: "HTML Crash Course", url: "https://www.youtube.com/embed/pQN-pnXPaVg" }]
        },
        {
          name: "Git",
          videos: [{ id: "git1", title: "Git Fundamentals", url: "https://www.youtube.com/embed/USjZcfj8PjA" }]
        },
        {
          name: "GitHub",
          videos: [{ id: "github1", title: "GitHub Workflows", url: "https://www.youtube.com/embed/RGOj5yH7evk" }]
        },
        {
          name: "Data Structures",
          videos: [{ id: "ds1", title: "Introduction to DS", url: "https://www.youtube.com/embed/B31LgI4Y2Co" }]
        }
      ]
    },
    {
      name: "Core Subjects",
      description: "Computer Science theoretical foundations",
      subtopics: [
        {
          name: "Operating Systems",
          videos: [{ id: "os1", title: "OS Fundamentals", url: "https://www.youtube.com/embed/vBURTt97TKM" }]
        },
        {
          name: "Software Engineering",
          videos: [{ id: "se1", title: "SDLC & Models", url: "https://www.youtube.com/embed/OqjJ7JOBcg" }]
        },
        {
          name: "Computer Networks",
          videos: [{ id: "cn1", title: "OSI Model & TCP/IP", url: "https://www.youtube.com/embed/3QhU9oYn1fE" }]
        }
      ]
    },
    {
      name: "Development",
      description: "Software engineering and development frameworks",
      subtopics: [
        {
          name: "Full Stack",
          videos: [{ id: "dev1", title: "Full Stack Architecture", url: "https://www.youtube.com/embed/nu_pCVPKzTk" }]
        },
        {
          name: "Frontend",
          videos: [{ id: "dev2", title: "React Fundamentals", url: "https://www.youtube.com/embed/bMknfKXIFA8" }]
        },
        {
          name: "Backend",
          videos: [{ id: "dev3", title: "Node & Express", url: "https://www.youtube.com/embed/Oe421EPjeBE" }]
        },
        {
          name: "Cloud",
          videos: [{ id: "dev4", title: "Docker & AWS", url: "https://www.youtube.com/embed/3c-iZaI0Uo" }]
        }
      ]
    },
    {
      name: "Problem Solving",
      description: "Algorithms and quantitative reasoning",
      subtopics: [
        {
          name: "DSA",
          videos: [{ id: "ps1", title: "Advanced Trees & Graphs", url: "https://www.youtube.com/embed/t0Cq6tVNRBA" }]
        },
        {
          name: "Aptitude",
          videos: [{ id: "ps2", title: "Quantitative Aptitude Tricks", url: "https://www.youtube.com/embed/vDqXk4R-vT0" }]
        }
      ]
    },
    {
      name: "Projects",
      description: "Hands-on implementation experience",
      subtopics: [
        {
          name: "Mini Projects",
          videos: [{ id: "proj1", title: "Build a Weather App", url: "https://www.youtube.com/embed/MIYQR-Ybrn4" }]
        },
        {
          name: "Main Projects",
          videos: [{ id: "proj2", title: "Full Stack E-Commerce", url: "https://www.youtube.com/embed/CDtPMR5zxcA" }]
        }
      ]
    },
    {
      name: "Resume & Career",
      description: "Professional profile optimization",
      subtopics: [
        {
          name: "LinkedIn",
          videos: [{ id: "cr1", title: "LinkedIn Profile Masterclass", url: "https://www.youtube.com/embed/pQN-pnXPaVg" }]
        },
        {
          name: "Resume Building",
          videos: [{ id: "cr2", title: "ATS Friendly Resumes", url: "https://www.youtube.com/embed/USjZcfj8PjA" }]
        },
        {
          name: "Internships",
          videos: [{ id: "cr3", title: "How to land your first internship", url: "https://www.youtube.com/embed/Oe421EPjeBE" }]
        }
      ]
    },
    {
      name: "Domain Specialization",
      description: "Niche high-demand technical topics",
      subtopics: [
        {
          name: "Machine Learning",
          videos: [{ id: "dspec1", title: "ML Basics & Scikit-learn", url: "https://www.youtube.com/embed/7eh4O612EO" }]
        },
        {
          name: "Cloud",
          videos: [{ id: "dspec2", title: "AWS Solutions Architect", url: "https://www.youtube.com/embed/3c-iZaI0Uo" }]
        },
        {
          name: "MERN Stack",
          videos: [{ id: "dspec3", title: "MongoDB React Node Masterclass", url: "https://www.youtube.com/embed/CDtPMR5zxcA" }]
        }
      ]
    }
  ]
};

const higherData = {
  categories: [
    {
      name: "INDIAN EXAMS",
      description: "Masters programs inside India.",
      subtopics: [
        {
          name: "M.Tech / GATE",
          videos: [
            { id: "h1", title: "GATE Preparation Strategy", url: "https://www.youtube.com/results?search_query=GATE+Preparation+Strategy" },
            { id: "h2", title: "GATE Syllabus Overview", url: "https://www.youtube.com/results?search_query=GATE+Syllabus+Overview" }
          ]
        },
        {
          name: "MBA / CAT",
          videos: [
            { id: "h3", title: "How to crack CAT", url: "https://www.youtube.com/results?search_query=How+to+crack+CAT" }
          ]
        },
        {
          name: "MCA / JAM",
          videos: [
            { id: "h4", title: "IIT JAM Preparation Strategy", url: "https://www.youtube.com/results?search_query=IIT+JAM+Preparation" }
          ]
        }
      ]
    },
    {
      name: "ABROAD STUDIES",
      description: "International admissions tests & methodologies.",
      subtopics: [
        {
          name: "GRE / TOEFL",
          videos: [
            { id: "h5", title: "GRE Preparation Basics", url: "https://www.youtube.com/results?search_query=GRE+Preparation+Basics" }
          ]
        },
        {
          name: "Study Abroad Readiness",
          videos: [
            { id: "h6", title: "SOP Writing Masterclass", url: "https://www.youtube.com/results?search_query=SOP+Writing+Masterclass" },
            { id: "h7", title: "University applications guide", url: "https://www.youtube.com/results?search_query=University+applications+abroad" }
          ]
        },
        {
          name: "Research & Thesis",
          videos: [
            { id: "h8", title: "Research methodology", url: "https://www.youtube.com/results?search_query=Research+methodology" }
          ]
        }
      ]
    }
  ]
};

const governmentData = {
  categories: [
    {
      name: "Banking Courses",
      description: "Preparation for IBPS, SBI & RBI.",
      subtopics: [
        {
          name: "Quantitative Aptitude",
          videos: [{ id: "g1", title: "Banking Quant Shortcuts", url: "https://www.youtube.com/results?search_query=Banking+Quant+Shortcuts" }]
        },
        {
          name: "Reasoning",
          videos: [{ id: "g2", title: "Logical Reasoning for Bank PO", url: "https://www.youtube.com/results?search_query=Logical+Reasoning+for+Bank+PO" }]
        },
        {
          name: "English",
          videos: [{ id: "g3", title: "Banking English Grammar", url: "https://www.youtube.com/results?search_query=Banking+English+Grammar" }]
        }
      ]
    },
    {
      name: "SSC Courses",
      description: "Preparation for CGL, CHSL, etc.",
      subtopics: [
        {
          name: "Math",
          videos: [{ id: "g4", title: "Advanced Math SSC CGL", url: "https://www.youtube.com/results?search_query=Advanced+Math+SSC+CGL" }]
        },
        {
          name: "Reasoning",
          videos: [{ id: "g5", title: "SSC Reasoning Tricks", url: "https://www.youtube.com/results?search_query=SSC+Reasoning+Tricks" }]
        },
        {
          name: "General Awareness",
          videos: [{ id: "g6", title: "SSC GK & Current Affairs", url: "https://www.youtube.com/results?search_query=SSC+GK+Current+Affairs" }]
        }
      ]
    },
    {
      name: "UPSC / Civil Services",
      description: "Preparation for IAS, IPS exams.",
      subtopics: [
        {
          name: "Polity",
          videos: [{ id: "g7", title: "Indian Constitution Basics", url: "https://www.youtube.com/results?search_query=Indian+Constitution+Basics+UPSC" }]
        },
        {
          name: "History",
          videos: [{ id: "g8", title: "Modern Indian History", url: "https://www.youtube.com/results?search_query=Modern+Indian+History+UPSC" }]
        },
        {
          name: "Geography",
          videos: [{ id: "g9", title: "Indian Geography Mapping", url: "https://www.youtube.com/results?search_query=Indian+Geography+Mapping+UPSC" }]
        },
        {
          name: "Current Affairs",
          videos: [{ id: "g10", title: "Daily Current affairs UPSC", url: "https://www.youtube.com/results?search_query=Daily+Current+affairs+UPSC" }]
        }
      ]
    },
    {
      name: "Railway / Defense",
      description: "Preparation for RRB, NDA, CDS.",
      subtopics: [
        {
          name: "Technical",
          videos: [{ id: "g11", title: "RRB Technical Essentials", url: "https://www.youtube.com/results?search_query=RRB+Technical+Essentials" }]
        },
        {
          name: "General Knowledge",
          videos: [{ id: "g12", title: "Defense GK preparation", url: "https://www.youtube.com/results?search_query=Defense+GK+preparation" }]
        },
        {
          name: "Physical Preparation",
          videos: [{ id: "g13", title: "Physical Standards Defense", url: "https://www.youtube.com/results?search_query=Physical+Standards+Defense" }]
        }
      ]
    }
  ]
};

const CourseDashboard = ({ dataset }) => {
  const [searchParams] = useSearchParams();
  const topicQuery = searchParams.get('topic');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubtopics, setExpandedSubtopics] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [aiVideoCache, setAiVideoCache] = useState({});
  const [loadingSubtopics, setLoadingSubtopics] = useState({});
  
  const categoryRefs = useRef({});
  const subtopicRefs = useRef({});

  // Initialize and handle URL topics - only if non-empty and stable
  useEffect(() => {
    if (!topicQuery) return;
    
    setSearchQuery(topicQuery);
    
    // Auto-expand exactly matched category/subtopic
    const newExpCat = { ...expandedCategories };
    const newExpSub = { ...expandedSubtopics };
    
    let foundTarget = false;
    
    dataset.categories.forEach((cat, cIdx) => {
      let catMatch = cat.name.toLowerCase().includes(topicQuery.toLowerCase());
      let subMatchFound = false;
      
      cat.subtopics.forEach((sub, sIdx) => {
        if (sub.name.toLowerCase().includes(topicQuery.toLowerCase())) {
          newExpSub[`${cIdx}-${sIdx}`] = true;
          subMatchFound = true;
          catMatch = true;
          
          // Scroll to subtopic
          if (!foundTarget) {
             setTimeout(() => {
               subtopicRefs.current[`${cIdx}-${sIdx}`]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
             }, 300);
             foundTarget = true;
          }
        }
      });
      
      if (catMatch || subMatchFound) {
        newExpCat[cIdx] = true;
      }
    });
    
    setExpandedCategories(newExpCat);
    setExpandedSubtopics(newExpSub);
  }, [topicQuery]); // topicQuery is stable from useSearchParams

  // Filtering Logic
  const filteredCategories = dataset.categories.map(cat => {
    const matchedSubtopics = cat.subtopics.map(sub => {
      const matchSub = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchedVideos = sub.videos.filter(vid => vid.title.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (matchSub || matchedVideos.length > 0) {
        return { ...sub, videos: matchedVideos.length > 0 && searchQuery ? matchedVideos : sub.videos };
      }
      return null;
    }).filter(Boolean);
    
    if (cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || matchedSubtopics.length > 0) {
      return { ...cat, subtopics: matchedSubtopics.length > 0 ? matchedSubtopics : cat.subtopics };
    }
    return null;
  }).filter(Boolean);

  const toggleCategory = (idx) => {
    setExpandedCategories(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleSubtopic = async (cIdx, sIdx, subtopicName) => {
    const key = `${cIdx}-${sIdx}`;
    const willExpand = !expandedSubtopics[key];
    setExpandedSubtopics(prev => ({ ...prev, [key]: willExpand }));
    
    if (willExpand && subtopicName && !aiVideoCache[subtopicName]) {
      setLoadingSubtopics(prev => ({...prev, [subtopicName]: true}));
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:8000/api/courses/recommendations', {
          topic: subtopicName,
          careerPath: localStorage.getItem('careerPath') || 'placement'
        }, { headers: { Authorization: `Bearer ${token}` }});
        
        if (res.data.videos && res.data.videos.length > 0) {
           setAiVideoCache(prev => ({...prev, [subtopicName]: res.data.videos}));
        }
      } catch(err) {
        console.error("AI Fallback active.", err);
      } finally {
        setLoadingSubtopics(prev => ({...prev, [subtopicName]: false}));
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold dark:text-white">Structured Placement Courses</h2>
        <p className="text-gray-500 mt-2">Comprehensive video playlists mapped directly to your placement modules.</p>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-11 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:text-white transition-all text-lg"
          placeholder="Search for categories, topics, or videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Directory Layout */}
        <div className="flex-1 w-full space-y-4">
          {filteredCategories.length === 0 && (
             <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
               No courses found matching "{searchQuery}"
             </div>
          )}
          
          {filteredCategories.map((category, cIdx) => (
            <div 
              key={cIdx} 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-200"
              ref={el => categoryRefs.current[cIdx] = el}
            >
              {/* Category Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 flex justify-between items-center transition-colors"
                onClick={() => toggleCategory(cIdx)}
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-blue-500" /> {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
                </div>
                <button className="text-gray-400">
                  {expandedCategories[cIdx] ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                </button>
              </div>

              {/* Subtopics Accordion */}
              {expandedCategories[cIdx] && (
                <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                  {category.subtopics.map((subtopic, sIdx) => {
                    const isSubExpanded = expandedSubtopics[`${cIdx}-${sIdx}`] || (searchQuery && category.subtopics.length <= 2);
                    return (
                      <div 
                        key={sIdx} 
                        className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                        ref={el => subtopicRefs.current[`${cIdx}-${sIdx}`] = el}
                      >
                        <div 
                          className={`p-4 pl-12 cursor-pointer flex justify-between items-center transition-colors ${isSubExpanded ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-gray-100 dark:hover:bg-gray-800/70'}`}
                          onClick={() => toggleSubtopic(cIdx, sIdx, subtopic.name)}
                        >
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{subtopic.name}</h4>
                          <span className="text-xs font-semibold px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg flex items-center gap-2">
                            {loadingSubtopics[subtopic.name] && <Loader2 className="w-3 h-3 animate-spin"/>}
                            {aiVideoCache[subtopic.name] ? aiVideoCache[subtopic.name].length : subtopic.videos.length} Videos
                          </span>
                        </div>

                        {/* Videos List */}
                        {isSubExpanded && (
                          <div className="bg-white dark:bg-gray-950/50 px-4 py-2 border-t border-gray-50 dark:border-gray-800/50">
                            {loadingSubtopics[subtopic.name] ? (
                              <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                            ) : (
                              (Array.isArray(aiVideoCache[subtopic.name] || subtopic.videos) ? (aiVideoCache[subtopic.name] || subtopic.videos) : []).map((video, vIdx) => {
                                if (!video || !video.url) return null;
                                const isAI = !!video.level;
                                const isActive = activeVideo?.id === video.id;
                                return (
                                  <div 
                                    key={vIdx}
                                    onClick={() => {
                                      window.open(video.url, '_blank');
                                      setActiveVideo(video); // kept to preserve original UI safely
                                    }}
                                    className={`flex items-center gap-3 p-3 ml-8 my-1 rounded-xl cursor-pointer transition-all ${
                                      isActive 
                                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-medium scale-[1.01]' 
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                                    }`}
                                  >
                                    <div className={`w-8 h-8 rounded-full ${isActive ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-800'} flex items-center justify-center`}>
                                      <ExternalLink className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                      <p className={isActive ? 'font-semibold' : ''}>{video.title || 'Untitled Video'}</p>
                                      {isAI && <span className="px-2 py-0.5 w-max text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-md">AI: {video.level}</span>}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Side: Video Player Modal / Sticky Sidebar */}
        <div className="hidden lg:block w-[450px] shrink-0 sticky top-6">
          {activeVideo ? (
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video relative">
              <iframe 
                src={activeVideo.url} 
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-900/50 border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-3xl aspect-video flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 p-8 text-center transition-all">
              <PlayCircle className="w-16 h-16 mb-4 opacity-30" />
              <p className="font-bold text-lg">Select a video to start learning</p>
              <p className="text-sm mt-2">The video player will stick here while you browse courses.</p>
            </div>
          )}
          
          {activeVideo && (
            <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white leading-tight">{activeVideo.title}</h3>
              <p className="text-sm text-gray-500 mt-2">Currently watching from your customized placement curriculum.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Video Player Popup */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black shadow-2xl transition-transform duration-300 transform ${activeVideo ? 'translate-y-0' : 'translate-y-full'}`}>
        {activeVideo && (
            <div className="w-full aspect-video relative">
              <div className="absolute -top-10 right-4">
                 <button onClick={() => setActiveVideo(null)} className="px-4 py-1.5 bg-gray-800 text-white rounded-t-xl text-xs font-bold uppercase hover:bg-gray-700">Close Player</button>
              </div>
              <iframe 
                src={activeVideo.url} 
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
        )}
      </div>
    </div>
  );
};

const ExistingCourses = () => (
  <div className="max-w-4xl mx-auto py-12 text-center">
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-md border border-gray-100 dark:border-gray-800">
      <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <BookOpen className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-bold dark:text-white mb-4">Standard Courses Overview</h2>
      <p className="text-gray-500 text-lg">
        This is the general courses component. Your specific track does not currently have a structured video playlist initialized.
      </p>
    </div>
  </div>
);

export default function Courses() {
  const careerPath = localStorage.getItem('careerPath');
  
  let activeData = placementData; // Default fallback
  
  if (careerPath === 'Higher Education') {
    activeData = higherData;
  } else if (careerPath === 'Government Exams') {
    activeData = governmentData;
  }
  
  return <CourseDashboard dataset={activeData} />;
}
