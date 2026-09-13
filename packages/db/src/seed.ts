import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const SEED_JOBS = [
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
    description: "CloudPulse Labs is looking for a Senior Full Stack Engineer to lead the architecture and implementation of our next-generation cloud collaboration suite. You will own high-traffic React/Next.js client applications and resilient Node.js microservices processing millions of daily events.",
    responsibilities: [
      "Architect and ship scalable frontend features using Next.js App Router, React 19, and Tailwind CSS",
      "Design and maintain high-throughput REST and GraphQL APIs backed by PostgreSQL and Redis",
      "Mentor mid-level and junior engineers through code reviews and architecture design docs",
      "Collaborate with product managers and designers to rapidly iterate on customer feedback"
    ],
    requirements: [
      "4+ years of production experience with TypeScript, React, and Node.js",
      "Strong understanding of modern web performance, caching strategies, and SSR/SSG patterns",
      "Proven track record working with relational databases (PostgreSQL/MySQL) and ORMs",
      "Experience with cloud infrastructure (AWS/GCP, Docker, CI/CD pipelines)"
    ],
    benefits: [
      "Competitive salary & equity packages",
      "100% remote-first flexibility with home office stipend",
      "Comprehensive medical, dental, and vision health plans",
      "$2,500 annual personal learning and conference budget"
    ]
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
    description: "Join Nexus AI Systems to build interactive, agentic AI workflows and generative tools used by Fortune 500 enterprise teams. You'll bridge frontend user experiences with cutting-edge LLM pipelines, vector databases, and real-time streaming interfaces.",
    responsibilities: [
      "Build real-time, streaming agentic interfaces using Next.js, Server-Sent Events, and WebSockets",
      "Integrate Python/FastAPI LLM pipelines with Node/TypeScript microservices",
      "Implement prompt evaluation, retrieval-augmented generation (RAG), and hybrid vector search",
      "Ensure low-latency responses and high reliability across complex agent orchestration chains"
    ],
    requirements: [
      "3+ years in full-stack engineering with proficiency in TypeScript and Python",
      "Hands-on experience building apps utilizing LLM APIs (OpenAI, Anthropic) or frameworks like LangChain/LlamaIndex",
      "Understanding of vector databases (Pinecone, pgvector, Qdrant)",
      "Strong intuition for clean, intuitive UI/UX for complex agent interactions"
    ],
    benefits: [
      "Generous equity stake in a fast-scaling Series A company",
      "Hybrid setup (2 days in NYC Soho office, 3 days remote)",
      "Unlimited paid time off and quarterly wellness stipends",
      "Latest M3 Max MacBook Pro + top-tier ergonomic workspace setup"
    ]
  },
  {
    id: "job-3",
    title: "Lead Frontend Architect",
    company: "HyperScale Tech",
    companyLogo: "HS",
    companyColor: "from-cyan-600 to-blue-600",
    location: "Seattle, WA",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$160,000 - $195,000",
    experience: "Lead / Staff (5+ yrs)",
    category: "Frontend",
    tags: ["React 19", "Next.js", "Tailwind CSS", "Turborepo", "Web Performance"],
    postedDate: "1 day ago",
    featured: false,
    department: "Platform UI",
    applicantCount: 19,
    description: "HyperScale Tech is searching for a visionary Lead Frontend Architect to establish company-wide design systems, front-end build pipelines, and standards for a suite of enterprise analytics dashboards.",
    responsibilities: [
      "Architect a cohesive multi-package monorepo design system utilizing Tailwind CSS and React Server Components",
      "Improve Core Web Vitals across mission-critical web applications to sub-second load times",
      "Drive adoption of modern frontend practices, accessibility (a11y) standards, and automated visual regression testing",
      "Lead engineering guild discussions, technical RFCs, and mentor frontend developers across 4 squads"
    ],
    requirements: [
      "6+ years building sophisticated web applications with modern React ecosystems",
      "Deep expertise in Turborepo/Nx, pnpm workspaces, and modern bundler optimization (Turbopack, Vite)",
      "Strong commitment to high-fidelity UI design, typography, micro-interactions, and accessibility",
      "Demonstrated experience architecting enterprise UI component libraries from zero to production"
    ],
    benefits: [
      "Top-of-market compensation with semi-annual performance bonuses",
      "Fully remote anywhere in North America",
      "Flexible schedule with asynchronous core communication",
      "Annual team retreat in exotic international destinations"
    ]
  },
  {
    id: "job-4",
    title: "Backend Platform Engineer",
    company: "DataVortex Networks",
    companyLogo: "DV",
    companyColor: "from-emerald-600 to-teal-700",
    location: "Austin, TX",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$140,000 - $175,000",
    experience: "Mid-Senior (3-6 yrs)",
    category: "Backend",
    tags: ["Node.js", "Go", "PostgreSQL", "Kafka", "Docker", "Kubernetes"],
    postedDate: "1 day ago",
    featured: false,
    department: "Data Infrastructure",
    applicantCount: 31,
    description: "DataVortex Networks powers enterprise telemetry ingestion for fintech and healthcare leaders. As a Backend Platform Engineer, you will build data pipelines capable of ingesting over 500,000 records per second with 99.999% uptime guarantees.",
    responsibilities: [
      "Design fault-tolerant distributed services using Go and Node.js",
      "Optimize PostgreSQL query patterns, write custom indexing schemes, and manage sharded database clusters",
      "Architect event streaming pipelines via Apache Kafka and Redis pub/sub",
      "Build automated CI/CD and deployment workflows on Kubernetes (EKS)"
    ],
    requirements: [
      "3+ years of backend engineering experience with strong proficiency in Node.js or Go",
      "Advanced knowledge of relational databases, query tuning, and schema migration strategies",
      "Experience with message brokers (Kafka, RabbitMQ, SQS) and caching layers (Redis)",
      "Familiarity with container orchestration (Kubernetes, Terraform)"
    ],
    benefits: [
      "Comprehensive healthcare with 100% employer-covered premiums",
      "401(k) matching up to 5%",
      "Generous parental leave policy (16 weeks paid)",
      "Home office setup reimbursement up to $2,000"
    ]
  },
  {
    id: "job-5",
    title: "Cloud & DevOps Infrastructure Engineer",
    company: "Aether Cloud Solutions",
    companyLogo: "AC",
    companyColor: "from-sky-600 to-indigo-700",
    location: "Denver, CO",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    salary: "$135,000 - $170,000",
    experience: "Mid-Level (3-5 yrs)",
    category: "DevOps/Cloud",
    tags: ["AWS", "Terraform", "Kubernetes", "GitHub Actions", "Prometheus"],
    postedDate: "2 days ago",
    featured: false,
    department: "Site Reliability",
    applicantCount: 15,
    description: "Aether Cloud Solutions helps enterprise organizations modernize legacy infrastructure. We are seeking a Cloud & DevOps Engineer to design resilient, multi-region AWS cloud foundations and automate security policies as code.",
    responsibilities: [
      "Provision and manage multi-account AWS architectures using Terraform and Terragrunt",
      "Build automated CI/CD delivery pipelines in GitHub Actions with automated canary deployments",
      "Implement comprehensive monitoring, tracing, and alerting with Prometheus, Grafana, and Datadog",
      "Partner with development teams to ensure secure containerization and zero-downtime releases"
    ],
    requirements: [
      "3+ years managing AWS production environments and Infrastructure-as-Code (Terraform)",
      "Experience running containerized microservices in production using Kubernetes",
      "Proficient in shell scripting, Python, or Go for infrastructure automation",
      "AWS Certified Solutions Architect or DevOps Engineer certification is a strong plus"
    ],
    benefits: [
      "Hybrid work environment (2 days/week in downtown Denver office)",
      "Annual ski pass and outdoor gear stipend",
      "Competitive 401(k) retirement match",
      "Comprehensive health, dental, and life insurance"
    ]
  }
]

export const SEED_PROFILE = {
  name: "John Doe",
  title: "Senior Full Stack Developer",
  location: "San Francisco, CA",
  company: "Oasian",
  about: "Passionate software engineer with over 5 years of experience building scalable web applications. I specialize in React, Node.js, and cloud architecture. I love participating in hackathons, learning new technologies, and contributing to open-source projects. Currently exploring the world of agentic AI and Web3.",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "PostgreSQL", "AWS"],
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  portfolio: "https://johndoe.dev",
  experience: [
    {
      id: 1,
      role: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      companyColor: "text-blue-600 dark:text-blue-400",
      dates: "Jan 2022 - Present",
      description: "Led the development of a microservices-based e-commerce platform. Managed a team of 4 junior developers and improved system performance by 40%."
    },
    {
      id: 2,
      role: "Frontend Engineer",
      company: "StartupHub",
      companyColor: "text-foreground/80",
      dates: "Mar 2019 - Dec 2021",
      description: "Developed interactive dashboards using React and Redux. Collaborated closely with the design team to implement responsive and accessible UI components."
    }
  ],
  education: [
    {
      id: 1,
      degree: "B.S. in Computer Science",
      school: "University of California, Berkeley",
      dates: "2015 - 2019"
    }
  ]
}

export const SEED_RESUME = {
  versionNumber: 1,
  versionName: "v1 - Original (Uploaded)",
  isCurrent: true,
  fullName: "John Doe",
  title: "Senior Full Stack Developer",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  portfolio: "https://johndoe.dev",
  linkedin: "https://linkedin.com/in/johndoe",
  github: "https://github.com/johndoe",
  summary: "Passionate software engineer with over 5 years of experience building scalable web applications. I specialize in React, Node.js, and cloud architecture. I love participating in hackathons, learning new technologies, and contributing to open-source projects. Currently exploring the world of agentic AI and Web3.",
  skills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "PostgreSQL", "AWS", "Git", "REST APIs"],
  experience: [
    {
      id: "exp-1",
      role: "Senior Full Stack Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      dates: "Jan 2022 - Present",
      current: true,
      bullets: [
        "Led the development of a microservices-based e-commerce platform.",
        "Managed a team of 4 junior developers and improved system performance by 40%.",
        "Worked with React, Node.js, PostgreSQL and AWS to deploy features."
      ]
    },
    {
      id: "exp-2",
      role: "Frontend Engineer",
      company: "StartupHub",
      location: "San Francisco, CA",
      dates: "Mar 2019 - Dec 2021",
      current: false,
      bullets: [
        "Developed interactive dashboards using React and Redux.",
        "Collaborated closely with the design team to implement responsive and accessible UI components.",
        "Fixed critical UI bugs and improved user onboarding flow."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      school: "University of California, Berkeley",
      location: "Berkeley, CA",
      dates: "2015 - 2019",
      gpa: "3.8 / 4.0"
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "Oasian Upskill & Job Engine",
      description: "An AI-powered career launchpad built with Next.js App Router, Tailwind CSS, and vector search.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      link: "https://oasian.io"
    }
  ],
  certifications: [
    "AWS Certified Solutions Architect - Associate",
    "Meta Certified Frontend Developer"
  ]
}

export async function main() {
  console.log("🌱 Starting Neon Postgres database seed...")

  // 1. Seed Jobs
  for (const job of SEED_JOBS) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: job,
      create: job,
    })
  }
  console.log(`✅ Seeded ${SEED_JOBS.length} tech jobs.`)

  // 2. Seed Default Demo User & Profile
  const demoClerkId = "user_demo_oasian"
  const user = await prisma.user.upsert({
    where: { clerkId: demoClerkId },
    update: {
      email: "demo@oasian.io",
      name: "John Doe",
    },
    create: {
      clerkId: demoClerkId,
      email: "demo@oasian.io",
      name: "John Doe",
    },
  })

  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      ...SEED_PROFILE,
      syncedWithResumeId: "v1 - Original (Uploaded)",
      lastSyncedAt: new Date(),
    },
    create: {
      userId: user.id,
      ...SEED_PROFILE,
      syncedWithResumeId: "v1 - Original (Uploaded)",
      lastSyncedAt: new Date(),
    },
  })
  console.log("✅ Seeded demo user and profile.")

  // 3. Seed Default Resume
  const resume = await prisma.resume.upsert({
    where: { id: "seed-resume-v1" },
    update: {
      userId: user.id,
      ...SEED_RESUME,
    },
    create: {
      id: "seed-resume-v1",
      userId: user.id,
      ...SEED_RESUME,
    },
  })

  // 4. Seed Analysis for Resume
  await prisma.resumeAnalysis.create({
    data: {
      resumeId: resume.id,
      overallScore: 84,
      atsScore: 88,
      impactScore: 78,
      brevityScore: 92,
      skillsScore: 82,
      keySummary: "Strong technical foundation with prominent full stack highlights. Opportunities exist to quantify revenue/efficiency metrics.",
      strongSections: [
        {
          category: "Experience",
          score: 88,
          title: "Prominent Leadership & Progression",
          description: "Clear career trajectory showing transition from Frontend to Senior Full Stack lead.",
          highlights: ["Team management bullet points", "Microservice architecture highlights"]
        }
      ],
      weakSections: [
        {
          category: "Impact Metrics",
          severity: "medium",
          title: "Vague Performance Numbers",
          issue: "Some bullets mention improvements without clarifying dollar value or exact user scale.",
          impact: "ATS scoring algorithms prioritize quantified percentages and revenue drivers.",
          suggestion: "Include specific latency reduction (e.g., 'reduced API p99 from 450ms to 120ms')."
        }
      ],
      missingOrErrors: [],
      improvements: [
        {
          id: "imp-1",
          section: "experience",
          targetId: "exp-1",
          bulletIndex: 0,
          title: "Add scale and business metric",
          before: "Led the development of a microservices-based e-commerce platform.",
          after: "Architected a high-throughput microservices e-commerce platform serving 1.2M monthly active users.",
          rationale: "Demonstrates production scale and operational ownership.",
          impact: "+12 ATS Relevance Score",
          applied: false
        }
      ],
      targetRoles: ["Senior Full Stack Developer", "Backend Platform Engineer", "Tech Lead"],
      recommendedJobIds: ["job-1", "job-2", "job-4"],
    },
  })
  console.log("✅ Seeded initial resume & AI diagnostic analysis.")

  console.log("🎉 Database seeding completed successfully!")
}

if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  main()
    .catch((e) => {
      console.error("❌ Seeding error:", e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
