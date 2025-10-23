# 🧠 Global Agent Definition: Share-A-Book

## 🎯 Project Goal
Build a **fully local, self-contained MVP** for "Share-A-Book" — a community book-sharing platform that runs **without external APIs**.  
All data must be stored locally (SQLite), and all assets remain within the local container or filesystem.  
The MVP should allow basic CRUD operations for users, books, and borrow requests — with a modern responsive UI.

## 🌐 System Overview
The project includes:
- **Frontend:** Next.js 15 + Tailwind CSS v4 (TypeScript)
- **Backend:** Node.js + Express or Next.js API routes with Prisma ORM
- **Database:** SQLite (local file) using Prisma
- **Auth:** Local credentials (NextAuth Credentials provider)
- **Storage:** Local `/uploads` folder for book images
- **Deployment:** Dockerized single-container app (`localhost:3000`)

## 🧩 Repo Structure
```
share-a-book/
│
├── app/                  # Next.js pages and UI
├── backend/              # API routes and Prisma models
├── components/           # Reusable UI components
├── prisma/               # Schema and migration files
├── public/uploads/       # Local file storage
├── docker/               # Dockerfile and Compose setup
├── Agents.md             # (this global file)
└── README.md
```

## 🧠 Global Rules
- ❌ **No external API calls**
- ✅ Use only local DB, local assets
- ✅ Must be able to run offline
- ✅ Modular, typed, maintainable code

## 👥 Agents and Roles
| Agent | Responsibility |
|-------|----------------|
| **DevAgent** | Orchestrates creation of project, folder structure |
| **UIAgent** | Implements frontend pages |
| **DBAgent** | Designs database schema |
| **API-Agent** | Implements API routes |
| **AuthAgent** | Manages credential authentication |
| **OpsAgent** | Creates Docker setup |
| **TestAgent** | Validates e2e flow |

---

## ✅ Deliverables
- Offline CRUD web app.
- SQLite persistence.
- Docker container accessible via localhost:3000.
