const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const jobsPath = path.join(__dirname, 'data', 'jobs.json');
const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));

// 1. Rule-Based Fallback Function (Mandatory Requirement)
const runManualFallback = (resumeText, requiredSkills) => {
  console.log("⚠️ AI Service Unavailable. Running Rule-Based Fallback...");
  const missing = requiredSkills.filter(
    skill => !resumeText.toLowerCase().includes(skill.toLowerCase())
  );
  return {
    matchScore: Math.max(0, 100 - (missing.length * 20)),
    missingSkills: missing,
    roadmap: missing.map(s => `Review documentation for ${s}`),
    method: "Manual Keyword Match (Fallback)"
  };
};

app.post('/api/analyze', async (req, res) => {
  const { resumeText, jobId } = req.body;
  const selectedJob = jobsData.find(j => j.id === jobId);

  if (!selectedJob) return res.status(404).json({ error: "Job not found" });

  try {
    // 2. Real AI Integration (Requirement: AI Capability)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective and fast
      messages: [
        { role: "system", content: "You are a career coach. Compare the resume to the job skills and return a JSON object with matchScore (0-100), missingSkills (array), and roadmap (array of steps)." },
        { role: "user", content: `Job: ${selectedJob.role}. Requirements: ${selectedJob.required_skills.join(', ')}. Resume: ${resumeText}` }
      ],
      response_format: { type: "json_object" }
    });

    const aiResult = JSON.parse(completion.choices[0].message.content);
    res.json({ ...aiResult, method: "OpenAI GPT-4o Analysis" });

  } catch (error) {
    // 3. Graceful Fallback (Requirement: AI Fallback)
    const fallbackResult = runManualFallback(resumeText, selectedJob.required_skills);
    res.json(fallbackResult);
  }
});

app.get('/api/jobs', (req, res) => res.json(jobsData));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));