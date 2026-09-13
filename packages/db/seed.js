/**
 * Standalone JavaScript Seed Script for Neon Postgres + Prisma
 * Run via: node packages/db/seed.js
 */

import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"

dotenv.config({ path: "../../apps/web/.env" })
dotenv.config({ path: ".env" })

const prisma = new PrismaClient()

const SEED_JOBS = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer",
    company: "CloudPulse Labs",
    companyLogo: "CP",
    companyColor: "from-blue-600 to-indigo-600",
    location: "San Francisco, CA",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$145,000 - $185,000",
    experience: "Senior (4-7 yrs)",
    category: "Full Stack",
    tags: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    postedDate: "2 hours ago",
    featured: true,
    department: "Core Engineering",
    applicantCount: 24,
    description: "CloudPulse Labs is looking for a Senior Full Stack Engineer to lead architecture of our next-gen cloud collaboration suite.",
    responsibilities: ["Architect Next.js features", "Maintain high-throughput REST/GraphQL APIs"],
    requirements: ["4+ years experience with TS, React, Node.js", "Solid PostgreSQL experience"],
    benefits: ["Remote-first flexibility", "Competitive salary & equity"]
  },
  {
    id: "job-2",
    title: "AI Full Stack Application Engineer",
    company: "Nexus AI Systems",
    companyLogo: "NX",
    companyColor: "from-violet-600 to-purple-700",
    location: "New York, NY",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    salary: "$150,000 - $190,000",
    experience: "Mid-Senior (3-6 yrs)",
    category: "AI/ML",
    tags: ["TypeScript", "Next.js", "Python", "LangChain", "OpenAI", "Vector DB"],
    postedDate: "5 hours ago",
    featured: true,
    department: "AI Applied Products",
    applicantCount: 42,
    description: "Build interactive agentic AI workflows and generative tools.",
    responsibilities: ["Streaming agentic interfaces in Next.js", "Integrate Python LLM pipelines"],
    requirements: ["3+ years full-stack TS/Python", "LLM APIs (OpenAI/Anthropic)"],
    benefits: ["Equity in Series A", "Hybrid setup in NYC"]
  }
]

async function seed() {
  console.log("🌱 [JS] Connecting to Neon Postgres...")
  try {
    for (const job of SEED_JOBS) {
      await prisma.job.upsert({
        where: { id: job.id },
        update: job,
        create: job,
      })
    }
    console.log(`✅ [JS] Seeded sample jobs successfully.`)
  } catch (error) {
    console.error("❌ [JS] Seeding failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
