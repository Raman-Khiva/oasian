import { Job } from "./resume-types"

export const DUMMY_JOBS: Job[] = [
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
    matchScore: 96,
    matchReasons: [
      "Direct match for your React, Next.js, and TypeScript core skills",
      "Matches your 5+ years building distributed web applications",
      "Values your experience leading microservice migrations"
    ],
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
    matchScore: 92,
    matchReasons: [
      "Matches your Full Stack TypeScript expertise",
      "Ideal fit for your stated interest in agentic AI and Web3 technologies",
      "Great bridge for scaling AI agents with modern Next.js UIs"
    ],
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
    tags: ["React", "TypeScript", "Next.js", "Design Systems", "Web Vitals", "Tailwind CSS"],
    matchScore: 89,
    matchReasons: [
      "Matches your strong React, TypeScript, and UI component background",
      "Aligns with your 40% performance optimization achievements",
      "Offers leadership scope over web architecture"
    ],
    postedDate: "1 day ago",
    featured: true,
    department: "Web Platform",
    applicantCount: 19,
    description: "HyperScale is looking for a Lead Frontend Architect to establish technical standards and lead the core UI platform. You will be responsible for our design system, Core Web Vitals optimization, and developer experience across 6 autonomous product squads.",
    responsibilities: [
      "Define frontend engineering standards, build tooling, and design system governance",
      "Optimize web application performance to achieve sub-second LCP and flawless 100/100 Lighthouse scores",
      "Conduct architecture reviews and establish testing frameworks (Vitest, Playwright)",
      "Work closely with product design leaders on design tokenization and accessibility (WCAG 2.1 AA)"
    ],
    requirements: [
      "5+ years specializing in complex React applications at scale",
      "Deep expertise in TypeScript, bundlers (Turbopack, Vite), and modern CSS architectures",
      "Proven track record designing and maintaining multi-brand design systems",
      "Excellent technical writing and cross-team communication abilities"
    ],
    benefits: [
      "Top-tier compensation and annual retention bonuses",
      "Annual company retreats in international locations",
      "Full family health coverage with zero deductible",
      "Flexible schedule with asynchronous-first team culture"
    ]
  },
  {
    id: "job-4",
    title: "Senior Backend Systems Engineer",
    company: "DataOrbit Systems",
    companyLogo: "DO",
    companyColor: "from-emerald-600 to-teal-700",
    location: "Austin, TX",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    salary: "$150,000 - $185,000",
    experience: "Senior (4-7 yrs)",
    category: "Backend",
    tags: ["Go", "Node.js", "PostgreSQL", "Kafka", "Docker", "Kubernetes"],
    matchScore: 82,
    matchReasons: [
      "Leverages your Node.js, PostgreSQL, and microservices experience",
      "Good opportunity to deepen distributed systems knowledge"
    ],
    postedDate: "1 day ago",
    department: "Distributed Platforms",
    applicantCount: 31,
    description: "DataOrbit powers real-time analytics for global logistics. We are seeking a Senior Backend Engineer to expand our distributed data ingestion pipelines handling over 50,000 requests per second with stringent SLA guarantees.",
    responsibilities: [
      "Build high-throughput streaming ingest pipelines using Go, Kafka, and Node.js",
      "Tune database queries and indexing strategies in PostgreSQL for low-latency retrieval",
      "Deploy and manage containerized services on AWS EKS using Helm and Terraform",
      "Participate in on-call rotations and lead post-incident retrospectives"
    ],
    requirements: [
      "4+ years building robust distributed backend systems",
      "Proficiency with Go or Node.js/TypeScript in enterprise settings",
      "Experience with event-driven architectures (Kafka, RabbitMQ, SQS)",
      "Knowledge of database performance tuning and caching mechanisms"
    ],
    benefits: [
      "Competitive 401(k) matching up to 6%",
      "Annual bonus incentives tied to platform stability",
      "Subsidized gym memberships and commuter passes",
      "Comprehensive healthcare and dental coverage"
    ]
  },
  {
    id: "job-5",
    title: "Junior Software Developer",
    company: "Oasian Engineering",
    companyLogo: "OE",
    companyColor: "from-blue-500 to-violet-500",
    location: "Remote / Bengaluru",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$75,000 - $95,000",
    experience: "Junior (1-2 yrs)",
    category: "Full Stack",
    tags: ["JavaScript", "TypeScript", "React", "Node.js", "Git", "Tailwind CSS"],
    matchScore: 78,
    postedDate: "2 days ago",
    department: "Core Product",
    applicantCount: 88,
    description: "Jumpstart your career with Oasian Engineering! We are seeking an eager, motivated Junior Software Developer to contribute to our student upskilling and job discovery engines.",
    responsibilities: [
      "Develop responsive UI components from Figma mockups using React and Tailwind CSS",
      "Write unit and integration tests to ensure reliable bug-free releases",
      "Assist in optimizing REST endpoints and database schema migrations",
      "Participate in daily standups, code reviews, and pair programming sessions"
    ],
    requirements: [
      "Degree in Computer Science or equivalent practical bootcamp experience",
      "Solid fundamentals in HTML, CSS, JavaScript, and React",
      "Familiarity with Git workflows, pull requests, and package managers",
      "Hunger to learn modern tech stacks and receive constructive feedback"
    ],
    benefits: [
      "Dedicated senior engineer mentorship program",
      "Fast-track promotion path evaluated every 6 months",
      "Annual gear stipend for remote workstation",
      "Regular virtual hackathons and learning hack weeks"
    ]
  },
  {
    id: "job-6",
    title: "Machine Learning / MLOps Engineer",
    company: "NeuralWave Dynamics",
    companyLogo: "NW",
    companyColor: "from-purple-600 to-pink-600",
    location: "San Francisco, CA",
    workplaceType: "On-site",
    jobType: "Full-time",
    salary: "$165,000 - $210,000",
    experience: "Senior (4+ yrs)",
    category: "AI/ML",
    tags: ["Python", "PyTorch", "Kubeflow", "Docker", "AWS", "MLflow"],
    matchScore: 71,
    postedDate: "3 days ago",
    department: "Applied AI Research",
    applicantCount: 22,
    description: "NeuralWave is pushing the boundaries of conversational AI and computer vision models. We are hiring an MLOps Engineer to productionize foundation models and manage scalable inference infrastructure.",
    responsibilities: [
      "Build automated CI/CD pipelines for training, validating, and deploying deep learning models",
      "Optimize inference latencies using vLLM, TensorRT, and model quantization techniques",
      "Monitor drift, model performance, and GPU cluster utilization across AWS EC2 instances",
      "Partner with ML researchers to translate experimental notebooks into production packages"
    ],
    requirements: [
      "3+ years experience managing ML pipelines in production environments",
      "Deep expertise in Python, PyTorch, and containerization with Docker/Kubernetes",
      "Experience with model monitoring tools like MLflow, Weights & Biases",
      "Strong understanding of GPU hardware architectures and memory constraints"
    ],
    benefits: [
      "Exceptional equity package in venture-backed unicorn",
      "Catered gourmet lunches daily at downtown SF headquarters",
      "Annual tech allowance of $3,000 for gadgets and conferences",
      "Full coverage health insurance including mental health therapy"
    ]
  },
  {
    id: "job-7",
    title: "Senior Frontend Engineer (Performance)",
    company: "FinStream Pay",
    companyLogo: "FP",
    companyColor: "from-blue-700 to-sky-600",
    location: "New York, NY",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$140,000 - $175,000",
    experience: "Mid-Senior (3-6 yrs)",
    category: "Frontend",
    tags: ["React", "Next.js", "TypeScript", "WebSockets", "Tailwind CSS"],
    matchScore: 91,
    matchReasons: [
      "Matches your React, Next.js, and TypeScript competencies",
      "Values your experience building interactive financial/ecommerce dashboards",
      "Remote flexibility with top-tier fintech compensation"
    ],
    postedDate: "3 days ago",
    department: "Merchant Checkout",
    applicantCount: 35,
    description: "FinStream Pay processes over $10B in annual cross-border transactions. As a Senior Frontend Engineer, you will build ultra-fast, accessible checkout experiences where every millisecond counts.",
    responsibilities: [
      "Develop ultra-responsive checkout SDKs and merchant portals with React and TypeScript",
      "Benchmark, profile, and eliminate UI bottlenecks across low-bandwidth mobile networks",
      "Enforce rigorous security practices (CSP, iframe sandboxing, anti-fraud telemetry)",
      "Conduct A/B tests to optimize conversion rates and user journeys"
    ],
    requirements: [
      "4+ years creating production React and TypeScript web applications",
      "Deep knowledge of browser rendering lifecycles, memory leak profiling, and bundle analysis",
      "Familiarity with financial compliance, payment processing, or PCI-DSS standards is a plus",
      "Excellent problem-solving mindset and detail-oriented code craft"
    ],
    benefits: [
      "Competitive base salary with bi-annual performance bonuses",
      "Home office setup budget of $1,500",
      "Cell phone and high-speed internet monthly reimbursements",
      "Generous parental leave for primary and secondary caregivers"
    ]
  },
  {
    id: "job-8",
    title: "DevOps & Cloud Infrastructure Architect",
    company: "Apex Cloud Solutions",
    companyLogo: "AC",
    companyColor: "from-amber-600 to-orange-600",
    location: "Chicago, IL",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$145,000 - $185,000",
    experience: "Senior (5+ yrs)",
    category: "DevOps/Cloud",
    tags: ["AWS", "Terraform", "Kubernetes", "CI/CD", "Prometheus", "Docker"],
    matchScore: 80,
    postedDate: "4 days ago",
    department: "Cloud Operations",
    applicantCount: 17,
    description: "Apex Cloud is seeking an Infrastructure Architect to modernize our multi-cloud deployment ecosystem. You will lead cloud security posture, infrastructure-as-code automation, and zero-downtime deployments.",
    responsibilities: [
      "Design and manage automated Terraform modules across multiple AWS regions",
      "Maintain Kubernetes clusters (EKS) with automated horizontal pod autoscaling",
      "Implement automated GitHub Actions CI/CD pipelines with integrated security scanning",
      "Set up distributed observability dashboards with Prometheus, Grafana, and Datadog"
    ],
    requirements: [
      "5+ years managing production AWS infrastructure at scale",
      "Expertise in Terraform, Kubernetes, Helm, and Linux administration",
      "Demonstrated experience achieving 99.99% system availability SLAs",
      "AWS Certified Solutions Architect certification preferred"
    ],
    benefits: [
      "Flexible work hours with no core times",
      "401(k) match up to 5% with immediate vesting",
      "Generous health, dental, and vision insurance premiums paid 100%",
      "Annual company summit in resort destinations"
    ]
  },
  {
    id: "job-9",
    title: "Product Designer (UI/UX & Design Systems)",
    company: "CanvasFlow Studio",
    companyLogo: "CF",
    companyColor: "from-rose-500 to-pink-600",
    location: "San Francisco, CA",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    salary: "$120,000 - $160,000",
    experience: "Mid-Senior (3-5 yrs)",
    category: "Design/Product",
    tags: ["Figma", "UI/UX", "Design Systems", "Prototyping", "User Research"],
    matchScore: 65,
    postedDate: "4 days ago",
    department: "Product Design",
    applicantCount: 47,
    description: "CanvasFlow creates visual collaboration canvases for creative professionals. We are hiring a Product Designer passionate about crafting micro-interactions, systematic design tokens, and seamless user experiences.",
    responsibilities: [
      "Craft high-fidelity prototypes and UI flows in Figma for core web and mobile apps",
      "Maintain and evolve our comprehensive design token system in sync with frontend engineering",
      "Conduct user interviews, usability tests, and synthesize qualitative user feedback",
      "Present design rationale to leadership and cross-functional stakeholders"
    ],
    requirements: [
      "3+ years product design experience with a standout portfolio of web applications",
      "Mastery of Figma (auto-layout, components, interactive variables)",
      "Strong understanding of CSS/HTML constraints and component-driven architecture",
      "Empathy for user pain points and ability to translate complex data into simple workflows"
    ],
    benefits: [
      "Hybrid balance (Tuesday & Thursday in SF office)",
      "Annual design book and conference sponsorship",
      "Comprehensive medical, vision, and mental wellness coverage",
      "Pet-friendly office with barista bar and weekly team socials"
    ]
  },
  {
    id: "job-10",
    title: "Senior Data Platform Engineer",
    company: "MetroData Corp",
    companyLogo: "MD",
    companyColor: "from-indigo-600 to-slate-800",
    location: "Boston, MA",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    salary: "$145,000 - $180,000",
    experience: "Senior (4-7 yrs)",
    category: "Backend",
    tags: ["Python", "Snowflake", "dbt", "SQL", "Apache Spark", "Airflow"],
    matchScore: 73,
    postedDate: "5 days ago",
    department: "Data Platform",
    applicantCount: 20,
    description: "MetroData handles petabyte-scale data pipelines for healthcare and biotechnology customers. We are looking for a Senior Data Platform Engineer to design reliable data meshes and analytics transformations.",
    responsibilities: [
      "Develop and orchestrate batch and stream transformations using Airflow, dbt, and Snowflake",
      "Build automated data quality tests and schema drift validation checks",
      "Optimize heavy analytical SQL queries and reduce warehouse compute expenses",
      "Collaborate with BI analysts to expose clean, documented dimensional data models"
    ],
    requirements: [
      "4+ years of data engineering experience utilizing Python and modern data stacks",
      "Deep expertise in modern warehouses (Snowflake, BigQuery) and dbt",
      "Experience with data governance, lineage tracking, and role-based access control",
      "Strong background in data modeling (Kimball, Data Vault)"
    ],
    benefits: [
      "Substantial bonus structure tied to company revenue targets",
      "Comprehensive healthcare with employer HSA contribution",
      "Tuition assistance for advanced computing or data degrees",
      "Generous paid holidays and volunteer day off"
    ]
  },
  {
    id: "job-11",
    title: "Full Stack Engineer (Python/FastAPI & React)",
    company: "HealthNova Tech",
    companyLogo: "HN",
    companyColor: "from-emerald-500 to-cyan-600",
    location: "San Diego, CA",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$130,000 - $165,000",
    experience: "Mid-level (3-5 yrs)",
    category: "Full Stack",
    tags: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker"],
    matchScore: 86,
    matchReasons: [
      "Direct match for your React and TypeScript experience",
      "Values your PostgreSQL and REST API design background"
    ],
    postedDate: "5 days ago",
    department: "Patient Health Portals",
    applicantCount: 39,
    description: "HealthNova is reimagining clinical diagnostics and patient management. You will build secure, HIPAA-compliant patient-facing dashboards and clinician communication tools.",
    responsibilities: [
      "Build intuitive web interfaces using React, TypeScript, and modern component libraries",
      "Implement robust REST APIs in Python FastAPI with rigorous schema validation",
      "Ensure compliance with HIPAA security standards and audit logging",
      "Optimize data sync between mobile apps, web portals, and electronic health record systems"
    ],
    requirements: [
      "3+ years experience across frontend (React) and backend (Python/Node.js)",
      "Familiarity with relational database design and migration management (Alembic/Prisma)",
      "Commitment to writing readable, maintainable, well-tested code",
      "Strong interest in healthcare technology and improving patient outcomes"
    ],
    benefits: [
      "100% remote within continental United States",
      "Top-tier platinum health, dental, and vision insurance",
      "Annual $1,000 wellness reimbursement (gym, equipment, massages)",
      "401(k) matching at 4%"
    ]
  },
  {
    id: "job-12",
    title: "Site Reliability Engineer (SRE)",
    company: "EdgeGlobal Networks",
    companyLogo: "EG",
    companyColor: "from-slate-700 to-zinc-900",
    location: "Seattle, WA",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$140,000 - $175,000",
    experience: "Mid-Senior (3-6 yrs)",
    category: "DevOps/Cloud",
    tags: ["Linux", "Kubernetes", "Golang", "Python", "Terraform", "Incident Response"],
    matchScore: 75,
    postedDate: "6 days ago",
    department: "Platform Reliability",
    applicantCount: 23,
    description: "EdgeGlobal operates global edge caching and routing points of presence. We are looking for an SRE to drive fault tolerance, latency reduction, and automated recovery across our multi-region network.",
    responsibilities: [
      "Define and track Service Level Objectives (SLOs) and Error Budgets with engineering leads",
      "Automate failover procedures and chaotic resilience testing across edge clusters",
      "Improve telemetry, distributed tracing (OpenTelemetry), and actionable alerting",
      "Drive root cause analysis post-mortems and preventative architectural remediation"
    ],
    requirements: [
      "3+ years hands-on experience in SRE, DevOps, or systems engineering roles",
      "Solid scripting ability in Go or Python",
      "Strong familiarity with Linux networking fundamentals (TCP/IP, BGP, DNS, TLS)",
      "Experience running production workloads on Kubernetes and AWS/GCP"
    ],
    benefits: [
      "Extensive health insurance covering alternative therapies",
      "On-call compensation bonus on top of regular salary",
      "Stock option grants with favorable exercise windows",
      "Flexible PTO policy"
    ]
  },
  {
    id: "job-13",
    title: "Developer Relations Engineer (DevRel)",
    company: "BaseForge OSS",
    companyLogo: "BF",
    companyColor: "from-blue-600 to-sky-500",
    location: "Remote Worldwide",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$125,000 - $160,000",
    experience: "Mid-level (2-5 yrs)",
    category: "Full Stack",
    tags: ["React", "Next.js", "TypeScript", "Technical Writing", "Open Source", "Content Creation"],
    matchScore: 84,
    matchReasons: [
      "Aligns with your open-source contributions and hackathon enthusiasm",
      "Direct match for your Next.js and React expertise"
    ],
    postedDate: "6 days ago",
    department: "Developer Experience",
    applicantCount: 52,
    description: "BaseForge creates open-source developer databases and local emulator tooling. If you love coding in public, speaking at tech conferences, and writing killer interactive tutorials, this role is made for you!",
    responsibilities: [
      "Create high-impact sample applications, demo repos, and starter kits with Next.js and React",
      "Write technical blog posts, guides, and documentation for new feature releases",
      "Engage with our Discord, GitHub Discussions, and Twitter developer communities",
      "Represent BaseForge at premier developer conferences and hackathons worldwide"
    ],
    requirements: [
      "2+ years experience as a software engineer or developer advocate",
      "Strong coding abilities in JavaScript/TypeScript and web frameworks",
      "Track record of writing articles, creating video demos, or speaking publicly",
      "Passion for open-source software and empathy for developers"
    ],
    benefits: [
      "Travel budget for global conferences and community meetups",
      "Full remote freedom: work from anywhere in the world",
      "Generous hardware allowance (computers, podcast microphones, cameras)",
      "Co-working space membership stipend"
    ]
  },
  {
    id: "job-14",
    title: "Mobile App Engineer (React Native & iOS)",
    company: "PulseFit Health",
    companyLogo: "PF",
    companyColor: "from-rose-600 to-orange-500",
    location: "Los Angeles, CA",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    salary: "$130,000 - $165,000",
    experience: "Mid-Senior (3-5 yrs)",
    category: "Mobile",
    tags: ["React Native", "TypeScript", "iOS", "Android", "Redux", "GraphQL"],
    matchScore: 76,
    postedDate: "1 week ago",
    department: "Mobile Engineering",
    applicantCount: 30,
    description: "PulseFit connects wearable health trackers with personalized AI fitness coaches. We need a talented React Native engineer to bring sleek animations and offline-first performance to millions of active users.",
    responsibilities: [
      "Ship clean, smooth 60fps mobile interfaces using React Native and TypeScript",
      "Integrate native iOS HealthKit and Android Health Connect device APIs",
      "Implement offline synchronization and SQLite local caching",
      "Manage release pipelines through Apple App Store and Google Play Console"
    ],
    requirements: [
      "3+ years experience developing cross-platform mobile apps with React Native",
      "Proficiency with TypeScript and state management libraries",
      "Understanding of native mobile bridge architectures and performance profiling",
      "Published at least one notable app on the iOS App Store or Google Play"
    ],
    benefits: [
      "Free premium gym membership and fitness wearable of choice",
      "Hybrid workspace near Santa Monica beach",
      "Healthy snack bars and catered lunches",
      "Comprehensive medical and dental coverage"
    ]
  },
  {
    id: "job-15",
    title: "Application Security & Pentest Specialist",
    company: "ShieldGuard Cyber",
    companyLogo: "SG",
    companyColor: "from-red-600 to-zinc-900",
    location: "Washington, DC",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$145,000 - $185,000",
    experience: "Senior (4-7 yrs)",
    category: "Backend",
    tags: ["AppSec", "Penetration Testing", "OWASP", "Python", "CI/CD Security", "DevSecOps"],
    matchScore: 68,
    postedDate: "1 week ago",
    department: "Information Security",
    applicantCount: 16,
    description: "ShieldGuard protects mission-critical government and enterprise applications. We are seeking an Application Security Specialist to conduct code audits, automated DAST/SAST integrations, and threat modeling.",
    responsibilities: [
      "Perform code audits and threat modeling on web applications and cloud microservices",
      "Embed automated vulnerability scanning into CI/CD build pipelines",
      "Organize red-team exercises, penetration tests, and bug bounty programs",
      "Conduct security awareness workshops and secure-coding tutorials for engineers"
    ],
    requirements: [
      "4+ years specialized in application security or offensive cyber operations",
      "Deep understanding of OWASP Top 10, OAuth2/OIDC, and modern web exploits",
      "Relevant certifications (OSCP, CISSP, CEH) strongly valued",
      "US citizenship or permanent residency required for security clearance projects"
    ],
    benefits: [
      "Top-tier federal contractor compensation packages",
      "Annual training stipend for security certifications (SANS, Offensive Security)",
      "Comprehensive family healthcare and disability coverage",
      "Retirement plan with generous 7% employer match"
    ]
  },
  {
    id: "job-16",
    title: "Growth Software Engineer",
    company: "QuickScale SaaS",
    companyLogo: "QS",
    companyColor: "from-teal-600 to-emerald-600",
    location: "Austin, TX",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$125,000 - $155,000",
    experience: "Mid-level (2-5 yrs)",
    category: "Full Stack",
    tags: ["Next.js", "React", "TypeScript", "A/B Testing", "Segment", "PostgreSQL"],
    matchScore: 88,
    matchReasons: [
      "Great fit for your Next.js and frontend dashboard development skills",
      "Opportunity to directly impact product virality and user onboarding funnels"
    ],
    postedDate: "1 week ago",
    department: "Growth & Monetization",
    applicantCount: 44,
    description: "QuickScale empowers 50,000 businesses to automate their billing and marketing funnels. We are seeking a Growth Software Engineer who loves rapid experimentation, user psychology, and shipping high-converting onboarding funnels.",
    responsibilities: [
      "Design and execute rapid A/B experiments across landing pages, pricing tiers, and checkout",
      "Instrument analytics events with Segment, PostHog, and custom tracking pipelines",
      "Optimize user onboarding flows, reducing time-to-value for new signups",
      "Partner with the Head of Growth and marketing leads on viral referral loops"
    ],
    requirements: [
      "2+ years experience building web applications with Next.js and React",
      "Data-driven mindset with familiarity in conversion rate optimization (CRO)",
      "Solid understanding of frontend performance and SEO best practices",
      "Comfortable moving fast and iterating through multiple product hypotheses"
    ],
    benefits: [
      "Competitive salary with performance bonuses tied to revenue milestones",
      "Fully remote position with flexible schedule",
      "Quarterly company meetups in vibrant travel hubs",
      "Home office desk & chair allowance"
    ]
  },
  {
    id: "job-17",
    title: "Software Engineering Intern (Summer 2026)",
    company: "TechNova Incubator",
    companyLogo: "TN",
    companyColor: "from-violet-500 to-indigo-600",
    location: "San Francisco, CA",
    workplaceType: "On-site",
    jobType: "Internship",
    salary: "$45 - $55 / hr",
    experience: "Entry / Student",
    category: "Full Stack",
    tags: ["TypeScript", "React", "Python", "SQL", "Git", "Problem Solving"],
    matchScore: 70,
    postedDate: "1 week ago",
    department: "Emerging Tech Incubator",
    applicantCount: 140,
    description: "Spend your summer building innovative products at TechNova! Our 12-week paid internship program embeds students directly into high-velocity startup teams building real features shipped to real users.",
    responsibilities: [
      "Build and deploy customer-facing web features under the guidance of a senior mentor",
      "Participate in sprint planning, retrospectives, and architecture brown bags",
      "Present your summer capstone project to company founders and venture partners",
      "Receive intensive coaching on algorithms, system design, and software best practices"
    ],
    requirements: [
      "Currently enrolled in a B.S. or M.S. in Computer Science or related technical field",
      "Solid foundation in data structures, algorithms, and web programming",
      "Proficiency in at least one modern language: TypeScript, Python, or Go",
      "Demonstrated side projects, hackathon awards, or open-source involvement"
    ],
    benefits: [
      "Generous housing stipend for students relocating to San Francisco",
      "Full-time return offer consideration upon graduation",
      "Executive mentorship lunches and weekly guest speaker series",
      "Fully stocked kitchen, snacks, and public transit subsidy"
    ]
  },
  {
    id: "job-18",
    title: "Platform Engineer (Kubernetes & Terraform)",
    company: "InfraCore Systems",
    companyLogo: "IC",
    companyColor: "from-blue-800 to-slate-900",
    location: "Denver, CO",
    workplaceType: "Hybrid",
    jobType: "Full-time",
    salary: "$138,000 - $172,000",
    experience: "Mid-Senior (3-6 yrs)",
    category: "DevOps/Cloud",
    tags: ["Kubernetes", "AWS", "Terraform", "ArgoCD", "Helm", "Go"],
    matchScore: 79,
    postedDate: "1 week ago",
    department: "Internal Developer Platform",
    applicantCount: 19,
    description: "InfraCore Systems builds internal developer platforms that empower 200+ product engineers to ship software autonomously. We are looking for a Platform Engineer to elevate our developer platform.",
    responsibilities: [
      "Build self-service developer portals using Backstage and Kubernetes operators",
      "Manage GitOps continuous deployment workflows using ArgoCD and Helm",
      "Standardize cloud resource provisioning with reusable Terraform modules",
      "Provide internal support and consultation to feature squads on infrastructure best practices"
    ],
    requirements: [
      "3+ years in platform engineering, systems administration, or DevOps",
      "Strong background in Kubernetes administration and cloud architecture",
      "Proficiency with GitOps principles and infrastructure as code",
      "Passion for reducing friction and enhancing developer happiness"
    ],
    benefits: [
      "Ski pass stipend (Epic or Ikon) and mountain recreation perks",
      "Flexible hybrid model in beautiful downtown Denver",
      "Comprehensive medical, dental, and vision insurance",
      "401(k) with 5% immediate company match"
    ]
  },
  {
    id: "job-19",
    title: "Technical Product Manager (Developer Tooling)",
    company: "StackCraft Labs",
    companyLogo: "SC",
    companyColor: "from-amber-500 to-rose-600",
    location: "Remote",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$140,000 - $175,000",
    experience: "Mid-Senior (3-6 yrs)",
    category: "Design/Product",
    tags: ["Product Management", "Developer Experience", "APIs", "Roadmapping", "Analytics"],
    matchScore: 72,
    postedDate: "2 weeks ago",
    department: "Product Management",
    applicantCount: 38,
    description: "StackCraft builds cloud IDEs and continuous preview environments. We are seeking a Technical Product Manager who understands developer workflows intimately and wants to shape the future of software construction.",
    responsibilities: [
      "Define product strategy and quarterly OKRs for our core CLI and web dashboard",
      "Write detailed PRDs, user stories, and acceptance criteria for engineering teams",
      "Interview software engineers, CTOs, and dev leads to uncover workflow bottlenecks",
      "Analyze usage metrics and telemetry to optimize feature discovery and retention"
    ],
    requirements: [
      "3+ years experience as a PM or technical founder building developer-facing software",
      "Former software engineering background or deep technical literacy with APIs and cloud tooling",
      "Excellent storytelling, customer empathy, and cross-functional leadership skills",
      "Proven ability to execute from 0 to 1 and scale products iteratively"
    ],
    benefits: [
      "Competitive equity and transparent valuation growth",
      "Remote-first work culture with flexible hours",
      "Generous health, dental, and optical plan options",
      "Annual $2,000 conference and continuous education stipend"
    ]
  },
  {
    id: "job-20",
    title: "GenAI & LLM Solutions Specialist",
    company: "Cortex Labs",
    companyLogo: "CL",
    companyColor: "from-indigo-600 to-violet-700",
    location: "San Jose, CA",
    workplaceType: "Remote",
    jobType: "Full-time",
    salary: "$165,000 - $215,000",
    experience: "Senior (4+ yrs)",
    category: "AI/ML",
    tags: ["LLMs", "Python", "TypeScript", "LangChain", "Vector Embeddings", "RAG"],
    matchScore: 90,
    matchReasons: [
      "Matches your interests in modern Agentic AI workflows",
      "Values your combined frontend and backend microservices experience",
      "Top compensation tier in high-growth AI startup"
    ],
    postedDate: "2 weeks ago",
    department: "Applied AI Solutions",
    applicantCount: 29,
    description: "Cortex Labs designs custom enterprise LLM orchestration engines. As our GenAI Solutions Specialist, you will construct autonomous agents, benchmark model responses, and deliver enterprise-grade retrieval architectures.",
    responsibilities: [
      "Architect end-to-end RAG pipelines using hybrid keyword/vector search and rerankers",
      "Build multi-agent task execution networks using LangGraph and Autogen patterns",
      "Benchmark foundation models across latency, hallucination rates, and cost economics",
      "Prototype customer integrations in TypeScript and Python for enterprise clients"
    ],
    requirements: [
      "4+ years building production web applications or distributed systems",
      "Demonstrated experience shipping generative AI solutions into production",
      "Strong coding abilities in Python and TypeScript",
      "Solid knowledge of evaluation methodologies (RAGAS, prompt regression testing)"
    ],
    benefits: [
      "Substantial early-stage equity grants with rapid liquidity options",
      "100% remote flexibility with home office setup fund",
      "Premium health, dental, and vision insurance for you and dependents",
      "Annual generative AI summit passes and travel expenses"
    ]
  }
]
