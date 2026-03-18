const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const jobsPath = path.join(__dirname, 'data', 'jobs.json');
const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));

app.post('/api/analyze', async (req, res) => {
    console.log("📥 [SERVER] Received request for Job ID:", req.body.jobId);
    
    const { resumeText, jobId } = req.body;
    const selectedJob = jobsData.find(j => j.id === jobId);

    if (!selectedJob) return res.status(404).json({ error: "Job not found" });

    try {
        console.log("🧠 [AI] Calling Gemini 2.5-Flash...");

        const prompt = `
            Analyze this resume against the ${selectedJob.role} role. 
            Required Skills: ${selectedJob.required_skills.join(', ')}.
            Resume: ${resumeText}
            Return ONLY a JSON object: {"matchScore": 85, "missingSkills": ["React"], "roadmap": ["Step 1"]}
        `;

        // UPDATE THIS LINE TO THE 2026 VERSION
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("📄 [AI] Raw Response Received:", text);

        // Remove any markdown formatting if Gemini adds it
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const aiData = JSON.parse(cleanJson);

        console.log("✅ [SUCCESS] Analysis Complete!");
        res.json({ ...aiData, method: "Gemini 2.5 AI Analysis" });

    } catch (error) {
        console.error("❌ [ERROR] AI Step Failed:", error.message);
        
        // RESILIENT FALLBACK (Requirement: AI Fallback)
        const fallbackSkills = selectedJob.required_skills.filter(
            s => !resumeText.toLowerCase().includes(s.toLowerCase())
        );

        res.json({
            matchScore: 50,
            missingSkills: fallbackSkills,
            roadmap: ["AI service temporarily offline. Please manually verify skills: " + fallbackSkills.join(", ")],
            method: "Rule-Based Fallback (AI Offline)"
        });
    }
});

app.get('/api/jobs', (req, res) => res.json(jobsData));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));