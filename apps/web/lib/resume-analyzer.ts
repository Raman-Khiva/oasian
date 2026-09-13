import { 
  ResumeData, 
  AnalysisFeedback, 
  SectionScore, 
  WeakSection, 
  MissingOrError, 
  ImprovementItem,
  Job 
} from "./resume-types"
import { DUMMY_JOBS } from "./jobs-data"

export const DEFAULT_RESUME: ResumeData = {
  id: "resume-v1",
  versionNumber: 1,
  versionName: "v1 - Original (Uploaded)",
  updatedAt: new Date().toISOString(),
  header: {
    fullName: "John Doe",
    title: "Senior Full Stack Developer",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    portfolio: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    summary: "Passionate software engineer with over 5 years of experience building scalable web applications. I specialize in React, Node.js, and cloud architecture. I love participating in hackathons, learning new technologies, and contributing to open-source projects. Currently exploring the world of agentic AI and Web3."
  },
  skills: [
    "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", 
    "GraphQL", "PostgreSQL", "AWS", "Git", "REST APIs"
  ],
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
    },
    {
      id: "proj-2",
      name: "CloudTelemetry CLI",
      description: "Lightweight command-line utility for monitoring cloud service health and alerting in Slack.",
      techStack: ["Node.js", "TypeScript", "AWS SDK"],
      link: "https://github.com/johndoe/cloudtelemetry"
    }
  ],
  certifications: [
    "AWS Certified Solutions Architect - Associate",
    "Meta Certified Frontend Developer"
  ]
}

export const SAMPLE_RESUMES: Record<string, ResumeData> = {
  default: DEFAULT_RESUME,
  frontend: {
    id: "resume-fe",
    versionNumber: 1,
    versionName: "v1 - Alex (Frontend Engineer)",
    updatedAt: new Date().toISOString(),
    header: {
      fullName: "Alex Rivera",
      title: "Frontend Engineer",
      email: "alex.rivera@example.com",
      phone: "+1 (555) 987-6543",
      location: "Austin, TX",
      portfolio: "https://alexrivera.ui",
      linkedin: "https://linkedin.com/in/alexrivera",
      github: "https://github.com/alexrivera",
      summary: "Frontend developer experienced with React, CSS, and Figma. Eager to build accessible and fast web apps. Seeking mid-level frontend or UI engineering roles."
    },
    skills: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Figma", "Git"],
    experience: [
      {
        id: "fe-exp-1",
        role: "Frontend Developer",
        company: "PixelCraft Agency",
        location: "Austin, TX",
        dates: "Jun 2021 - Present",
        current: true,
        bullets: [
          "Built customer websites using React and Next.js.",
          "Converted Figma mockups into pixel-perfect responsive web pages.",
          "Responsible for styling and animations across client projects."
        ]
      }
    ],
    education: [
      {
        id: "fe-edu-1",
        degree: "B.A. in Digital Arts & Information Science",
        school: "University of Texas, Austin",
        location: "Austin, TX",
        dates: "2017 - 2021"
      }
    ],
    projects: [
      {
        id: "fe-proj-1",
        name: "Design System UI Kit",
        description: "Open-source Tailwind component library with 40+ accessible UI widgets.",
        techStack: ["React", "TypeScript", "Tailwind CSS"],
        link: "https://alexrivera.ui/components"
      }
    ],
    certifications: ["Meta Frontend Specialist"]
  },
  ai: {
    id: "resume-ai",
    versionNumber: 1,
    versionName: "v1 - Sarah (AI & Data Engineer)",
    updatedAt: new Date().toISOString(),
    header: {
      fullName: "Sarah Chen",
      title: "AI & Machine Learning Engineer",
      email: "sarah.chen@example.com",
      phone: "+1 (555) 456-7890",
      location: "San Jose, CA",
      portfolio: "https://sarahchen.ai",
      linkedin: "https://linkedin.com/in/sarahchen-ai",
      github: "https://github.com/sarahchen",
      summary: "Data and AI engineer with 4 years building deep learning pipelines and productionizing LLMs. Proficient in PyTorch, Python, LangChain, and high-throughput vector search."
    },
    skills: ["Python", "PyTorch", "LangChain", "OpenAI API", "Docker", "PostgreSQL", "FastAPI", "AWS", "Vector DB"],
    experience: [
      {
        id: "ai-exp-1",
        role: "AI Application Engineer",
        company: "NeuroFlow Systems",
        location: "San Jose, CA",
        dates: "Aug 2022 - Present",
        current: true,
        bullets: [
          "Built retrieval augmented generation (RAG) pipelines for customer support automation.",
          "Optimized embedding search latency using pgvector and Pinecone.",
          "Wrote FastAPI backend services to serve model inference endpoints."
        ]
      }
    ],
    education: [
      {
        id: "ai-edu-1",
        degree: "M.S. in Computer Science (Machine Learning)",
        school: "Stanford University",
        location: "Stanford, CA",
        dates: "2020 - 2022"
      }
    ],
    projects: [
      {
        id: "ai-proj-1",
        name: "Autonomous Document Agent",
        description: "Agentic research tool capable of parsing PDFs, generating citations, and answering questions.",
        techStack: ["Python", "LangChain", "ChromaDB", "FastAPI"],
        link: "https://github.com/sarahchen/doc-agent"
      }
    ],
    certifications: ["DeepLearning.AI Generative AI Specialist"]
  }
}

/**
 * Intelligent Fake Resume Analyser Engine
 * Parses resume structure, evaluates ATS heuristics, action verb strength,
 * metric density, and outputs detailed feedback and improvement roadmap.
 */
export function analyzeResume(resume: ResumeData): AnalysisFeedback {
  const strongSections: SectionScore[] = []
  const weakSections: WeakSection[] = []
  const missingOrErrors: MissingOrError[] = []
  const improvements: ImprovementItem[] = []

  let overallScore = 72
  let atsScore = 68
  let impactScore = 62
  let brevityScore = 82
  let skillsScore = 80

  // 1. Evaluate Header & Contact Info
  const header = resume.header
  const hasLinkedin = !!header.linkedin && header.linkedin.includes("linkedin")
  const hasGithub = !!header.github && header.github.includes("github")
  const hasPortfolio = !!header.portfolio && header.portfolio.length > 5

  if (!hasLinkedin) {
    missingOrErrors.push({
      id: "miss-linkedin",
      type: "missing",
      title: "Missing LinkedIn Profile URL",
      description: "Over 87% of tech recruiters verify candidates on LinkedIn before scheduling phone screens.",
      fix: "Add your customized LinkedIn URL (e.g. linkedin.com/in/yourname) in the header."
    })
    atsScore -= 5
  }

  if (!hasGithub && resume.header.title.toLowerCase().includes("developer")) {
    missingOrErrors.push({
      id: "miss-github",
      type: "warning",
      title: "GitHub Profile Not Linked",
      description: "For developer and software engineering positions, providing a GitHub link demonstrates real code samples.",
      fix: "Add your active GitHub profile link in the contact section."
    })
    atsScore -= 4
  }

  // 2. Evaluate Professional Summary
  if (header.summary.length < 120) {
    weakSections.push({
      category: "Professional Summary",
      severity: "high",
      title: "Summary is Too Brief & Generic",
      issue: "Your summary doesn't showcase key technical competencies or quantifiable career accomplishments.",
      impact: "Recruiters spend an average of 6 seconds per resume; a weak summary fails to hook attention.",
      suggestion: "Expand your summary with your primary domain, years of experience, top technical stack, and a major impact milestone."
    })
    impactScore -= 12
  } else if (!/\d+/.test(header.summary)) {
    weakSections.push({
      category: "Professional Summary",
      severity: "medium",
      title: "Summary Lacks Quantifiable Metrics",
      issue: "No numbers, percentages, or measurable indicators found in your introductory profile.",
      impact: "Reduces credibility and fails to communicate the real business scale you operated at.",
      suggestion: "Add metrics such as '5+ years experience', 'scaled apps to 200k+ users', or 'improved throughput by 40%'."
    })
    impactScore -= 8
  } else {
    strongSections.push({
      category: "Professional Summary",
      score: 88,
      title: "Strong Professional Positioning",
      description: "Your summary clearly establishes your engineering discipline, core technologies, and active focus areas.",
      highlights: [
        "Clearly mentions 5+ years of experience",
        "Highlights key stack: React, Node.js, and cloud architecture",
        "Demonstrates forward-looking curiosity in AI and Web3"
      ]
    })
  }

  // Provide Summary Improvement Item
  improvements.push({
    id: "imp-summary",
    section: "summary",
    title: "Transform Summary with Leadership & Metrics Hook",
    before: header.summary,
    after: `Results-driven ${header.title} with 5+ years of production experience architecting high-scale distributed systems and responsive modern web applications. Proven track record reducing system latency by 40% and leading engineering teams across React 19, Next.js, TypeScript, and AWS cloud infrastructure. Passionate about AI-agent workflows and high-impact developer tooling.`,
    rationale: "Injects authoritative power verbs, quantifies career impact, and matches primary ATS filters for senior engineering roles.",
    impact: "+14 ATS points, 2.5x higher interview callback rate",
    applied: false
  })

  // 3. Evaluate Work Experience & Bullet Points
  let totalBullets = 0
  let metricBullets = 0
  let weakVerbBullets = 0

  const weakVerbs = ["worked with", "responsible for", "helped", "assisted", "managed a team", "fixed", "built"]
  const powerVerbs = ["Architected", "Spearheaded", "Engineered", "Streamlined", "Accelerated", "Optimized", "Scaled"]

  resume.experience.forEach((exp) => {
    exp.bullets.forEach((bullet, bIdx) => {
      totalBullets++
      const lower = bullet.toLowerCase()
      if (/\d+%|\$\d+|\d+\+|\d+x/.test(bullet)) {
        metricBullets++
      }
      if (weakVerbs.some(wv => lower.startsWith(wv) || lower.includes("worked with"))) {
        weakVerbBullets++
      }

      // Generate specific bullet improvements
      if (bIdx === 0 && exp.id === "exp-1") {
        improvements.push({
          id: `imp-exp1-b0`,
          section: "experience",
          targetId: exp.id,
          bulletIndex: 0,
          title: "Upgrade Microservices Lead Bullet to Quantified Impact",
          before: bullet,
          after: "Architected and deployed 12+ fault-tolerant microservices on AWS EKS using Node.js and TypeScript, handling 45,000+ daily peak transactions with 99.98% uptime.",
          rationale: "Replaces vague statement 'Led the development' with specific technologies, scale, and uptime reliability metrics.",
          impact: "Demonstrates high-scale system ownership and cloud proficiency.",
          applied: false
        })
      }

      if (bIdx === 1 && exp.id === "exp-2") {
        improvements.push({
          id: `imp-exp2-b1`,
          section: "experience",
          targetId: exp.id,
          bulletIndex: 1,
          title: "Sharpen Frontend Architecture Bullet",
          before: bullet,
          after: "Spearheaded design system implementation with reusable accessible React 18 & TypeScript components, slashing UI sprint cycle times by 35% across 4 squads.",
          rationale: "Elevates routine collaboration into cross-team design system leadership with measurable sprint acceleration.",
          impact: "Highlights design-to-code efficiency and team-wide productivity boost.",
          applied: false
        })
      }
    })
  })

  if (metricBullets < 2) {
    weakSections.push({
      category: "Work Experience",
      severity: "high",
      title: "Missing Key Quantifiable Results in Experience",
      issue: "Most bullet points describe responsibilities rather than business accomplishments and numbers.",
      impact: "Applicant tracking systems and senior hiring managers prioritize measurable ROI over task lists.",
      suggestion: "Use the Google XYZ Formula: Accomplished [X] as measured by [Y] by doing [Z]."
    })
    impactScore -= 14
  } else {
    strongSections.push({
      category: "Work Experience",
      score: 86,
      title: "Quantified Performance Improvements",
      description: "Demonstrates tangible results like 'improved system performance by 40%' in recent roles.",
      highlights: [
        "Includes explicit 40% performance gain metric",
        "Mentions leadership and mentorship of 4 junior engineers",
        "Covers both frontend user interfaces and backend microservices"
      ]
    })
  }

  if (weakVerbBullets > 0) {
    missingOrErrors.push({
      id: "err-passive-verbs",
      type: "error",
      title: "Passive / Weak Action Verbs Detected",
      description: `Detected ${weakVerbBullets} bullet points beginning with passive phrases like 'Worked with' or 'Led'.`,
      fix: `Replace with high-impact power verbs such as: ${powerVerbs.slice(0, 4).join(", ")}.`
    })
    overallScore -= 6
  }

  // 4. Evaluate Technical Skills
  const skillsCount = resume.skills.length
  if (skillsCount < 6) {
    weakSections.push({
      category: "Technical Skills",
      severity: "medium",
      title: "Skill Stack Under-Represented",
      issue: "Fewer than 6 skills listed. ATS scanners search for specific keyword density for target roles.",
      impact: "May fail initial automated resume filters for senior engineering roles.",
      suggestion: "Add cloud, database, DevOps, testing, and modern framework skills."
    })
    skillsScore -= 15
  } else {
    strongSections.push({
      category: "Technical Skills",
      score: 92,
      title: "Comprehensive Modern Web Stack",
      description: "Excellent representation of modern, high-demand web technologies.",
      highlights: [
        "Core React & Next.js ecosystem proficiency",
        "TypeScript for enterprise code reliability",
        "Full stack breadth spanning PostgreSQL, Node.js, and AWS"
      ]
    })
  }

  // Suggest categorizing skills
  improvements.push({
    id: "imp-skills-categorization",
    section: "skills",
    title: "Categorize Skills into Frontend, Backend, Cloud & Tools",
    before: resume.skills.join(", "),
    after: "Frontend: React, Next.js, TypeScript, Tailwind CSS, Redux | Backend: Node.js, Express, GraphQL, PostgreSQL, REST APIs | Cloud & DevOps: AWS (S3, EKS), Docker, CI/CD, Git | Architecture: Microservices, System Design, Agile",
    rationale: "Categorized skills help technical recruiters and ATS algorithms instantly match role requirements by specialty.",
    impact: "+10 ATS ranking boost",
    applied: false
  })

  // 5. Evaluate Education
  if (resume.education.length > 0) {
    strongSections.push({
      category: "Education",
      score: 95,
      title: "Accredited Computer Science Degree",
      description: "University of California, Berkeley Computer Science degree provides strong academic credibility.",
      highlights: [
        "Standard degree title recognized by all ATS scanners",
        "Top-tier institution credentials",
        "Clean graduation date formatting"
      ]
    })
  }

  // Determine Top 3 Recommended Jobs
  const jobMatches = matchJobsForResume(resume, DUMMY_JOBS)
  const top3Jobs = jobMatches.top3
  const recommendedJobIds = top3Jobs.map(j => j.id)

  // Overall calculations
  const finalOverall = Math.min(98, Math.max(55, Math.round((atsScore + impactScore + brevityScore + skillsScore) / 4)))

  return {
    overallScore: finalOverall,
    atsScore,
    impactScore,
    brevityScore,
    skillsScore,
    keySummary: `Your resume shows strong technical fundamentals and clear career progression as a ${resume.header.title}. However, it currently under-communicates your true business impact due to passive action verbs, missing metrics on 2 bullet points, and uncategorized skills. Applying our AI improvements will increase your ATS score to 95+.`,
    strongSections,
    weakSections,
    missingOrErrors,
    improvements,
    recommendedJobIds,
    targetRoles: [
      "Senior Full Stack Engineer",
      "Lead Frontend Architect",
      "AI Application Engineer",
      "Cloud Software Engineer"
    ],
    analyzedAt: new Date().toISOString()
  }
}

/**
 * Creates an optimized version (v2) considering the points found during analysis.
 */
export function createImprovedResume(
  originalResume: ResumeData, 
  feedback: AnalysisFeedback
): { improvedResume: ResumeData; newFeedback: AnalysisFeedback } {
  const newVersionNumber = originalResume.versionNumber + 1
  const versionName = `v${newVersionNumber} - AI Optimized (Score 95)`

  const improvedHeader = {
    ...originalResume.header,
    summary: `Results-driven Senior Full Stack Developer with 5+ years of experience architecting high-scale distributed systems and modern web applications. Proven track record reducing system latency by 40% and leading engineering teams across React 19, Next.js, TypeScript, Node.js, and AWS cloud infrastructure. Experienced in building agentic AI interfaces and resilient microservices.`,
    linkedin: originalResume.header.linkedin || "https://linkedin.com/in/johndoe",
    github: originalResume.header.github || "https://github.com/johndoe"
  }

  const improvedSkills = [
    "React 19", "Next.js 15", "TypeScript", "Node.js", "Tailwind CSS",
    "PostgreSQL", "GraphQL", "AWS (EKS, S3, CloudWatch)", "Docker",
    "Redis", "Microservices", "REST APIs", "CI/CD Pipelines", "Jest/Vitest"
  ]

  const improvedExperience = originalResume.experience.map((exp, idx) => {
    if (idx === 0) {
      return {
        ...exp,
        bullets: [
          "Architected and deployed 12+ fault-tolerant microservices on AWS EKS with Node.js and TypeScript, handling 45,000+ daily peak transactions with 99.98% uptime.",
          "Spearheaded database query optimization and Redis caching layer, reducing API p95 response latency by 40% and cutting cloud infrastructure expenses by $18,000 annually.",
          "Mentored and led 4 junior developers through rigorous code reviews, automated CI/CD pipeline adoption, and comprehensive test coverage (88%+)."
        ]
      }
    } else if (idx === 1) {
      return {
        ...exp,
        bullets: [
          "Engineered responsive, accessible enterprise dashboards in React 18, Redux Toolkit, and Tailwind CSS, increasing daily active user engagement by 28%.",
          "Spearheaded design system implementation with 30+ reusable components, reducing feature delivery cycles by 35% across 3 autonomous squads.",
          "Identified and eliminated critical client-side memory leaks, accelerating initial page load (LCP) from 3.2s to 1.1s."
        ]
      }
    }
    return exp
  })

  const improvedResume: ResumeData = {
    ...originalResume,
    id: `resume-v${newVersionNumber}`,
    versionNumber: newVersionNumber,
    versionName,
    updatedAt: new Date().toISOString(),
    header: improvedHeader,
    skills: improvedSkills,
    experience: improvedExperience
  }

  // Recalculate enhanced feedback for the improved resume
  const newFeedback: AnalysisFeedback = {
    overallScore: 95,
    atsScore: 96,
    impactScore: 94,
    brevityScore: 92,
    skillsScore: 97,
    keySummary: "Outstanding! This version addresses all previous weaknesses: bullet points feature quantified ROI, active power verbs are used consistently, high-demand skills are categorized, and contact links are fully verified.",
    strongSections: [
      {
        category: "Quantified Impact",
        score: 96,
        title: "Exceptional Metrics & Business Scale",
        description: "Every single bullet point includes measurable accomplishments (40% latency reduction, 45k+ peak transactions, $18k savings, 35% faster cycles).",
        highlights: [
          "Includes financial ROI ($18,000 annual cloud savings)",
          "Includes performance metrics (p95 latency reduced by 40%, LCP 1.1s)",
          "Demonstrates team mentorship and 88%+ test coverage"
        ]
      },
      {
        category: "ATS Optimization & Keywords",
        score: 97,
        title: "Target Keyword Alignment",
        description: "Matches over 94% of keywords sought in Senior Full Stack and AI Engineer job descriptions.",
        highlights: [
          "Modern stack: React 19, Next.js 15, TypeScript, Docker, Redis",
          "Clean standard ATS-friendly heading and section markers",
          "Verified contact and professional repository links"
        ]
      },
      {
        category: "Professional Summary",
        score: 95,
        title: "High-Converting Value Proposition",
        description: "Hooks recruiters within 3 seconds by emphasizing years of experience, core tech stack, and verified latency results.",
        highlights: [
          "Directly addresses hiring managers' core requirements",
          "Highlights both architectural leadership and hands-on coding"
        ]
      }
    ],
    weakSections: [],
    missingOrErrors: [],
    improvements: feedback.improvements.map(imp => ({ ...imp, applied: true })),
    recommendedJobIds: feedback.recommendedJobIds,
    targetRoles: feedback.targetRoles,
    analyzedAt: new Date().toISOString()
  }

  return { improvedResume, newFeedback }
}

/**
 * Match 20 jobs against resume skills, title, and experience.
 * Returns the top 3 best matching jobs along with match percentages.
 */
export function matchJobsForResume(resume: ResumeData, jobs: Job[]): { top3: Job[]; scoredJobs: Job[] } {
  const resumeSkillsLower = resume.skills.map(s => s.toLowerCase())
  const resumeTitleLower = resume.header.title.toLowerCase()
  const resumeSummaryLower = resume.header.summary.toLowerCase()

  const scored = jobs.map(job => {
    let score = 50 // baseline

    // Skill matches
    const matchedSkills: string[] = []
    job.tags.forEach(tag => {
      const tagLower = tag.toLowerCase()
      if (resumeSkillsLower.some(rs => rs.includes(tagLower) || tagLower.includes(rs))) {
        score += 8
        matchedSkills.push(tag)
      } else if (resumeSummaryLower.includes(tagLower)) {
        score += 4
        matchedSkills.push(tag)
      }
    })

    // Title / Domain matches
    if (job.category === "Full Stack" && (resumeTitleLower.includes("full stack") || resumeTitleLower.includes("developer"))) {
      score += 15
    } else if (job.category === "Frontend" && (resumeTitleLower.includes("frontend") || resumeTitleLower.includes("react"))) {
      score += 15
    } else if (job.category === "AI/ML" && (resumeSummaryLower.includes("ai") || resumeSkillsLower.some(s => s.includes("ai") || s.includes("python")))) {
      score += 14
    } else if (job.category === "Backend" && (resumeSkillsLower.some(s => s.includes("node") || s.includes("sql")))) {
      score += 10
    }

    // Cap score at 97
    const finalScore = Math.min(97, Math.max(58, score))

    // Formulate custom match reasons
    const reasons: string[] = []
    if (matchedSkills.length > 0) {
      reasons.push(`Matches ${matchedSkills.length} key skills: ${matchedSkills.slice(0, 3).join(", ")}`)
    }
    if (job.experience.includes("Senior") && (resumeTitleLower.includes("senior") || resumeSummaryLower.includes("5+ years"))) {
      reasons.push("Matches your Senior-level background and technical seniority")
    } else if (job.workplaceType === "Remote") {
      reasons.push("100% Remote flexibility matching your profile preference")
    }

    return {
      ...job,
      matchScore: finalScore,
      matchReasons: reasons.length > 0 ? reasons : job.matchReasons
    }
  })

  // Sort descending by match score
  scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

  // Pick top 3
  const top3 = scored.slice(0, 3)

  return { top3, scoredJobs: scored }
}
