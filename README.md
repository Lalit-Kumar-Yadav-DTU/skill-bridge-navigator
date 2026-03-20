# 🚀 Skill-Bridge Career Navigator
**Candidate:** Lalit Kumar Yadav (Delhi Technological University)  
**Case Study:** Palo Alto Networks FY26 IT Hiring Challenge

---

## 📸 Application Preview
![App Screenshot](./screenshot.png)

---

## 📺 Project Submission Links
| Resource | Link |
| :--- | :--- |
| **Video Presentation** | [▶️ Watch the 5-7 Minute Demo on YouTube](https://youtu.be/vcE9YYhnV5U) |
| **Design Documentation** | [📄 View Technical Design Documentation](./designDoc.md) |

---

## 📌 Project Overview
> **The Problem:** Students and career-switchers often face a "Black Box" when applying for specialized roles. They may have the core skills but miss the specific "last-mile" technical requirements that lead to successful placements.

**The Solution:** `Skill-Bridge` is an AI-powered navigator that performs a deep-tissue gap analysis on a user’s resume. By comparing real-world resume text against specific industry-standard job descriptions using **Gemini 2.5-Flash**, it generates a personalized, actionable roadmap to bridge those gaps.

---

## 🛠️ Technical Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Axios, CSS3 (Modular & Responsive UI) |
| **Backend** | Node.js, Express.js |
| **AI Engine** | Google Gemini 2.5-Flash (via Google AI Studio) |
| **Testing** | Jest, Supertest (Focusing on Edge Cases & Resilience) |
| **Security** | Environment-based configuration (`dotenv`) |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** v20.14.0 or higher.
* **Gemini API Key** (Google AI Studio).
  
### **Installation & Setup**
Gemini said
Got it! You're looking for that clean, professional Markdown structure where the headings (###) and code blocks (```bash) are properly isolated so GitHub renders them perfectly with "copy" buttons.

When you bunch them together without line breaks, GitHub’s parser can get confused and fail to render the code blocks.

Here is the exact raw Markdown you should paste into your README.md:

## 🚀 Installation & Setup

Follow these steps to get the **Skill-Bridge Navigator** running on your local machine.

### **1. Clone the Repository**
```bash
git clone [https://github.com/Lalit-Kumar-Yadav-DTU/skill-bridge-navigator](https://github.com/Lalit-Kumar-Yadav-DTU/skill-bridge-navigator)
cd skill-bridge-navigator
2. Backend Configuration
Bash
cd server
npm install
cp .env.example .env  # Manual Step: Open .env and add your GEMINI_API_KEY
node index.js
3. Frontend Configuration
Bash
cd ../client
npm install
npm run dev
4. Running Automated Tests
Bash
cd server
npm test
