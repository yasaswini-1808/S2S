import os
from openai import AsyncOpenAI
from dotenv import load_dotenv
import json

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy"))

async def classify_career_path(data: dict) -> dict:
    """
    Simulates or calls OpenAI to determine the best path.
    Paths: "Placement Preparation", "Higher Education", "Government Exams"
    """
    if os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "your_openai_api_key_here":
        try:
            # Call Real OpenAI logic here
            prompt = f"""
            User Profile:
            Interests: {', '.join(data.get('interests', []))}
            CGPA: {data.get('cgpa')}
            Skills: {', '.join(data.get('skills', []))}
            Financial: {data.get('financial_condition')}
            Time: {data.get('time_availability')} hours/day
            Preference: {data.get('career_preference', 'None')}
            
            Classify this student into one of three paths:
            1. "Placement Preparation"
            2. "Higher Education"
            3. "Government Exams"
            
            Return pure JSON like:
            {{
                "suggested_path": "Path Name",
                "confidence": 85,
                "reasoning": "Brief explanation"
            }}
            """
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={ "type": "json_object" },
                messages=[{"role": "user", "content": prompt}]
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"OpenAI Error during classify_career_path: {e}. Falling back to mock mechanism.")
            pass # Fallthrough to mock
            
    # Mock Logic based on heuristic
        interests = " ".join(data.get("interests", [])).lower()
        pref = (data.get("career_preference") or "").lower()
        if "gov" in pref or "upsc" in interests or "ssc" in interests:
            path = "Government Exams"
        elif "abroad" in pref or "ms" in pref or "research" in interests:
            path = "Higher Education"
        else:
            path = "Placement Preparation"
            
        return {
            "suggested_path": path,
            "confidence": 90,
            "reasoning": "Determined based on your core interests and career preference."
        }

async def analyze_resume(text: str) -> dict:
    if os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "your_openai_api_key_here":
        try:
            prompt = f"""
            Analyze this resume text:
            {text}
            
            Return pure JSON with format:
            {{
                "skills": ["Found Skill 1", "Found Skill 2"],
                "missing_skills": ["Recommended Skill 1", "Recommended Skill 2"],
                "suggested_roles": ["Role 1", "Role 2"]
            }}
            """
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={ "type": "json_object" },
                messages=[{"role": "user", "content": prompt}]
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"OpenAI Error during analyze_resume: {e}. Falling back to mock mechanism.")
            pass # Fallthrough to mock
            
    # Mock Response
        text_lower = text.lower()
        skills = []
        if "react" in text_lower: skills.append("React")
        if "python" in text_lower: skills.append("Python")
        if "java " in text_lower: skills.append("Java")
        if "node" in text_lower: skills.append("Node.js")
        
        if not skills: skills = ["Basic Programming", "Communication"]
        
        return {
            "skills": skills,
            "missing_skills": ["System Design", "Cloud Computing (AWS/GCP)", "Advanced DSA"],
            "suggested_roles": ["Software Engineer", "Full Stack Developer", "Data Analyst"]
        }

async def generate_roadmap(role: str, time_weeks: int, hours_per_day: int, path: str = "Placement Preparation") -> list:
    print(f"Generating roadmap for Role: {role}, Path: {path}...")
    # Define Master Topic Lists for Strict AI Control
    master_topics = {
        "Placement Preparation": [
            "DBMS", "Data Structures", "Operating Systems", "Computer Networks", 
            "Full Stack", "Frontend", "Backend", "Cloud", "DSA", "Aptitude", 
            "Resume Building", "Machine Learning", "MERN Stack", "React", "Node"
        ],
        "Higher Education": [
            "GATE", "CAT", "JAM", "GRE", "TOEFL", "Quant", "Verbal", "Reading", 
            "Writing", "SOP Writing", "Research Methodology", "Study Abroad Readiness"
        ],
        "Government Exams": [
            "Quantitative Aptitude", "Reasoning", "English", "Math", "General Awareness",
            "Polity", "History", "Geography", "Current Affairs", "Technical", "General Knowledge"
        ]
    }
    
    # Select the relevant list based on the user's path
    available_topics = master_topics.get(path, master_topics["Placement Preparation"])

    if os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "your_openai_api_key_here":
        try:
            topic_str = ", ".join(available_topics)
            prompt = f"""
            You are a senior career advisor. Create a professional {time_weeks}-week preparation roadmap for a {role} role.
            The student can dedicate {hours_per_day} hours per day.
            
            STRICT TOPIC CONSTRAINT:
            You MUST ONLY use the following topics for the "tasks" field. Do NOT create your own task names:
            [{topic_str}]
            
            CRITICAL REQUIREMENTS:
            1. Every week (1 to {time_weeks}) must have unique, progressive content. No repetitions.
            2. Each week must have exactly 2-3 tasks from the permitted list above.
            3. Each task must match the permitted string EXACTLY (case-sensitive).
            
            Return exactly a JSON array of objects:
            [
                {{
                    "week": 1,
                    "topic": "Concise Week Title",
                    "tasks": ["Topic From List 1", "Topic From List 2"]
                }}
            ]
            """
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={ "type": "json_object" },
                messages=[
                    {"role": "system", "content": "You output only valid JSON arrays using strictly provided topic strings."},
                    {"role": "user", "content": prompt}
                ]
            )
            data = json.loads(response.choices[0].message.content)
            # Handle cases where the model might wrap the array in an object
            if isinstance(data, dict):
                for key in ["roadmap", "modules", "plan", "weeks"]:
                    if key in data and isinstance(data[key], list):
                        return data[key]
                return list(data.values())[0] if len(data) == 1 and isinstance(list(data.values())[0], list) else data
            return data
        except Exception as e:
            print(f"OpenAI Error during generate_roadmap: {e}. Falling back to mock mechanism.")
            pass # Fallthrough to mock
            
    # Mock Response (Randomly picking from master topics if AI fails)
    import random
    plan = []
    for w in range(1, time_weeks + 1):
        plan.append({
            "week": w,
            "topic": f"Module {w}: Mastering {path} essentials",
            "tasks": random.sample(available_topics, min(3, len(available_topics)))
        })
    return plan

async def fetch_video_recommendations(topic: str, level: str, career_path: str) -> list:
    if os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "your_openai_api_key_here":
        try:
            prompt = f"""
            Suggest exactly 5 high-quality YouTube videos or playlists for learning {topic} ({level} level) for a {career_path} student.
            Requirements:
            * Focus on structured learning
            * Prefer full courses or playlists
            * Use trusted educational channels
            * Avoid short or incomplete videos
            * Include a mix of beginner and advanced content
            
            Return pure JSON array format:
            [
                {{
                    "title": "Video Title",
                    "url": "YouTube URL",
                    "level": "Beginner/Intermediate/Advanced"
                }}
            ]
            """
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )
            data = response.choices[0].message.content
            
            # Extract JSON if returned inside markdown block
            if "```json" in data:
                data = data.split("```json")[1].split("```")[0].strip()
            elif "```" in data:
                data = data.split("```")[1].split("```")[0].strip()
                
            videos = json.loads(data)
            
            valid_videos = []
            for v in videos:
                url_lower = v.get("url", "").lower()
                if "youtube.com/watch" in url_lower or "youtube.com/playlist" in url_lower or "youtu.be" in url_lower:
                    if not any(v.get("url") == ev.get("url") for ev in valid_videos):
                        v["id"] = v.get("url")
                        valid_videos.append(v)
            return valid_videos[:6]
        except Exception as e:
            print(f"OpenAI Error during fetch_video_recommendations: {e}. Falling back to mock mechanism.")
            pass
            
    return []

async def generate_mock_test(topics: list, career_path: str) -> list:
    topic_str = ", ".join(topics) if isinstance(topics, list) else str(topics)
    
    if os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "your_openai_api_key_here":
        try:
            prompt = f"""
            Generate a mock test of 10 multiple-choice questions for the following topics:
            {topic_str}

            Requirements:
            * Questions must be relevant to {career_path} exam preparation
            * Include beginner to intermediate difficulty
            * Each question must have 4 options
            * Provide correct answer and a brief explanation
            * Avoid duplicate or vague questions

            Return STRICT JSON:
            [
                {{
                    "question": "....",
                    "options": ["A","B","C","D"],
                    "correct_answer": "Actual option text from options",
                    "explanation": "Brief explanation"
                }}
            ]
            """
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": "You are a specialized examiner."},{"role": "user", "content": prompt}]
            )
            data = response.choices[0].message.content
            if "```json" in data:
                data = data.split("```json")[1].split("```")[0].strip()
            elif "```" in data:
                data = data.split("```")[1].split("```")[0].strip()
            
            questions = json.loads(data)
            # Basic validation
            valid_questions = [q for q in questions if "question" in q and "options" in q and "correct_answer" in q]
            return valid_questions[:10]
        except Exception as e:
            print(f"OpenAI Error during generate_mock_test: {e}")
            pass
            
    # Step 5: Fallback System - Load predefined high-quality questions
    fallback_data = {
        "Aptitude": [
            {"question": "What is the average of first 10 natural numbers?", "options": ["5", "5.5", "6", "4.5"], "correct_answer": "5.5", "explanation": "Sum = n(n+1)/2. Average = (n+1)/2 = 5.5"},
            {"question": "A train passes a pole in 15 seconds. If speed is 60km/h, its length is?", "options": ["250m", "150m", "100m", "200m"], "correct_answer": "250m", "explanation": "D = S * T. 60 * 5/18 * 15 = 250m"},
            {"question": "Ratio of 3:4 increases to 4:5 after 6 is added. What's the sum?", "options": ["42", "36", "30", "24"], "correct_answer": "42", "explanation": "3x+6 / 4x+6 = 4/5. 15x+30 = 16x+24. x=6. Sum=7x=42."},
            {"question": "Smallest number exactly divisible by 12, 15, 20 and 27?", "options": ["540", "420", "360", "650"], "correct_answer": "540", "explanation": "LCM of (12, 15, 20, 27) = 540."},
            {"question": "A does work in 10 days, B in 15 days. Together they take?", "options": ["6 days", "5 days", "8 days", "7 days"], "correct_answer": "6 days", "explanation": "Effective rate = 1/10 + 1/15 = 5/30 = 1/6. Days=6."},
            {"question": "Profit of 20% on Cost Price is what % on Selling Price?", "options": ["16.67%", "25%", "15%", "20%"], "correct_answer": "16.67%", "explanation": "Profit = 20. CP=100. SP=120. Profit on SP = 20/120 * 100 = 16.67%."},
            {"question": "HCF of 42, 63 and 105?", "options": ["21", "7", "14", "42"], "correct_answer": "21", "explanation": "Common divisor is 21."},
            {"question": "Simple interest on 5000 at 10% for 3 years?", "options": ["1500", "1550", "1000", "1200"], "correct_answer": "1500", "explanation": "SI = P*R*T/100 = 5000*10*3 / 100 = 1500."},
            {"question": "Sum of angles in a triangle?", "options": ["180°", "360°", "90°", "120°"], "correct_answer": "180°", "explanation": "Standard geometrical fact."},
            {"question": "A vendor buys 6 for 5 and sells 5 for 6. Profit %?", "options": ["44%", "33%", "25%", "20%"], "correct_answer": "44%", "explanation": "CP=25, SP=36. Profit=11/25 = 44%."}
        ],
        "Reasoning": [
            {"question": "Which word does not belong with others?", "options": ["Tailor", "Baker", "Dryer", "Carpenter"], "correct_answer": "Dryer", "explanation": "Others are professions, dryer is a machine."},
            {"question": "Series: 4, 9, 16, 25, 36, ?", "options": ["49", "47", "50", "64"], "correct_answer": "49", "explanation": "Series of squares: 2^2... 7^2 = 49"},
            {"question": "If COVE is FRYH, what is SHED?", "options": ["VKHG", "UKHG", "VKIG", "WKGH"], "correct_answer": "VKHG", "explanation": "Shift +3 positions for each letter."},
            {"question": "Pointed to a boy, Sita said 'He is son of only son of my grandfather'. Who is boy?", "options": ["Brother", "Uncle", "Cousin", "Father"], "correct_answer": "Brother", "explanation": "Only son of grandfather is father. Father's son is brother."},
            {"question": "A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?", "options": ["Granddaughter", "Daughter", "Grandmother", "Mother"], "correct_answer": "Granddaughter", "explanation": "A is child of D's child."},
            {"question": "Day before yesterday was Saturday. What day will be after tomorrow?", "options": ["Wednesday", "Tuesday", "Thursday", "Friday"], "correct_answer": "Wednesday", "explanation": "Saturday->Sunday->Monday(today)->Tuesday->Wednesday."},
            {"question": "Complete: CUP : LIP :: BIRD : ?", "options": ["BEAK", "GRASS", "FOREST", "BUSH"], "correct_answer": "BEAK", "explanation": "Lip for drinking, beak for eating."},
            {"question": "Series: 7, 10, 8, 11, 9, 12, ?", "options": ["10", "7", "12", "13"], "correct_answer": "10", "explanation": "Alternative logic: +3, -2, +3..."},
            {"question": "A starts at 12:00, ends at 3:15. What's the total angle of hour hand?", "options": ["97.5°", "90°", "100°", "105°"], "correct_answer": "97.5°", "explanation": "3.25 * 30 = 97.5."},
            {"question": "Odd one out: Curd, Butter, Oil, Cheese", "options": ["Oil", "Curd", "Butter", "Cheese"], "correct_answer": "Oil", "explanation": "Others are dairy products."}
        ],
        "Higher Ed": [
            {"question": "Main goal of Research Methodology?", "options": ["Systematic investigation", "Gathering data", "Proving hypothesis", "Getting grants"], "correct_answer": "Systematic investigation", "explanation": "It's the core definition of research methodology."},
            {"question": "Maximum score in TOEFL iBT?", "options": ["120", "100", "1600", "9"], "correct_answer": "120", "explanation": "Each of the 4 sections is out of 30."},
            {"question": "A 'Pilot Study' refers to?", "options": ["Small scale preliminary study", "Study on aircraft", "Large scale census", "Final phase of research"], "correct_answer": "Small scale preliminary study", "explanation": "It tests the feasibility before the main study."},
            {"question": "Primary data is collected through?", "options": ["Surveys", "Journals", "Books", "Internet archives"], "correct_answer": "Surveys", "explanation": "Primary = first hand data."},
            {"question": "The JAM exam (IIT) is primarily for?", "options": ["Master's at IITs", "B.Tech at IITs", "Research fellowship", "MBA at IIMs"], "correct_answer": "Master's at IITs", "explanation": "Joint Admission test for Masters."},
            {"question": "What is an 'Abstract' in a paper?", "options": ["Short summary", "Detail results", "Bibliography", "Opening quote"], "correct_answer": "Short summary", "explanation": "Briefly describes the paper content."},
            {"question": "In TOEFL, which section tests integrated skills?", "options": ["Speaking", "Reading", "Vocabulary", "Grammar"], "correct_answer": "Speaking", "explanation": "It uses reading and listening inputs."},
            {"question": "Quantitative research involves?", "options": ["Numerical data", "Life stories", "Visual art", "Historical records"], "correct_answer": "Numerical data", "explanation": "It focuses on measurement and statistics."},
            {"question": "Commonly used citation style in Science?", "options": ["APA", "MLA", "Chicago", "Harvard"], "correct_answer": "APA", "explanation": "APA is dominant in many sciences."},
            {"question": "A hypothesis is?", "options": ["Testable prediction", "Absolute truth", "Random guess", "Detailed result"], "correct_answer": "Testable prediction", "explanation": "A cornerstone of the scientific method."}
        ]
    }
    
    # Logic to pick relevant set or mix
    final_fallback = []
    # Identify track
    track_key = "Aptitude"
    if "Higher" in career_path: track_key = "Higher Ed"
    elif "Placement" in career_path: track_key = "Reasoning" # Mix Reasoning/Aptitude
    elif "Government" in career_path: track_key = "Aptitude"

    # Match topics
    matched_set = []
    for t in topics:
        t_low = t.lower()
        for cat, q_list in fallback_data.items():
            if any(k.lower() in t_low for k in cat.split()):
                matched_set.extend(q_list)
                break
    
    # Fill up to 10
    final_fallback.extend(matched_set)
    # Add track specific items
    final_fallback.extend(fallback_data.get(track_key, []))
    # Fill with Aptitude if still short
    if len(final_fallback) < 10:
        final_fallback.extend(fallback_data["Aptitude"])
    
    # Unique check by question text
    seen = set()
    unique_fallback = []
    for q in final_fallback:
        if q["question"] not in seen:
            unique_fallback.append(q)
            seen.add(q["question"])
            
    return unique_fallback[:10]

async def generate_mock_interview(completed_modules: list, career_path: str) -> list:
    if os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "your_openai_api_key_here":
        try:
            topics_str = ", ".join(completed_modules) if completed_modules else "General aptitude and fundamentals"
            prompt = f"""
            Generate 6 interactive subjective interview questions for a {career_path} track student.
            They have completed the following modules: {topics_str}.
            
            The questions should evaluate their conceptual understanding of these exact modules. The difficulty should escalate progressively.
            
            Return ONLY a valid JSON array format:
            [
                {{
                    "question": "Describe how you would approach...",
                    "hint": "Think about the tradeoff between...",
                    "ideal_answer_keywords": ["keyword1", "keyword2"]
                }}
            ]
            """
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": "You are an expert technical interviewer."},{"role": "user", "content": prompt}]
            )
            data = response.choices[0].message.content
            if "```json" in data:
                data = data.split("```json")[1].split("```")[0].strip()
            elif "```" in data:
                data = data.split("```")[1].split("```")[0].strip()
            return json.loads(data)
        except Exception as e:
            print(f"OpenAI Error during generate_mock_interview: {e}")
            pass
            
    # Fallback
    return [
        {
            "question": "Can you explain your methodology for solving complex problems?",
            "hint": "Fallback interview question.",
            "ideal_answer_keywords": ["logic", "step-by-step"]
        }
    ]

async def get_chat_response(query: str, history: list, career_path: str, current_page: str) -> str:
    if os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "your_openai_api_key_here":
        try:
            # Prepare context-aware system prompt
            system_prompt = f"""
            You are an AI assistant for the Study2Success web application.

            Your role:
            * Help users navigate and understand the platform
            * Answer questions about: Courses, Roadmap, Mock tests, Mock interviews, and Career paths (Placement Preparation, Higher Education, Government Exams).

            Contextual Information:
            * User's Career Path: {career_path}
            * Current Page: {current_page}

            Rules:
            * Use previous conversation history to maintain continuity.
            * Keep responses short, clear, and helpful.
            * Do NOT generate unrelated content or answer outside the platform scope.
            * If unsure, guide user logically using app features.
            """

            # Build full message list (limit history to last 10 messages for efficiency)
            limited_history = history[-10:]
            messages = [{"role": "system", "content": system_prompt}]
            
            for msg in limited_history:
                messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
            
            # Add latest query
            messages.append({"role": "user", "content": query})

            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI Chat Error: {e}")
            # Quota or Connection Error - Fallthrough to Demo Mode
            pass

    # Demo Mode Fallback (Rule-Based)
    query_lower = query.lower()
    
    # 1. Roadmap Questions
    if any(k in query_lower for k in ["roadmap", "plan", "what to do", "next"]):
        return "You can find your personalized study plan in the 'Roadmap' tab. It breaks down your goal into weekly modules with specific tasks and courses."
    
    # 2. Progress / Grades Questions
    if any(k in query_lower for k in ["progress", "grade", "score", "how am i doing", "mark"]):
        return "Your learning progress and assessment scores are tracked in the 'Grades' tab. Complete tasks and take mock tests to see your scores improve!"
    
    # 3. Course / Video Questions
    if any(k in query_lower for k in ["course", "video", "learn", "study material"]):
        return "The 'Courses' section offers AI-recommended YouTube videos for each topic in your roadmap. You can search for any topic to get tailored recommendations."
    
    # 4. Mock Test / Interview
    if any(k in query_lower for k in ["test", "mock", "interview", "practice"]):
         return "You can take practice 'Mock Tests' at the end of each roadmap module. For placement students, we also offer 'Mock Interviews' to prepare for real-world scenarios."
    
    # 5. Career Path / Profile
    if any(k in query_lower for k in ["path", "track", "higher ed", "placement", "government"]):
         return f"You are currently on the {career_path} track. You can view and update your profile details in the 'Profile' section."

    # 6. General Platform
    if any(k in query_lower for k in ["who are you", "help", "what is this", "platform"]):
         return "I am the Study2Success Assistant. I can help you navigate your roadmap, find courses, and track your progress toward your career goals!"

    return "I'm currently in Demo Mode because my connection to the main AI brain is offline (likely a quota issue). However, I can still answer basic questions about the Roadmap, Courses, Grades, and Mock Tests. What would you like to know?"
