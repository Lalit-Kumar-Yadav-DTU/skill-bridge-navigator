import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({}); // For "Update" functionality

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.error("Fetch Error", err));
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        resumeText,
        jobId: selectedJob
      });
      setResult(response.data);
      setCompletedSteps({}); // Reset steps for new analysis
    } catch (err) {
      alert(err.response?.data?.error || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (index) => {
    setCompletedSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: 'auto', color: '#333' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>🚀 Skill-Bridge Career Navigator</h1>
        <p><strong>Candidate:</strong> Lalit Kumar Yadav | Palo Alto Networks SWE Case Study</p>
      </header>

      <div style={{ display: 'grid', gap: '20px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div>
          <h3>1. Select Targeted Role (Filter)</h3>
          <select onChange={(e) => setSelectedJob(e.target.value)} value={selectedJob} style={{ width: '100%', padding: '12px', borderRadius: '6px' }}>
            <option value="">-- Select a Job Description --</option>
            {jobs.map(job => <option key={job.id} value={job.id}>{job.role}</option>)}
          </select>
        </div>

        <div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3>2. Paste Your Resume</h3>
    <span style={{ fontSize: '12px', color: '#888' }}>
      {resumeText.split(/\s+/).filter(w => w).length} words
    </span>
  </div>
    <textarea 
      rows="10" 
      style={{ 
        width: '100%', 
        padding: '15px', 
        borderRadius: '8px', 
        border: '1px solid #ddd',
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: 'monospace'
      }} 
      placeholder="Select a role above, then paste your resume text here..."
      value={resumeText}
      onChange={(e) => setResumeText(e.target.value)}
    ></textarea>
    <button 
      onClick={() => setResumeText('')} 
      style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', fontSize: '12px', marginTop: '5px' }}
    >
      Clear Text
    </button>
  </div>

        <button 
          onClick={handleAnalyze} 
          disabled={loading || !selectedJob || !resumeText}
          style={{ padding: '15px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? "AI is Analyzing..." : "Generate Gap Analysis"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '40px', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Analysis Results</h2>
            <span style={{ fontSize: '12px', color: '#666' }}>Engine: {result.method}</span>
          </div>
          
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: result.matchScore > 70 ? '#28a745' : '#d73a49' }}>
            Match Score: {result.matchScore}%
          </div>

          <h3>Missing Skills Identified:</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {result.missingSkills.map((s, i) => (
              <span key={i} style={{ backgroundColor: '#fff', border: '1px solid #d73a49', color: '#d73a49', padding: '5px 12px', borderRadius: '20px', fontSize: '14px' }}>
                {s}
              </span>
            ))}
          </div>

          <h3>Personalized Learning Roadmap (Update Progress):</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {result.roadmap.map((step, i) => (
              <label key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '15px', 
                backgroundColor: '#fff', 
                borderRadius: '8px',
                cursor: 'pointer',
                textDecoration: completedSteps[i] ? 'line-through' : 'none',
                opacity: completedSteps[i] ? 0.6 : 1
              }}>
                <input type="checkbox" checked={!!completedSteps[i]} onChange={() => toggleStep(i)} />
                {step}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;