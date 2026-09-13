export interface ResumeHeader {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  portfolio: string
  linkedin: string
  github: string
  summary: string
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  location: string
  dates: string
  current: boolean
  bullets: string[]
}

export interface EducationItem {
  id: string
  degree: string
  school: string
  location: string
  dates: string
  gpa?: string
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  techStack: string[]
  link?: string
}

export interface ResumeData {
  id: string
  versionNumber: number
  versionName: string
  header: ResumeHeader
  skills: string[]
  experience: ExperienceItem[]
  education: EducationItem[]
  projects: ProjectItem[]
  certifications: string[]
  updatedAt: string
}

export interface SectionScore {
  category: string
  score: number
  title: string
  description: string
  highlights: string[]
}

export interface WeakSection {
  category: string
  severity: "high" | "medium" | "low"
  title: string
  issue: string
  impact: string
  suggestion: string
}

export interface MissingOrError {
  id: string
  type: "missing" | "error" | "warning"
  title: string
  description: string
  fix: string
}

export interface ImprovementItem {
  id: string
  section: "summary" | "experience" | "skills" | "header" | "projects"
  targetId?: string
  bulletIndex?: number
  title: string
  before: string
  after: string
  rationale: string
  impact: string
  applied: boolean
}

export interface AnalysisFeedback {
  overallScore: number
  atsScore: number
  impactScore: number
  brevityScore: number
  skillsScore: number
  keySummary: string
  strongSections: SectionScore[]
  weakSections: WeakSection[]
  missingOrErrors: MissingOrError[]
  improvements: ImprovementItem[]
  recommendedJobIds: string[]
  targetRoles: string[]
  analyzedAt: string
}

export interface Job {
  id: string
  title: string
  company: string
  companyLogo: string
  companyColor: string
  location: string
  workplaceType: "Remote" | "Hybrid" | "On-site"
  jobType: "Full-time" | "Contract" | "Internship" | "Part-time"
  salary: string
  experience: string
  category: "Full Stack" | "Frontend" | "Backend" | "AI/ML" | "DevOps/Cloud" | "Mobile" | "Design/Product"
  tags: string[]
  matchScore?: number
  matchReasons?: string[]
  postedDate: string
  featured?: boolean
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  department: string
  applicantCount: number
}
