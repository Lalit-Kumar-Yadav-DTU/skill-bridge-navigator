import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load jobs on startup (Requirement: View/Search)
  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error("Error fetching jobs", err));
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        resumeText,
        jobId: selectedJob
      });
      setResult(response.data);
    } catch (err) {
      alert(err.response?.data?.error || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>🚀 Skill-Bridge Career Navigator</h1>
      <p>Palo Alto Networks Case Study | Candidate: Lalit Kumar Yadav</p>
      
      <hr />

      {/* Step 1: Select Job */}
      <section>
        <h3>1. Select Your Target Role</h3>
        <select onChange={(e) => setSelectedJob(e.target.value)} value={selectedJob} style={{ width: '100%', padding: '10px' }}>
          <option value="">-- Choose a Role --</option>
          {jobs.map(job => <option key={job.id} value={job.id}>{job.role}</option>)}
        </select>
      </section>

      {/* Step 2: Input Resume (Requirement: Create/Input) */}
      <section style={{ marginTop: '20px' }}>
        <h3>2. Paste Your Resume (Text)</h3>
        <textarea 
          rows="10" 
          style={{ width: '100%', padding: '10px' }} 
          placeholder="Paste resume content here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        ></textarea>
      </section>

      <button 
        onClick={handleAnalyze} 
        disabled={loading || !selectedJob || !resumeText}
        style={{ marginTop: '20px', padding: '15px 30px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {loading ? "Analyzing..." : "Analyze Skills Gap"}
      </button>

      {/* Result Dashboard (Requirement: View + AI Feature) */}
      {result && (
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f4f7f6', borderRadius: '10px' }}>
          <h2>Analysis Results ({result.analysisMethod})</h2>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Match Score: {result.matchScore}%</div>
          
          <h3>Missing Skills:</h3>
          <ul>
            {result.missingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h3>Your Personalized Roadmap:</h3>
          {result.roadmap.map((step, index) => (
            <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" id={`step-${index}`} style={{ marginRight: '10px' }} />
              <label htmlFor={`step-${index}`}>{step}</label>
            </div>
          ))}
          <p><i>Note: Checklist above allows you to track progress (Requirement: Update)</i></p>
        </div>
      )}
    </div>
  );
}

export default App;