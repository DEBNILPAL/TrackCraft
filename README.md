# TrackCraft - Full-Stack Team Project & Hackathon Progress Tracker

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://netlify.com)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

**TrackCraft** is a complete, production-quality full-stack Project Progress Tracker web application tailored for student developer teams and hackathon competitors. It provides a centralized collaboration platform to track daily role completion percentages, password-protected team access, real-time team chat, meeting scheduling, architecture diagram uploads, and external reference links.

---

## 🌟 Key Features

* **Landing Page**: Modern SaaS aesthetic inspired by futuristic glassmorphic design guidelines, featuring interactive hero mockups, feature cards, and workflow step breakdowns.
* **Authentication System**: Secure user signup, JWT-based login session retention, bcrypt password hashing, and user profile management.
* **Protected Projects & Password Access**: Public project directory with password-protected entry. Users enter the project password once to gain permanent membership recorded in persistent JSON storage.
* **Role-Based & Daily Progress Tracking**: Teammates select developer roles (*Frontend, Backend, ML, AI, DevOps, UI/UX, Database, etc.*) and submit daily progress logs (percentage, completed tasks, blockers, next steps).
* **Interactive Visualizations**: Circular project progress gauge, Recharts role-based completion bar charts, and derived project health indicators (*Healthy, At Risk, Critical*).
* **Hackathon Deadline Countdown**: Dedicated hackathon timer displaying days, hours, minutes, and seconds remaining until submission.
* **Real-time & Polling Team Chat**: Restricted project team chat built with Socket.IO real-time delivery and fallback HTTP polling.
* **Google Meet & Zoom Scheduler**: Schedule team syncs with URL validation, upcoming/past meeting lists, and 1-click meeting join buttons.
* **Docs & Architecture Gallery**: Upload project manuals (PDFs, docs) and preview high-resolution architecture diagrams in visual galleries.
* **Reference Links Manager**: Repository for external APIs, GitHub repos, dataset links, and documentation categorized for easy team access.
* **JSON Atomic Storage Engine**: File-locking, atomic temp-write filesystem storage layer in `backend/data/`.

---

## 🏗️ System Architecture

```text
  [ User Browser / Mobile ]
             │
   (HTTPS / WebSockets)
             │
             ▼
┌─────────────────────────┐
│     Netlify Frontend    │  (React 18 + Vite + TypeScript + Tailwind)
└────────────┬────────────┘
             │  REST API & Socket.IO
             ▼
┌─────────────────────────┐
│      Render Backend     │  (Express.js + TypeScript + JWT + Multer + Socket.IO)
└────────────┬────────────┘
             │  Repository Pattern / Lock Guards
             ▼
┌─────────────────────────┐
│   JSON Atomic Storage   │  (users.json, projects.json, memberships.json, progress.json...)
└─────────────────────────┘
```

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React Icons, Recharts, Axios, Socket.IO Client.
* **Backend**: Node.js, Express, TypeScript, JWT (JSON Web Tokens), bcryptjs, Multer (File Uploads), Socket.IO.
* **Storage**: Atomic JSON Filesystem Repository Engine (`backend/data/`).
* **Deployment**: Netlify (`frontend/netlify.toml`) & Render (`backend/render.yaml`).

---

## 🚀 Quick Local Setup

### Prerequisites
* Node.js v18+ and npm installed.

### 1. Clone Repository & Setup Backend

```bash
cd backend
npm install
npm run seed     # Populate initial demo data
npm run dev      # Server starts on http://localhost:5000
```

### 2. Setup Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev      # Vite dev server starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Login Accounts

* **Project Owner**: `debnil@example.com` / `password123`
* **Backend Dev**: `rahul@example.com` / `password123`
* **ML Dev**: `ananya@example.com` / `password123`
* **Project Password for "Smart AI Assistant Hub"**: `hackathon2026`

---

## 📡 API Endpoint Reference

### Authentication
* `POST /api/auth/signup` - Register a new user
* `POST /api/auth/login` - Authenticate and receive JWT token
* `GET  /api/auth/me` - Fetch authenticated user profile
* `PUT  /api/auth/profile` - Update profile info
* `PUT  /api/auth/password` - Change account password

### Projects & Access Control
* `GET  /api/projects` - Get public project list (with membership flags)
* `POST /api/projects` - Create a new project (hashed project password)
* `POST /api/projects/:id/join` - Verify project password & create permanent membership
* `GET  /api/projects/:id` - Get project details *(Requires Membership)*
* `GET  /api/projects/:id/members` - List project members & roles

### Daily Progress & Analytics
* `GET  /api/projects/:id/progress` - Fetch progress history, role breakdown, and health summary
* `POST /api/projects/:id/progress` - Submit daily role progress update

### Chat & Collaboration
* `GET  /api/projects/:id/messages` - Fetch project chat messages *(Requires Membership)*
* `POST /api/projects/:id/messages` - Post chat message

### Meetings & Uploads
* `GET  /api/projects/:id/meetings` - Fetch upcoming & past meetings
* `POST /api/projects/:id/meetings` - Schedule Google Meet / Zoom sync
* `GET  /api/projects/:id/documents` - Fetch project docs & architecture diagrams
* `POST /api/projects/:id/documents` - Upload document metadata & diagrams
* `GET  /api/projects/:id/links` - Fetch external reference links

---

## 🌐 Deployment Instructions

### Deploying Frontend to Netlify
1. Connect your repository to **Netlify**.
2. Set Build Command: `npm run build` inside `frontend`.
3. Set Publish Directory: `dist`.
4. Add Environment Variable:
   ```env
   VITE_API_BASE_URL=https://YOUR-BACKEND.onrender.com/api
   VITE_SOCKET_URL=https://YOUR-BACKEND.onrender.com
   ```
5. `frontend/netlify.toml` handles SPA routing redirects automatically.

### Deploying Backend to Render
1. Create a new **Web Service** on **Render**.
2. Set Build Command: `npm install && npm run build` inside `backend`.
3. Set Start Command: `npm start`.
4. Add Environment Variables:
   ```env
   NODE_ENV=production
   JWT_SECRET=your_32_character_random_secret
   FRONTEND_URL=https://YOUR-FRONTEND.netlify.app
   ```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
