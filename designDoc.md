# 📑 Technical Design Documentation: Skill-Bridge Career Navigator
**Project:** Palo Alto Networks FY26 IT Hiring Case Study  
**Candidate:** Lalit Kumar Yadav (Delhi Technological University)  
**Architecture Focus:** Resilience, Scalability, and Responsible AI

---

## 1. Problem Understanding
The "Information Gap" in technical recruitment prevents many high-potential candidates from securing specialized roles. While students may have core fundamentals, they often lack visibility into the specific technical competencies (e.g., Redis, specific CI/CD tools, or Cloud Security protocols) required for industry-standard roles. 

**Skill-Bridge** solves this by providing a data-driven, AI-integrated auditor that identifies these gaps and provides a deterministic path to career readiness.

---

## 2. Technical Stack Selection

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite) | Chosen for high-speed Hot Module Replacement (HMR) and optimized build times, ensuring a highly responsive UI state. |
| **Backend** | Node.js (Express) | Lightweight and asynchronous, providing a non-blocking environment for third-party AI API calls. |
| **AI Engine** | Gemini 2.5-Flash | Selected for its superior context window, high-speed inference (Flash), and ability to return structured JSON schemas natively. |
| **Testing** | Jest / Supertest | Industry standard for ensuring API stability and validating server-side logic against edge cases. |

---

## 3. System Architecture & Flow

The application follows a secure, decoupled architecture focused on data integrity.



### Data Lifecycle:
1.  **Sanitization:** The React client captures resume text and role selection. Input is sanitized before being sent to the backend.
2.  **Prompt Engineering:** The Node.js backend utilizes **Chain-of-Thought** prompting. It forces the LLM to output a strictly formatted JSON object containing the `MatchScore`, `MissingSkills`, and `RoadmapSteps`.
3.  **Validation Layer:** The server validates the AI's response before relaying it to the client, preventing UI crashes due to malformed data.
4.  **Interaction Layer:** React state manages the "Update" lifecycle, allowing users to track their progress through the generated roadmap.

---

## 4. Core Engineering Pillars

### A. High-Availability & Resilient Fallback
In alignment with Palo Alto Networks' focus on **stable infrastructure**, the system features a **Graceful Degradation protocol**. 
* **Primary Tier:** Real-time NLP analysis via Gemini 2.5-Flash.
* **Secondary Tier (Fallback):** If the AI service experiences latency, rate-limiting, or outages, the system catches the error and executes a server-side **Keyword-Matching Engine**. This ensures 100% system availability for the end user.

### B. Technical Rigor (QA)
The project maintains high code quality through automated unit tests. We test:
* **Happy Path:** Successful score generation.
* **Edge Case 1:** 400 Bad Request for empty/missing resume text.
* **Edge Case 2:** 404 Not Found for invalid/non-existent Job IDs.

---

## 5. Engineering Trade-offs

### Text-Paste Submission vs. PDF Parsing
* **Decision:** Prioritized text-area input.
* **Reasoning:** Automated PDF parsing often introduces "noise" (layout artifacts, headers) that causes AI hallucinations. For a high-stakes career tool, **Data Integrity** is more valuable than a file-upload UI. Text-paste ensures the AI receives 100% clean data for the audit.

### MERN-Lite Architecture
* **Decision:** Using a structured `jobs.json` file instead of a full MongoDB instance.
* **Reasoning:** To maximize development velocity on the **AI Resilience Tier** and **Testing Suite** within the 48-hour window. The system remains "Container-Ready" and can be easily migrated to a persistent DB in the future.

---

## 6. Responsible AI & Security
* **Zero-Retention Privacy:** Resume data is processed in-memory as a transient stream. No personal data is stored or used for model training.
* **Transparency:** The UI explicitly notifies the user if the "Fallback Engine" is active, ensuring user trust through architectural transparency.
* **Secret Management:** API credentials are never hardcoded; they are managed via isolated `.env` environments and excluded from version control.

---

## 7. Future Enhancements
1.  **Persistence Layer:** Implementing MongoDB for cross-session progress tracking.
2.  **Live Job Scraping:** Connecting to LinkedIn or Glassdoor APIs to analyze resumes against live, real-time job postings.
3.  **Advanced AI Guardrails:** Implementing a secondary "check" LLM to further minimize technical hallucinations in roadmap steps.