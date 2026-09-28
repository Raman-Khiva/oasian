# 🌐 `@workspace/web` — Next.js 16 Web Application

> **The primary full-stack web application for Oasian, featuring AI resume analysis, job discovery, Clerk authentication, and candidate application tracking.**

---

## 🚀 Overview & Key Features

The `@workspace/web` package is built on **Next.js 16 (App Router)** and **React 19**. It serves as the user-facing interface for job seekers and recruiters.

- **AI Resume Builder & Analyzer (`/resume`)**:
  - Drag-and-drop resume upload (PDF / Text parsing via `unpdf`).
  - Real-time Groq LLM scoring (`overallScore`, `atsScore`, `impactScore`, `brevityScore`, `skillsScore`).
  - Actionable side-by-side bullet rewrites with single-click apply functionality.
  - Automated 95+ ATS resume generation.
- **Job Discovery & Search (`/jobs`)**:
  - Filter jobs by category, workplace arrangement (Remote, Hybrid, On-site), and employment type.
  - Instant job saving and application submittal linked with resume snapshot versions.
- **Candidate Profile (`/profile`)**:
  - Manage contact info, technical skills, work experience timeline, and education details.
  - Synchronize candidate profile directly with active resume models.
- **Clerk Authentication (`/sign-in`, `/sign-up`, `/api/webhooks/clerk`)**:
  - User sign-in/sign-up flows.
  - Svix-verified webhook handler syncing Clerk user lifecycle with Neon PostgreSQL.

---

## 📁 Directory Structure

```
apps/web/
├── app/
│   ├── api/
│   │   ├── resume/
│   │   │   ├── parse/route.ts      # PDF / Text extraction endpoint (unpdf + Groq)
│   │   │   ├── analyze/route.ts    # Groq LLM ATS scoring endpoint
│   │   │   └── optimize/route.ts   # 95+ ATS resume optimization endpoint
│   │   └── webhooks/
│   │       └── clerk/route.ts      # Svix Webhook receiver for Clerk user sync
│   ├── jobs/                       # Job listing and details pages
│   ├── resume/                     # Interactive resume dashboard
│   ├── profile/                    # Profile management page
│   ├── sign-in/                    # Clerk sign-in route
│   └── sign-up/                    # Clerk sign-up route
├── components/                     # Feature UI components (Job cards, Resume score widgets)
├── hooks/                          # Custom React hooks
└── lib/                            # Groq AI client, ATS algorithms, and data types
```

---

## 🛠️ API Routes Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/resume/parse` | `POST` | Extracts raw PDF / text content into typed `ResumeData` via Groq |
| `/api/resume/analyze` | `POST` | Runs ATS breakdown & bullet point rewrite recommendations |
| `/api/resume/optimize` | `POST` | Generates a 95+ ATS target resume version |
| `/api/webhooks/clerk` | `POST` | Receives Svix-signed Clerk user lifecycle events (`user.created`, `user.updated`, `user.deleted`) |

---

## 🏃 Local Development

Run from the root of the monorepo:

```bash
# Start web app dev server
pnpm --filter web dev
```

Or run `pnpm dev` from the workspace root to start all monorepo dependencies.
