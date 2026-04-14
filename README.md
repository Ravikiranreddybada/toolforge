# 🤖 ToolForge — Agentic AI Workflow Platform

<div align="center">

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://toolforge-lyart.vercel.app/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://toolforge-df1j.onrender.com/health)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-00d4ff?style=for-the-badge&logo=react)](https://react.dev/)
[![Llama3.3](https://img.shields.io/badge/AI-Llama_3.3-7b2ff7?style=for-the-badge&logo=meta)](https://groq.com/)

**Next-generation MERN platform for autonomous AI agents using Chain-of-Thought (CoT) reasoning.**

[Explore Live Demo](https://toolforge-lyart.vercel.app/) · [Report Bug](https://github.com/Ravikiranreddybada/toolforge/issues) · [Request Feature](https://github.com/Ravikiranreddybada/toolforge/issues)
</div>

---

## 📖 Overview

**ToolForge** is a production-grade orchestration platform that transforms complex enterprise workflows into autonomous AI tasks. Leveraging **Llama 3.3 (via Groq)**, the platform provides specialized agents that don't just "chat"—they **plan, reason, and execute**.

### 🧩 The Problem
Enterprise technical tasks (Code reviews, SQL generation, Workflow planning) are often fragmented across multiple siloed tools, leading to context loss and inefficiency.

### 💡 The Solution
A unified, secure command center featuring six specialized agents with built-in **Chain-of-Thought (CoT)** reasoning, integrated directly into a high-performance MERN architecture with enterprise-grade authentication.

---

## 🚀 Live Demo

| Component | Status | URL |
|---|---|---|
| **Frontend UI** | ✅ Live | [toolforge-lyart.vercel.app](https://toolforge-lyart.vercel.app/) |
| **API Backend** | ✅ Live | [toolforge-df1j.onrender.com](https://toolforge-df1j.onrender.com/health) |
| **Demo Video** | 🎬 Watch | [Loom Walkthrough (Coming Soon)](#) |

---

## 🛠 Tech Stack

### 💻 Frontend
- **React 19 & Vite**: High-performance rendering and lightning-fast development.
- **Tailwind & Custom CSS**: Modern, premium UI with "Glassmorphism" aesthetics.
- **React Router 7**: Optimized client-side routing.
- **Context API**: Centralized state management for authentication and global settings.

### ⚙️ Backend
- **Node.js & Express**: Scalable RESTful API architecture.
- **Passport.js**: Multi-strategy authentication (Local + Google OAuth 2.0).
- **JWT (JSON Web Tokens)**: Secure, stateless session management.
- **CORS & Helm**: Production-hardened security headers.

### 🧠 AI Intelligence
- **Groq Llama 3.3 (70B)**: Ultra-fast LLM inference for real-time reasoning.
- **Chain-of-Thought (CoT)**: Advanced prompting techniques to ensure logical task execution.
- **AI Proxy Engine**: Secure backend-mediated communication with AI APIs.

### 🗄️ Database & DevOps
- **MongoDB Atlas**: Fully managed cloud NoSQL database.
- **Docker & Compose**: Containerized environment for consistent scaling.
- **Jenkins**: CI/CD pipeline automation.

---

## 🔥 Core AI Agents

ToolForge features six intelligent agents designed for specific enterprise pillars:

1.  **🔍 Web Research Agent**: Autonomously breaks down research queries and synthesizes findings into actionable reports.
2.  **🗄️ SQL Query Generator**: Generates optimized SQL queries based on natural language and provided database schemas.
3.  **🔬 Code Review Agent**: Scans snippets for bugs, security vulnerabilities, and provides a refactored version with a quality score.
4.  **⚙️ Workflow Planner**: Generates multi-tool automation skeletons (Python/LangChain) for complex business logic.
5.  **✍️ Prompt Engineering Agent**: Optimizes raw prompts using industry-standard engineering patterns for maximum LLM performance.
6.  **📡 API Integration Agent**: Generates production-ready integration code with error handling and authentication for any REST API.

---

## 📐 System Architecture

```mermaid
graph TD
  User((User)) -->|HTTPS/JWT| FE[React 19 Frontend - Vercel]
  FE -->|API Requests| BE[Express Backend - Render]
  
  subgraph Security Layer
    BE -->|OAuth| Passport[Google OAuth 2.0]
    BE -->|Token| JWT[JWT Generator]
  end

  BE -->|Proxy| Groq[Groq Llama 3.3 AI]
  BE -->|Storage| Atlas[MongoDB Atlas Cloud]
  
  subgraph DevOps
    Docker[Docker Containers]
    Jenkins[Jenkins CI/CD]
  end
```

---

## 📂 Project Structure

```text
toolforge/
├── backend/                # Node.js Express API
│   ├── config/             # Passport & DB configurations
│   ├── models/             # Mongoose schemas (User, etc.)
│   ├── routes/             # API Endpoints & AI Proxy logic
│   └── app.js              # Server entry point
├── frontend/               # React Application (Vite)
│   ├── src/
│   │   ├── pages/          # Dashboard, Login, Signup
│   │   ├── components/     # High-reusability UI components
│   │   └── context/        # AuthContext for state
│   └── public/             # Static assets
├── .env.example            # Template for environment variables
├── docker-compose.yml      # Multi-container orchestration
└── DEPLOY.md               # Detailed deployment guide
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18.x or higher
- MongoDB Atlas Cloud Database
- Groq / Anthropic API Keys

### 1. Clone the repository
```bash
git clone https://github.com/Ravikiranreddybada/toolforge.git
cd toolforge
```

### 2. Environment Configuration
Create a `.env` file in the root:
```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_uri
SESSION_SECRET=your_random_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
GROQ_API_KEY=your_groq_key
```

### 3. Local Installation
```bash
# Install and start Backend
cd backend
npm install
npm start

# Install and start Frontend (New Terminal)
cd ../frontend
npm install
npm run dev
```

---

## 🤝 The Team

| Leader | Frontend & UI/UX | Backend & Database |
| :---: | :---: | :---: |
| **Bada Ravi Kiran Reddy** | **V.Tanish** | **Kandunuri Eekshith Sai** |
| [GitHub](https://github.com/Ravikiranreddybada) | Optimization & Agents | API Orchestration |

---

## 📄 License
Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ for the Future of Agentic AI.</b><br/>
  © 2026 ToolForge Platform
</div>
