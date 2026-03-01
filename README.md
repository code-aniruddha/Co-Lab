<div align="center">

# 🤝 Co-Lab

### *Collaborative Project Platform for Students & Developers*

**Co-Lab** is a dynamic platform connecting students to discover projects, form teams, and collaborate on startups, hackathons, and research initiatives.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.183-black.svg)](https://threejs.org/)

[Live Demo](#) • [Report Bug](https://github.com/code-aniruddha/Co-Lab/issues) • [Request Feature](https://github.com/code-aniruddha/Co-Lab/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 Project Overview](#-project-overview)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Project Structure](#️-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone & Install](#clone--install)
  - [Environment Variables](#environment-variables)
  - [Supabase Setup](#supabase-setup)
  - [Run the App](#run-the-app)
- [👥 Demo Accounts](#-demo-accounts)
- [📄 Pages & Routes](#-pages--routes)
- [🔌 API Reference](#-api-reference)
- [🎨 Key Components](#-key-components)
- [🗄️ Database Schema](#️-database-schema)
- [🚢 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [🐛 Troubleshooting](#-troubleshooting)
- [📝 License](#-license)

---

## ✨ Features

### Core Functionality
- **🔍 Project Discovery** — Browse open student projects filtered by domain (Startup, Hackathon, Research) and required skills
- **👥 Hackathon Teams** — Find and join active hackathon teams or create your own squad
- **🔐 Authentication** — Secure email/password sign-up via Supabase Auth with demo accounts for testing
- **📝 Project Applications** — Apply to join projects with custom messages; owners can track and manage applicants
- **⚡ Real-time Updates** — Supabase Realtime subscriptions for instant project and application updates
- **🎯 Skill-Based Matching** — Smart filtering to connect projects with the right talent

### Visual Experience
- **🎨 3D Interactive Background** — Full-viewport Three.js canvas featuring:
  - Particle network system with orbital rings
  - 1,200 animated grass blades that react to mouse movement
  - Rendered seamlessly across all pages
- **💎 Grass-Morph UI** — Every card gently sways with phase-staggered CSS animations
- **🪟 Glass-Morphism Design** — Translucent glass backgrounds that showcase the 3D scene
- **🎯 Smooth Scrolling** — Lenis scroll integration for buttery-smooth navigation
- **📱 Responsive Design** — Optimized for mobile through 4K displays using Tailwind CSS v4

---

## 🎯 Project Overview

Co-Lab bridges the gap between students with innovative ideas and talented developers ready to build. The platform facilitates:

- **Project Posting**: Share your startup idea, research project, or hackathon concept
- **Team Formation**: Recruit team members with specific skill sets
- **Collaboration**: Connect with like-minded peers and start building together
- **Community Building**: Join active hackathon teams and participate in ongoing projects

Whether you're looking to validate a startup idea, need a team for an upcoming hackathon, or want to collaborate on cutting-edge research, Co-Lab is your gateway to meaningful collaboration.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 19.2 |
| **Vite** | Build Tool & Dev Server | 7.3 |
| **Tailwind CSS** | Styling Framework | v4.2 |
| **Three.js** | 3D Graphics | 0.183 |
| **@react-three/fiber** | React Renderer for Three.js | 9.5 |
| **@react-three/drei** | Three.js Helpers | 10.7 |
| **Framer Motion** | Animations | 12.34 |
| **Lenis** | Smooth Scrolling | 1.3 |
| **React Router DOM** | Client-side Routing | 7.13 |
| **Lucide React** | Icon Library | 0.575 |

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | ≥18 |
| **Express** | API Server | 5.2 |
| **Supabase** | Database & Auth | 2.97 |
| **PostgreSQL** | Relational Database | (via Supabase) |
| **Axios** | HTTP Client | 1.13 |
| **CORS** | Cross-Origin Resource Sharing | 2.8 |

### Development Tools
- **ESLint** — Code linting and standards
- **Dotenv** — Environment variable management
- **Git** — Version control

---

## 🏗️ Project Structure

```
co-lab/
├── 📁 frontend/
│   ├── 📁 public/
│   └── 📁 src/
│       ├── 📁 assets/               # SVG logo and static assets
│       ├── 📁 components/
│       │   ├── ⚛️ Background3D.jsx   # Fixed 3D canvas (particles, rings, grass)
│       │   ├── ⚛️ AuthModal.jsx      # Login / Sign-up modal
│       │   ├── ⚛️ Hero.jsx           # Landing hero section
│       │   ├── ⚛️ Navbar.jsx         # Navigation bar
│       │   ├── ⚛️ Footer.jsx         # Footer component
│       │   ├── ⚛️ Logo.jsx           # Animated logo
│       │   ├── ⚛️ PageLoader.jsx     # Loading screen
│       │   ├── ⚛️ ProjectFeed.jsx    # Project listing component
│       │   └── ⚛️ PostProjectForm.jsx # Create project form
│       ├── 📁 context/
│       │   └── ⚛️ AuthContext.jsx    # Global auth state + loginDemo()
│       ├── 📁 lib/
│       │   ├── 📄 mockData.js        # Demo users, mock projects, teams
│       │   └── 📄 supabaseClient.js  # Supabase configuration
│       ├── 📁 pages/
│       │   ├── ⚛️ HomePage.jsx       # Landing page
│       │   ├── ⚛️ DiscoverPage.jsx   # Project discovery
│       │   ├── ⚛️ CommunityPage.jsx  # Community & teams
│       │   └── ⚛️ ProfilePage.jsx    # User profile
│       ├── ⚛️ App.jsx                # Main app component
│       ├── 🎨 index.css             # Global styles + animations
│       └── ⚛️ main.jsx               # React entry point
├── 📁 backend/
│   ├── 🚀 server.js              # Express API server
│   ├── 🗄️ supabase_schema.sql    # Database schema + seed data
│   ├── 📄 .env.example           # Environment template
│   └── 📦 package.json           # Backend dependencies
├── ⚙️ vite.config.js
├── 📦 package.json
└── 📖 README.md
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** version 18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- A free [Supabase](https://supabase.com) account (optional for demo mode)
- **Git** for version control

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/code-aniruddha/Co-Lab.git

# Navigate to project directory
cd Co-Lab

# Install root and frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Environment Variables

Create environment files for both frontend and backend:

#### **Frontend Environment** (`frontend/.env`)

```bash
# Copy the example file
cp frontend/.env.example frontend/.env
```

Then edit `frontend/.env`:

```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### **Backend Environment** (`backend/.env`)

```bash
# Copy the example file
cp backend/.env.example backend/.env
```

Then edit `backend/.env`:

```dotenv
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
PORT=3001
```

> **💡 Demo Mode**: If Supabase credentials are omitted, the frontend automatically falls back to 12 mock projects and 4 demo accounts — no database connection required. Perfect for testing and development!

### Supabase Setup

1. **Create a Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for the database to initialize (usually takes 1-2 minutes)

2. **Get Your Credentials**
   - Navigate to **Project Settings** → **API**
   - Copy your **Project URL** and **anon/public key**
   - Paste them into your `.env` files

3. **Run the Database Schema**
   - Open **SQL Editor** in your Supabase dashboard
   - Copy the entire contents of `backend/supabase_schema.sql`
   - Paste and execute the script

   The script will:
   - ✅ Create 4 tables: `projects`, `applications`, `hackathon_teams`, `team_members`
   - ✅ Set up Row Level Security policies
   - ✅ Configure Realtime publications
   - ✅ Seed 12 sample projects and 4 hackathon teams
   - ✅ Safely handle re-runs (fully idempotent)

### Run the App

#### Development Mode (Recommended)

Run frontend and backend simultaneously in separate terminals:

```bash
# Terminal 1 — Frontend (Vite dev server)
npm run dev
# → Opens at http://localhost:5173

# Terminal 2 — Backend (Express API server)
npm run server:dev
# → Runs at http://localhost:3001
```

#### Production Build

```bash
# Build the frontend for production
npm run build

# Preview the production build locally
npm run preview

# Run backend in production mode
npm run server
```

The built files will be in the `dist/` directory, ready for deployment.

---

## 👥 Demo Accounts

Four pre-built demo accounts are available for testing without Supabase setup. All accounts share the same password for convenience.

| Name | Email | Expertise | Projects |
|------|-------|-----------|----------|
| **Alex Chen** | `alex@demo.co` | Full-Stack Development | React, Node.js, Python, OpenAI |
| **Priya Sharma** | `priya@demo.co` | Mobile & AR Development | React Native, ARKit, Node.js |
| **Marcus Johnson** | `marcus@demo.co` | Blockchain Development | Solidity, Web3, React, IPFS |
| **Sofia Rodriguez** | `sofia@demo.co` | ML & Data Science | Python, TensorFlow, FastAPI |

**🔑 Universal Password**: `demo1234`

> **Note**: Demo accounts are detected client-side and bypass Supabase entirely — perfect for offline testing, presentations, or development without credentials.

---

## 📄 Pages & Routes

| Route | Page | Description | Key Features |
|-------|------|-------------|--------------|
| `/` | **Home** | Landing page with hero section | Featured projects, stats showcase, how-it-works section |
| `/discover` | **Discover** | Browse all projects | Domain filters, skill-based search, real-time updates |
| `/community` | **Community** | Team collaboration hub | Active members, hackathon teams, learning resources |
| `/profile` | **Profile** | User dashboard | Your projects, applications, team memberships |

---

## 🔌 API Reference

**Base URL**: `http://localhost:3001`

### Health Check

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `GET` | `/api/health` | Server health status | `{ status: "ok", timestamp: "..." }` |

### Projects Endpoints

#### Get All Projects
```http
GET /api/projects?domain={domain}&skill={skill}
```

**Query Parameters**:
- `domain` (optional): Filter by `Startup`, `Hackathon`, or `Research`
- `skill` (optional): Filter by required skill (e.g., `React`, `Python`)

**Response**:
```json
[
  {
    "id": "uuid",
    "title": "AI-Powered Study Buddy",
    "description": "Build an LLM-based tool...",
    "domain": "Startup",
    "skills_list": ["Python", "React", "OpenAI"],
    "owner_id": "user_001",
    "owner_name": "Aryan Mehta",
    "status": "open",
    "interest_count": 7,
    "created_at": "2026-03-01T10:00:00Z"
  }
]
```

#### Get Single Project
```http
GET /api/projects/:id
```

**Response**: Project object with nested applications array

#### Create Project
```http
POST /api/projects
```

**Request Body**:
```json
{
  "title": "Project Title",
  "description": "Project description",
  "domain": "Startup",
  "skills_list": ["React", "Node.js"],
  "owner_id": "user_id",
  "owner_name": "Your Name"
}
```

#### Update Project Status
```http
PATCH /api/projects/:id/status
```

**Request Body**:
```json
{
  "status": "open" // or "filled"
}
```

### Applications Endpoints

#### Submit Application
```http
POST /api/applications
```

**Request Body**:
```json
{
  "project_id": "uuid",
  "applicant_name": "Your Name",
  "applicant_skills": ["React", "Node.js"],
  "message": "Why you want to join"
}
```

**Effect**: Automatically increments the project's `interest_count`

#### Get Project Applications
```http
GET /api/applications/:projectId
```

**Response**: Array of application objects for the specified project

### Hackathon Teams Endpoints

#### Get All Teams
```http
GET /api/teams
```

#### Get Team Details
```http
GET /api/teams/:id
```

**Response**: Team object with nested members array

---

---

## 🎨 Key Components

### Background3D
The immersive 3D environment powered by Three.js that runs on every page:
- **Particle Network**: 200+ interconnected particles creating a dynamic mesh
- **Orbital Rings**: Multiple rotating rings for depth
- **Animated Grass**: 1,200 individual grass blades with physics-based motion
- **Mouse Interaction**: Elements react to cursor movement

### AuthContext
Global authentication state management:
- Supabase Auth integration
- Demo account detection and handling
- Session persistence
- User profile management

### ProjectFeed
Dynamic project listing component:
- Real-time updates via Supabase subscriptions
- Advanced filtering (domain, skills, status)
- Smooth animations on load
- Card hover effects

### PostProjectForm
Comprehensive form for creating new projects:
- Multi-step validation
- Skill tag management
- Domain selection
- Real-time character counters

---

## 🗄️ Database Schema

### Tables

#### **projects**
```sql
id              UUID PRIMARY KEY
created_at      TIMESTAMPTZ
title           TEXT NOT NULL
description     TEXT
domain          TEXT ('Startup' | 'Hackathon' | 'Research')
skills_list     TEXT[]
owner_id        TEXT NOT NULL
owner_name      TEXT NOT NULL
status          TEXT ('open' | 'filled')
interest_count  INTEGER DEFAULT 0
```

#### **applications**
```sql
id               UUID PRIMARY KEY
created_at       TIMESTAMPTZ
project_id       UUID (FK → projects.id)
applicant_name   TEXT NOT NULL
applicant_skills TEXT[]
message          TEXT
status           TEXT ('pending' | 'accepted' | 'rejected')
```

#### **hackathon_teams**
```sql
id            UUID PRIMARY KEY
created_at    TIMESTAMPTZ
name          TEXT NOT NULL
hackathon     TEXT NOT NULL
project_title TEXT NOT NULL
status        TEXT ('forming' | 'active' | 'closed')
slots_total   INTEGER DEFAULT 4
slots_filled  INTEGER DEFAULT 0
looking_for   TEXT[]
tech_stack    TEXT[]
owner_id      TEXT NOT NULL
```

#### **team_members**
```sql
id         UUID PRIMARY KEY
team_id    UUID (FK → hackathon_teams.id)
user_name  TEXT NOT NULL
user_email TEXT
role       TEXT NOT NULL
avatar     TEXT
```

### Security
- **Row Level Security (RLS)** enabled on all tables
- Public read/insert/update policies for demo purposes
- Production deployments should implement user-based policies

---

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment Variables (set in Vercel dashboard)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

#### Netlify
```bash
# Build command
npm run build

# Publish directory
dist

# Environment Variables (set in Netlify dashboard)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### Backend Deployment

#### Railway/Render
1. Connect your GitHub repository
2. Set environment variables:
   ```
   SUPABASE_URL=your_url
   SUPABASE_ANON_KEY=your_key
   PORT=3001
   ```
3. Set start command: `node backend/server.js`

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
EXPOSE 3001
CMD ["node", "server.js"]
```

---

## 🤝 Contributing

We love contributions! Here's how you can help:

### Development Workflow

1. **Fork the Repository**
   ```bash
   # Fork via GitHub UI, then:
   git clone https://github.com/YOUR_USERNAME/Co-Lab.git
   cd Co-Lab
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feat/amazing-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly

4. **Commit with Conventional Commits**
   ```bash
   git commit -m "feat: add project search functionality"
   git commit -m "fix: resolve authentication bug"
   git commit -m "docs: update API documentation"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feat/amazing-feature
   ```
   Then open a Pull Request on GitHub

### Contribution Guidelines

- ✅ Keep PRs focused — one feature or fix per PR
- ✅ Update documentation for new features
- ✅ Test on different screen sizes
- ✅ Follow the existing code structure
- ✅ Be respectful and constructive in reviews

### Areas to Contribute

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage
- ♿ Accessibility improvements
- 🌍 Internationalization

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# MacOS/Linux
lsof -ti:5173 | xargs kill -9
```

#### Supabase Connection Failed
- ✅ Verify your `.env` file has correct credentials
- ✅ Check if Supabase project is active
- ✅ Ensure you've run the schema SQL script
- ✅ Try demo mode by removing Supabase credentials

#### Build Errors
```bash
# Clear node_modules and cache
rm -rf node_modules frontend/node_modules backend/node_modules
rm -rf package-lock.json frontend/package-lock.json backend/package-lock.json

# Reinstall
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

#### 3D Background Not Rendering
- ✅ Check browser console for WebGL errors
- ✅ Update graphics drivers
- ✅ Try a different browser (Chrome/Edge recommended)
- ✅ Disable browser hardware acceleration as test

### Getting Help

- 📧 **Issues**: [GitHub Issues](https://github.com/code-aniruddha/Co-Lab/issues)
- 💬 **Questions**: Open a discussion on GitHub
- 📖 **Documentation**: Check this README first

---

## 📝 License

MIT © 2025 [Aniruddha](https://github.com/code-aniruddha)

```
MIT License

Copyright (c) 2025 Aniruddha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

### 🌟 Star this repo if you find it useful!

Made with ❤️ by [Aniruddha](https://github.com/code-aniruddha)

[⬆ Back to Top](#-co-lab)

</div>
