const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini with your 2026 model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const jobsPath = path.join(__dirname, 'data', 'jobs.json');
const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));

// API: Analyze Resume
app.post('/api/analyze', async (req, res) => {
    const { resumeText, jobId } = req.body;

    // --- EDGE CASE: Validation ---
    if (!resumeText || resumeText.trim().length < 20) {
        return res.status(400).json({ error: "Please paste a valid resume (at least 20 characters)." });
    }
    const selectedJob = jobsData.find(j => j.id === jobId);
    if (!selectedJob) return res.status(404).json({ error: "Job role not found." });

    console.log(`📥 [SERVER] Analyzing for: ${selectedJob.role}`);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `
            You are an expert technical recruiter. Compare the following resume to the job role.
            Job: ${selectedJob.role}
            Required Skills: ${selectedJob.required_skills.join(', ')}
            Resume: ${resumeText}
            
            Return ONLY a JSON object (no markdown, no backticks):
            {
              "matchScore": (0-100 number),
              "missingSkills": ["skill1", "skill2"],
              "roadmap": ["Step 1: Specific action", "Step 2: Specific action"]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().replace(/```json|```/g, "").trim();
        const aiData = JSON.parse(text);

        res.json({ ...aiData, method: "Gemini 2.5 AI Analysis" });

    } catch (error) {
        console.error("❌ [FALLBACK] AI Error:", error.message);
        
        // --- HAPPY PATH FALLBACK (Requirement: AI Fallback) ---
        const missing = selectedJob.required_skills.filter(
            s => !resumeText.toLowerCase().includes(s.toLowerCase())
        );

        res.json({
            matchScore: Math.max(0, 100 - (missing.length * 15)),
            missingSkills: missing,
            roadmap: missing.map(s => `Self-study and project implementation for ${s}`),
            method: "Rule-Based Fallback Engine"
        });
    }
});

app.get('/api/jobs', (req, res) => res.json(jobsData));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));