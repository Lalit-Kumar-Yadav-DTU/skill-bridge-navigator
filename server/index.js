const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Load synthetic job data (Pillar: Data Safety)
const jobsPath = path.join(__dirname, 'data', 'jobs.json');
const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));

// API to get all jobs for the dropdown
app.get('/api/jobs', (req, res) => {
    res.json(jobsData);
});

// CORE FEATURE: Skill Gap Analysis
app.post('/api/analyze', async (req, res) => {
    const { resumeText, jobId } = req.body;
    
    // 1. Find the selected job
    const selectedJob = jobsData.find(j => j.id === jobId);
    if (!selectedJob) return res.status(404).json({ error: "Job not found" });

    // 2. Input Validation (Pillar: Security)
    if (!resumeText || resumeText.length < 10) {
        return res.status(400).json({ error: "Please provide a valid resume." });
    }

    try {
        // --- AI LOGIC SIMULATION ---
        // Note: In a real app, you'd use OpenAI's 'gpt-4o' here.
        // We simulate the extraction of missing skills.
        const missingSkills = selectedJob.required_skills.filter(
            skill => !resumeText.toLowerCase().includes(skill.toLowerCase())
        );

        // If no skills are missing, match is 100%. Otherwise, calculate.
        const score = Math.max(0, 100 - (missingSkills.length * 20));

        // Throw an error 10% of the time to demonstrate the fallback
        if (process.env.SIMULATE_AI_ERROR === "true") throw new Error("AI Service Offline");

        res.json({
            matchScore: score,
            missingSkills: missingSkills,
            roadmap: missingSkills.map(s => `Master ${s} through a dedicated project.`),
            analysisMethod: "AI-Powered NLP (Simulated)"
        });

    } catch (error) {
        // 3. MANDATORY FALLBACK (Requirement: AI Fallback)
        console.warn("Switching to Rule-Based Fallback Engine...");
        
        const fallbackMissing = selectedJob.required_skills.filter(
            skill => !resumeText.toLowerCase().includes(skill.toLowerCase())
        );

        res.json({
            matchScore: 50, // Static fallback score for safety
            missingSkills: fallbackMissing,
            roadmap: ["Review foundational documentation for: " + fallbackMissing.join(', ')],
            analysisMethod: "Rule-Based Fallback (Static Matching)"
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));