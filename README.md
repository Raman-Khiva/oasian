# 🚀 Oasian — AI-Powered Monorepo Career Platform & Resume Engine

> **A modern, full-stack monorepo application connecting tech talent with AI-driven resume scoring, job discovery, and automated career tracking.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.9.18-EF4444?style=flat-square&logo=turborepo)](https://turbo.build/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Neon Postgres](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Groq AI](https://img.shields.io/badge/Groq-AI_LLM-FF6B00?style=flat-square)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## 🌟 Live Demo & Media

- 🔗 **Live Web Application**: [https://[YOUR_LIVE_DEMO_URL]](https://[YOUR_LIVE_DEMO_URL]) *(Placeholder: Replace with deployed URL)*
- 🎬 **Video Walkthrough / Loom**: [Watch 2-Min Demo Video](https://[YOUR_DEMO_VIDEO_URL]) *(Placeholder: Replace with your Loom/YouTube link)*

```
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                           [ INSERT SCREENSHOT / GIF HERE ]                        |
|                         Oasian Dashboard & AI Resume Analyzer                     |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 📖 Executive Summary

**Oasian** is a full-stack monorepo application engineered to empower job seekers with AI-assisted resume optimization, smart ATS matching, and comprehensive application tracking.

Built with Next.js 16 (App Router), React 19, TypeScript, and Turborepo, the platform leverages **Groq's high-throughput LLM inference** (`openai/gpt-oss-120b`) for instant resume parsing, ATS scoring, and bullet-point rewrites. Data persistence is powered by **Neon PostgreSQL** via Prisma ORM with WebSocket adapter support, and authentication is handled by **Clerk** with automated real-time database synchronization via Webhooks.

---

## ✨ Key Features

### 🤖 1. AI Resume Extraction & Optimization Engine
- **PDF & Text Parsing**: Upload resumes (PDF or raw text) via `unpdf` and Groq AI for instant structured extraction (skills, experience, education, projects).
- **ATS Compatibility Scoring**: Generates live scores (0–100) across ATS Parsability, Quantifiable Impact, Brevity, and Skill Keywords.
- **LLM-Powered Bullet Rewrites**: Provides actionable side-by-side "Before & After" bullet improvements using strong power verbs and quantified impact metrics.
- **Automated AI Optimization**: One-click generation of 95+ ATS target resume versions saved directly to the database.

### 💼 2. Job Discovery & Career Matching
- **Smart Catalog**: Filter jobs by Category (Full Stack, AI/ML, Frontend, DevOps), Workplace Type (Remote, Hybrid, On-site), and Job Type.
- **Automated Resume Matching**: Matches uploaded candidate resumes to relevant open positions in real-time.
- **Bookmarks & Applications**: Save jobs and track application status (`applied`, `reviewing`, `interview`, `offer`, `rejected`).

### 🔒 3. Authentication & Profile Sync
- **Clerk Auth Integration**: Secure passwordless, social, and MFA authentication.
- **Real-Time Webhook Sync**: Uses Svix signatures to sync Clerk user lifecycle events (`user.created`, `user.updated`, `user.deleted`) directly with Neon PostgreSQL.
- **Unified Candidate Profile**: Syncs candidate experience and education across resumes and user profiles.

### 🏗️ 4. Enterprise Turborepo Architecture
- **High-Efficiency Monorepo**: Workspace package sharing across web apps, UI design system, database schemas, and shared TypeScript/ESLint configs.
- **Type-Safe Ecosystem**: End-to-end type safety from Prisma schema models to React components and Next.js Server Actions / API routes.

---

## 📐 Architecture & Monorepo Structure

```
oasian/
├── apps/
│   ├── web/                    # Main Next.js 16 App Router Web Application
│   │   ├── app/                # Next.js Pages, Routes & API Endpoints
│   │   │   ├── api/            # Serverless API Routes (Resume Parse, Optimize, Webhooks)
│   │   │   ├── jobs/           # Job Search & Filtering Pages
│   │   │   ├── resume/         # AI Resume Builder & Analyzer UI
│   │   │   ├── profile/        # Candidate Profile Management
│   │   │   ├── sign-in/        # Clerk Authentication Routes
│   │   │   └── sign-up/
│   │   ├── lib/                # Groq AI Client, ATS Analyzer Logic & Types
│   │   └── components/         # Page Layouts, Hero, Job Cards, Resume Widgets
│   │
│   └── base/                   # Starter Next.js app template for expansion
│
├── packages/
│   ├── db/                     # Prisma ORM, Neon PostgreSQL Adapter & DB Seed
│   │   ├── prisma/
│   │   │   └── schema.prisma   # PostgreSQL Models (User, Profile, Resume, Job, etc.)
│   │   └── src/
│   │       ├── client.ts       # Neon WebSocket Prisma Client
│   │       └── seed.ts         # Database seed script for dummy jobs & candidates
│   │
│   ├── ui/                     # Shared Design System (shadcn/ui + Tailwind v4)
│   ├── typescript-config/      # Workspace TypeScript Configurations
│   └── eslint-config/          # Shared ESLint Rules
│
├── turbo.json                  # Turborepo Build & Pipeline Configuration
├── pnpm-workspace.yaml         # Monorepo Workspace Package Map
└── package.json                # Monorepo Root Script Runner
```

---

## 🛠️ Tech Stack & Tools

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | Full-stack server/client rendering & API routes |
| **Language** | TypeScript | Strictly typed codebase across all packages |
| **Monorepo** | Turborepo + pnpm | Fast parallel task execution and caching |
| **UI & Styling** | Tailwind CSS v4 + Lucide Icons | Responsive modern styling & icons |
| **Design System** | shadcn/ui (`packages/ui`) | Accessible, reusable UI components |
| **Authentication** | Clerk Auth + Svix | Authentication & Webhook signature verification |
| **Database** | Neon Serverless PostgreSQL | Cloud PostgreSQL with WebSocket connection adapter |
| **ORM** | Prisma ORM 6 | Type-safe database queries & migration management |
| **AI Inference** | Groq SDK (`openai/gpt-oss-120b`) | Ultra-fast LLM inference for resume parsing & scoring |
| **PDF Extraction** | `unpdf` | Client & server PDF text parsing |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **pnpm**: `v10.0.0` or higher (`npm i -g pnpm`)
- **Neon PostgreSQL Account**: Free tier at [neon.tech](https://neon.tech)
- **Clerk Account**: Free account at [clerk.com](https://clerk.com)
- **Groq API Key**: Free API key at [console.groq.com](https://console.groq.com)

### 1. Clone the Repository
```bash
git clone https://github.com/[YOUR_GITHUB_USERNAME]/oasian.git
cd oasian
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env` in the root directory and update your API credentials:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/oasian?sslmode=require"
USE_NEON_ADAPTER="true"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxx"
CLERK_WEBHOOK_SECRET="whsec_xxxxxxxx"

GROQ_API_KEY="gsk_xxxxxxxx"
GROQ_RESUME_MODEL="openai/gpt-oss-120b"
```

### 4. Database Initialization & Seeding
Generate Prisma Client models and push the database schema to your Neon PostgreSQL instance:

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed initial job postings and demo data
pnpm db:seed
```

### 5. Run Local Development Server
Start all apps and packages in development mode using Turborepo:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Monorepo Command Reference

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts Next.js web application and workspace packages in dev mode |
| `pnpm build` | Builds all applications and packages for production |
| `pnpm lint` | Runs ESLint across all workspaces |
| `pnpm typecheck` | Runs TypeScript validation across all workspaces |
| `pnpm format` | Formats codebase using Prettier |
| `pnpm db:generate` | Generates Prisma Client artifacts in `packages/db` |
| `pnpm db:push` | Pushes Prisma schema updates directly to PostgreSQL DB |
| `pnpm db:migrate` | Runs database migrations |
| `pnpm db:seed` | Seeds database with initial job listings and test data |
| `pnpm db:studio` | Opens Prisma Studio GUI to inspect database records |

---

## 🗺️ Engineering & Architecture Deep Dive

For detailed technical design explanations, database ERD representations, Clerk webhook flowcharts, and Groq prompt engineering specifications, please refer to:

👉 **[Read the Full Architecture Documentation (ARCHITECTURE.md)](ARCHITECTURE.md)**

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

---

## 👤 Author & Contact

**[YOUR_NAME]**
- 🌐 **Portfolio**:  *ramansingh.me*
- 💼 **LinkedIn**: www.linkedin.com/in/ramandeep-singh-503077200
- 📧 **Email**: ramandeep01167@gmail.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
