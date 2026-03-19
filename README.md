🚀 Skill-Bridge Career Navigator
Candidate: Lalit Kumar Yadav (Delhi Technological University)

Project: Palo Alto Networks SWE Case Study — AI-Powered Skill Gap Analysis

📌 Project Overview
The Skill-Bridge Career Navigator is a full-stack application designed to help job seekers bridge the gap between their current skills and industry requirements. Using Gemini 2.5-Flash, the tool analyzes resume text against specific job roles to provide a match score, identify missing skills, and generate a personalized learning roadmap.

🛠️ Technical Stack
Frontend: React 18 (Vite), Axios, CSS3 (Modular UI).

Backend: Node.js, Express.js.

AI Engine: Google Gemini 2.5-Flash (via Google AI Studio).

Testing: Jest, Supertest.

DevOps: Environment-based configuration (dotenv).

🧠 Core Engineering Pillars
1. High-Availability AI & Fallback Logic
In a production environment, third-party APIs can fail or be rate-limited. This application implements a Resilient Fallback Engine:

Primary: Real-time NLP analysis via Gemini 2.5-Flash.

Secondary (Fallback): If the AI service is unreachable, a server-side Rule-Based Keyword Matcher automatically takes over. This ensures the user always receives a functional gap analysis, satisfying the "System Resilience" requirement.

2. Full-Stack CRUD Implementation
The application follows a structured data flow:

Create: User submits resume text and selects a role for analysis.

View: The system renders a detailed Match Score and Skill Breakdown.

Update: An interactive Roadmap Progress Tracker allows users to "Check off" completed steps, dynamically updating the UI state (fulfilling the 'Update' requirement).

Filter: A multi-role job library allows users to target specific career paths.

3. Security Hygiene
Secret Management: All API credentials are isolated in .env files and excluded from version control via .gitignore.

Input Validation: The backend enforces data sanity checks (e.g., preventing empty submissions or invalid Job IDs) to protect server resources.

4. Technical Rigor (Testing)
The system includes automated unit tests using Jest to ensure reliability:

Happy Path: Verifies successful analysis for valid inputs.

Edge Case 1: Validates server response for empty/missing resume text (400 Bad Request).

Edge Case 2: Validates server response for non-existent Job IDs (404 Not Found).

⚖️ Engineering Tradeoffs
Text-Paste vs. PDF Parsing: I prioritized data integrity over a file-upload UI. PDF parsing often introduces "noise" (layout artifacts); by using a text-paste method, I ensured the AI receives clean, 100% accurate data for the NLP analysis.

JSON over Database: To maximize velocity during the 48-hour window, I used a structured jobs.json file for the job library. This allowed me to focus more time on AI Integration and Robust Testing, which provide higher value to the core project goal.

🚀 Getting Started
Prerequisites
Node.js v20.14.0 or higher.

A Gemini API Key (from Google AI Studio).


Installation
    1 Clone the Repo:

        git clone [your-repo-link]
        cd skill-bridge-navigator
    
    2 Setup Backend:
    
        cd server
        npm install
        cp .env.example .env  # Add your GEMINI_API_KEY here
        node index.js
    
    3 Setup Frontend:
    
        cd ../client
        npm install
        npm run dev
    
    4 Running Tests
    
        cd server
        npm test