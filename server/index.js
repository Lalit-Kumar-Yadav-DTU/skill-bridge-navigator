const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const jobsPath = path.join(__dirname, 'data', 'jobs.json');
const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));

app.get('/api/jobs', (req, res) => {
    res.json(jobsData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));