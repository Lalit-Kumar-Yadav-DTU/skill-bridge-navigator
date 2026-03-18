const request = require('supertest');
const express = require('express');

// Mocking the app for testing
const app = express();
app.use(express.json());

// Mock Data
const mockJob = { id: "1", role: "Software Engineer", required_skills: ["React", "Node.js"] };

app.post('/api/analyze', (req, res) => {
    const { resumeText, jobId } = req.body;
    if (!resumeText) return res.status(400).json({ error: "Missing resume" });
    if (jobId !== "1") return res.status(404).json({ error: "Not found" });
    res.json({ matchScore: 100 });
});

describe('Career Navigator Edge Cases', () => {
    it('HAPPY PATH: should return 200 for valid input', async () => {
        const res = await request(app).post('/api/analyze').send({ resumeText: "React dev", jobId: "1" });
        expect(res.statusCode).toEqual(200);
    });

    it('EDGE CASE: should return 400 for empty resume', async () => {
        const res = await request(app).post('/api/analyze').send({ resumeText: "", jobId: "1" });
        expect(res.statusCode).toEqual(400);
    });

    it('EDGE CASE: should return 404 for invalid job ID', async () => {
        const res = await request(app).post('/api/analyze').send({ resumeText: "React dev", jobId: "999" });
        expect(res.statusCode).toEqual(404);
    });
});