# 🏆 ToolForge: DevOps Demonstration Showcase

This document serves as a guide for the **DevOps Demonstration** assessment. It maps the project's technical architecture to the 10-point marking rubric.

---

## 📊 Marking Rubric Breakdown (10/10)

| Category | Marks | Implementation in ToolForge |
| :--- | :---: | :--- |
| **Jira** | 2 | Integrated via [JIRA_MAPPING.md](./JIRA_MAPPING.md). Shows task-to-commit traceability. |
| **Git** | 2 | Version control with semantic commits and [Professional Branching Strategy](#git-branching-strategy). |
| **Jenkins** | 2 | Automated CI/CD pipeline defined in [Jenkinsfile](./Jenkinsfile) with Build/Test/Deploy stages. |
| **Docker** | 2 | Pure MERN stack containerized via [Dockerfile](./Dockerfile) and [docker-compose.yml](./docker-compose.yml). |
| **Extra Mile**| 2 | **1. Agentic AI 2.0**: Full ReAct loop with MongoDB persistence.<br>**2. Observability**: LangSmith tracing for AI decision-making. |
| **Cloud/HTTPS**| +1 | Live on Render/Vercel with automated SSL deployment. |

---

## 🔧 Component Details

### 1. Jira Implementation (2 Marks)
We utilized a simulated Jira board to track enterprise features. 
*   **Traceability**: Every major commit is linked to a Jira Issue ID (e.g., `TF-001`).
*   **Documentation**: See [JIRA_MAPPING.md](./JIRA_MAPPING.md) for the full audit trail.

### 2. Git & Version Control (2 Marks)
#### Git Branching Strategy
We follow a **Feature-Branch Workflow**:
*   `main`: Production-ready code (mirrors Render/Vercel).
*   `develop`: Integration branch for finished and tested features.
*   `feature/*`: Isolated branches for new agents or security patches.

### 3. Jenkins CI/CD (2 Marks)
The [Jenkinsfile](./Jenkinsfile) automates the quality gate:
1.  **Checkout**: Pulls latest code from Git.
2.  **Install**: Installs Node.js dependencies.
3.  **Run Tests**: Executes `test.js` (Smoke tests & Model validation).
4.  **Build & Deploy**: Rebuilds the Docker containers.
5.  **Health Check**: Verifies the service is responsive before finalizing.

### 4. Docker Orchestration (2 Marks)
*   **Encapsulation**: The entire Backend + MongoDB stack is containerized.
*   **Portability**: `docker-compose up` allows any developer to spin up the full platform in seconds.
*   **Production Parity**: Docker ensures the local environment matches the cloud environment.

### 5. Extra Mile Effort (2 Marks)
#### ✅ Cloud Hosting & HTTPS
*   **Frontend**: [toolforge-lyart.vercel.app](https://toolforge-lyart.vercel.app/)
*   **Backend**: [toolforge-df1j.onrender.com](https://toolforge-df1j.onrender.com/health)
*   *Achievement*: Zero-downtime deployment with automated SSL/TLS.

#### ✅ ngrok (Network Tunneling)
*   Used for testing webhooks and showing local code to remote stakeholders via secure HTTPS tunnels.
*   *See*: [ngrok Guide](./docs/ngrok-guide.md) for demonstration steps.

#### ✅ Postman API Collection
*   [ToolForge.postman_collection.json](./ToolForge.postman_collection.json) provides a suite of automated API tests.

### 6. Agentic AI 2.0 (The True Agentic Loop)
We closed the gap between "generation" and "execution":
*   **ReAct Loop**: Implementation of the **Think → Act → Observe** autonomous cycle using LangGraph.
*   **Tool Execution**: Real-time interaction with **MongoDB** and **Tavily Search** (Web).
*   **Persistence**: Conversational memory is stored in MongoDB using `MongoDBSaver`.
*   **Observability**: Integrated **LangSmith** for full audit trails of AI reasoning steps.

---

**Prepared by:** Bada Ravi Kiran Reddy  
**Project:** ToolForge — Agentic AI Workflow Platform
