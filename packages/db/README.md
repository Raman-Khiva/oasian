# 🗄️ `@workspace/db` — Prisma ORM & Neon PostgreSQL Engine

> **Database persistence layer for Oasian, featuring Prisma ORM 6, Neon Serverless WebSocket adapters, schema models, migrations, and seed scripts.**

---

## 🚀 Overview

The `@workspace/db` package encapsulates all database access and ORM logic for the Oasian monorepo. It exports a singleton `PrismaClient` configured with optional **Neon Serverless WebSocket driver adapters** to maintain ultra-low latency and resilient connection pooling in serverless runtime environments (such as Next.js API routes).

---

## 🛠️ Environment Setup

Ensure `DATABASE_URL` is set in your `.env` file:

```env
DATABASE_URL="postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/oasian?sslmode=require"
USE_NEON_ADAPTER="true"
```

---

## 📊 Database Models

- **`User`**: Linked to Clerk Auth (`clerkId`), email, name, image.
- **`Profile`**: Candidate biography, skills, contact info, JSON experience & education timeline.
- **`Resume`**: Versioned resume records storing header info, skill tags, experience bullets, and projects.
- **`ResumeAnalysis`**: Scores (ATS, Impact, Brevity, Skills), key summary, missing elements, and LLM bullet rewrites.
- **`Job`**: Job catalog (category, workplace type, salary, responsibilities, requirements).
- **`SavedJob`**: Junction table for bookmarked jobs.
- **`JobApplication`**: Candidate job applications (`applied`, `reviewing`, `interview`, `offer`, `rejected`).

---

## 📜 Available NPM Scripts

Run commands from the monorepo root:

| Command | Action |
| :--- | :--- |
| `pnpm db:generate` | Generates Prisma Client TypeScript definitions |
| `pnpm db:push` | Pushes the Prisma schema state directly to Neon PostgreSQL |
| `pnpm db:migrate` | Runs Prisma development migrations |
| `pnpm db:seed` | Seeds database with initial jobs, dummy candidate profiles, and test resumes |
| `pnpm db:studio` | Launches Prisma Studio GUI at [http://localhost:5555](http://localhost:5555) |
