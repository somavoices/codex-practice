# ⚙️ Local Agents – Backend (backend/)
## 🎯 Goal
Provide local-only API endpoints via Next.js API routes or Express.

## 👥 Local Agents
### 🧱 DBAgent
- Define Prisma schema for `User`, `Book`, `Borrow`.
- Local SQLite with migrations.
### 🧩 APIAgent
- Implement CRUD endpoints for books & borrow flow.
### 🔐 AuthAgent
- Local credential auth (NextAuth Credentials).
### 🧰 OpsAgent
- Dockerfile + docker-compose for local-only stack.

---