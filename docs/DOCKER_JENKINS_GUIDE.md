# 🐳 Docker & Jenkins Setup Guide — ToolForge

A step-by-step guide to build, run, and automate the ToolForge application using Docker and Jenkins.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Running with Docker](#running-with-docker)
   - [Option A: Docker Compose (Recommended)](#option-a-docker-compose-recommended)
   - [Option B: Docker CLI (Manual)](#option-b-docker-cli-manual)
4. [Running with Jenkins](#running-with-jenkins)
   - [Install Jenkins](#1-install-jenkins)
   - [Configure Jenkins](#2-configure-jenkins)
   - [Create the Pipeline](#3-create-the-pipeline)
   - [Pipeline Stages Explained](#4-pipeline-stages-explained)
5. [Environment Variables](#environment-variables)
6. [Health Check](#health-check)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Make sure the following tools are installed before you begin:

| Tool | Version | Check Command |
|------|---------|---------------|
| Docker | 20.x+ | `docker --version` |
| Docker Compose | v2.x+ | `docker compose version` |
| Jenkins | 2.x LTS | `jenkins --version` |
| Node.js | 20.x | `node --version` |
| Git | Any | `git --version` |

---

## Project Structure

```
toolforge/
├── Dockerfile            # Container definition for the Node.js backend
├── docker-compose.yml    # Orchestrates the app + MongoDB services
├── Jenkinsfile           # CI/CD pipeline definition
├── .env                  # Environment variables (never commit this!)
├── .env.example          # Template for required environment variables
├── backend/              # Node.js Express application
└── frontend/             # React frontend (built separately)
```

---

## Running with Docker

### Option A: Docker Compose (Recommended)

Docker Compose spins up both the **Node.js app** and **MongoDB** together with a single command.

#### Step 1 — Set Up Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and populate the following keys:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
LANGCHAIN_API_KEY=your_langchain_api_key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=toolforge
```

#### Step 2 — Build and Start Containers

```bash
docker-compose up -d --build
```

| Flag | Meaning |
|------|---------|
| `-d` | Detached mode — runs in the background |
| `--build` | Rebuilds the Docker image from the `Dockerfile` |

#### Step 3 — Verify Containers are Running

```bash
docker-compose ps
```

Expected output:

```
NAME              IMAGE           COMMAND                  SERVICE   CREATED        STATUS                             PORTS
agenticai-app     toolforge-app   "docker-entrypoint.s…"   app       44 hours ago   Up 25 seconds (health: starting)   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
agenticai-mongo   mongo:7         "docker-entrypoint.s…"   mongo     44 hours ago   Up 25 seconds                      0.0.0.0:27018->27017/tcp, [::]:27018->27017/tcp
```

> **Note:** The `(health: starting)` status on `agenticai-app` is normal — it means the container just started and the built-in health check (`HEALTHCHECK` in the Dockerfile) is still warming up. After ~30 seconds it will transition to `(healthy)`.

#### Step 4 — Access the Application

Open your browser and navigate to:

```
http://localhost:3000/health
```

> [!NOTE]
> Visiting `http://localhost:3000/` will show **"Cannot GET /"**. This is normal because the backend is an API server. To verify it is working, always check the `/health` endpoint which should return `{"status":"ok"}`.

#### Useful Docker Compose Commands

```bash
# View live logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f app

# Stop all containers
docker-compose down

# Stop and remove volumes (wipes MongoDB data)
docker-compose down -v

# Restart a specific service
docker-compose restart app
```

---

### Option B: Docker CLI (Manual)

Use this approach if you want to run just the backend container without MongoDB via Compose.

#### Step 1 — Build the Docker Image

```bash
docker build -t toolforge-app .
```

#### Step 2 — Run the Container

```bash
docker run -d \
  --name toolforge \
  -p 3000:3000 \
  --env-file .env \
  toolforge-app
```

#### Step 3 — Check Container Status

```bash
docker ps
docker logs toolforge
```

#### Step 4 — Stop and Remove the Container

```bash
docker stop toolforge
docker rm toolforge
```

---

## Running with Jenkins

Jenkins automates the CI/CD pipeline defined in the `Jenkinsfile` at the project root.

### 1. Install Jenkins

#### macOS (via Homebrew)

```bash
brew install jenkins-lts
brew services start jenkins-lts
```

Jenkins will be available at: `http://localhost:8080`

#### Using Docker (Alternative)

```bash
docker run -d \
  --name jenkins-docker \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

> **Note:** Mounting `/var/run/docker.sock` allows Jenkins to run Docker commands from within the container.

---

### 2. Configure Jenkins

#### Unlock Jenkins

```bash
# For Docker installation:
docker exec jenkins-docker cat /var/jenkins_home/secrets/initialAdminPassword

# For macOS Homebrew installation:
cat ~/.jenkins/secrets/initialAdminPassword
```

Paste the password at `http://localhost:8080` to unlock.

#### Install Required Plugins

During setup, choose **"Install suggested plugins"**, then also install:

- **Git Plugin** — for source code checkout
- **Pipeline Plugin** — for `Jenkinsfile` support
- **Docker Pipeline Plugin** — for Docker commands in pipeline

Navigate to: `Manage Jenkins → Plugins → Available Plugins`

#### Add Docker to Jenkins PATH (macOS)

If Jenkins can't find the `docker` command:

1. Go to `Manage Jenkins → System`
2. Under **Global properties**, check **Environment variables**
3. Add: `Name = PATH`, `Value = /usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin`

---

### 3. Create the Pipeline

1. From the Jenkins dashboard, click **"New Item"**
2. Enter name: `toolforge-pipeline`
3. Select **"Pipeline"** → Click **OK**

#### Configure Source

Under the **Pipeline** section:
- Set **Definition** to: `Pipeline script from SCM`
- Set **SCM** to: `Git`
- Enter your **Repository URL** (e.g., `https://github.com/your-username/toolforge.git`)
- Set **Branch**: `*/main`
- Set **Script Path**: `Jenkinsfile`

Click **Save**.

#### Run the Pipeline

Click **"Build Now"** to trigger the first run.

---

### 4. Pipeline Stages Explained

The `Jenkinsfile` defines the following automated stages:

```
┌─────────────────────────────────────────────────────────────┐
│  Checkout  →  Install Deps  →  Run Tests  →  Docker Deploy  │
│                                               ↓             │
│                                          Health Check        │
└─────────────────────────────────────────────────────────────┘
```

| Stage | What It Does |
|-------|-------------|
| **Checkout** | Pulls the latest code from your Git repository via `checkout scm` |
| **Install Dependencies** | Runs `npm install` inside the `backend/` directory |
| **Run Tests** | Executes `node --test test.js` — pipeline continues even if no tests exist |
| **Build & Deploy with Docker** | Tears down old containers, rebuilds and starts fresh with `docker-compose up -d --build` |
| **Health Check** | Waits 10s then hits `http://localhost:3000/health` — fails the build if the app isn't responding |

#### Post Actions

| Status | Action |
|--------|--------|
| ✅ Success | Logs: `Pipeline completed successfully! App is running at http://localhost:3000` |
| ❌ Failure | Logs: error message + runs `docker-compose logs` for diagnosis |

---

## Environment Variables

The following environment variables are required at runtime. Set them in your `.env` file for local use, or in Jenkins credentials for CI/CD.

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Application port (default: `3000`) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `SESSION_SECRET` | Express session secret key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret | Yes |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URI | Yes |
| `GROQ_API_KEY` | Groq LLM API key | Yes |
| `TAVILY_API_KEY` | Tavily Search API key | Yes |
| `LANGCHAIN_API_KEY` | LangSmith API key | Optional |
| `LANGCHAIN_TRACING_V2` | Enable LangSmith tracing (`true`/`false`) | Optional |
| `LANGCHAIN_PROJECT` | LangSmith project name | Optional |

#### Adding Secrets to Jenkins

1. Go to `Manage Jenkins → Credentials → (global) → Add Credentials`
2. Choose **"Secret text"** for each API key
3. Reference them in `Jenkinsfile` using:

```groovy
environment {
    GROQ_API_KEY = credentials('groq-api-key')
    TAVILY_API_KEY = credentials('tavily-api-key')
}
```

---

## Health Check

The Dockerfile includes a built-in health check:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1
```

To manually verify the app is healthy:

```bash
curl http://localhost:3000/health
```

Expected response: `200 OK`

View container health status:

```bash
docker inspect --format='{{.State.Health.Status}}' agenticai-app
```

---

## Troubleshooting

### ❌ `docker-compose: command not found`

```bash
# Try the newer syntax:
docker compose up -d --build
```

### ❌ Port 3000 already in use

```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### ❌ MongoDB connection error

Ensure `MONGODB_URI` is set to the internal Docker network hostname:

```env
# Correct (Docker internal DNS):
MONGODB_URI=mongodb://mongo:27017/loginpage

# Incorrect (won't work inside Docker):
MONGODB_URI=mongodb://localhost:27017/loginpage
```

### ❌ Jenkins can't run `docker` command

```bash
# Grant Jenkins user access to the Docker socket
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### ❌ Jenkins pipeline fails on Health Check stage

The app may need more startup time. Edit `Jenkinsfile`:

```groovy
sh 'sleep 20'  // Increase from 10s to 20s
```

### 🔍 View Docker Container Logs

```bash
# App logs
docker logs agenticai-app

# MongoDB logs
docker logs agenticai-mongo

# Follow logs in real time
docker logs -f agenticai-app
```

---

## Quick Reference

```bash
# ── Docker ──────────────────────────────────────────
docker-compose up -d --build      # Start App + Mongo
docker-compose ps                 # Verify App Status
curl http://localhost:3000/health # Verify App Health

# ── Jenkins (Docker) ────────────────────────────────
docker exec jenkins-docker cat /var/jenkins_home/secrets/initialAdminPassword

# ── Jenkins (macOS Homebrew) ─────────────────────────
brew services start jenkins-lts   # Start Jenkins
open http://localhost:8080         # Open Jenkins UI
```

---

*Generated for the ToolForge project · Last updated: April 2026*
