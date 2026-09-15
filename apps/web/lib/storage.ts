"use client"

import { ResumeData } from "./resume-types"
import { EMPTY_RESUME, DEFAULT_RESUME } from "./resume-analyzer"

export interface ProfileExperience {
  id: number | string
  role: string
  company: string
  companyColor?: string
  location?: string
  dates: string
  description: string
  isInternship?: boolean
}

export interface ProfileEducation {
  id: number | string
  degree: string
  school: string
  stream?: string
  dates: string
  performance?: string
}

export interface ProfileProject {
  id: number | string
  name: string
  techStack: string[]
  link?: string
  dates?: string
  description: string
}

export interface ProfileTraining {
  id: number | string
  program: string
  organization: string
  dates?: string
  credentialUrl?: string
  description?: string
}

export interface ProfileResponsibility {
  id: number | string
  title: string
  organization?: string
  description: string
}

export interface ProfileAccomplishment {
  id: number | string
  title: string
  description: string
}

export interface ProfileSkillItem {
  id?: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced"
}

export interface ProfileData {
  name: string
  title: string
  location: string
  company: string
  about: string
  experience: ProfileExperience[]
  internships: ProfileExperience[]
  education: ProfileEducation[]
  projects: ProfileProject[]
  trainings: ProfileTraining[]
  responsibilities: ProfileResponsibility[]
  accomplishments: ProfileAccomplishment[]
  skillsList: ProfileSkillItem[]
  personal: {
    email: string
    phone: string
    portfolio: string
    github?: string
    linkedin?: string
    city?: string
  }
  skills: string
  syncedWithResumeId?: string
  lastSyncedAt?: string
}

export const EMPTY_PROFILE: ProfileData = {
  name: "",
  title: "",
  location: "",
  company: "",
  about: "",
  education: [],
  experience: [],
  internships: [],
  projects: [],
  skillsList: [],
  trainings: [],
  responsibilities: [],
  accomplishments: [],
  personal: {
    email: "",
    phone: "",
    portfolio: "",
    github: "",
    linkedin: "",
    city: ""
  },
  skills: ""
}

export const DEFAULT_PROFILE: ProfileData = EMPTY_PROFILE

const STORAGE_KEYS = {
  PROFILE: "oasian_profile_data",
  CURRENT_RESUME: "oasian_current_resume",
  RESUME_VERSIONS: "oasian_resume_versions",
  SAVED_JOBS: "oasian_saved_jobs",
  APPLIED_JOBS: "oasian_applied_jobs"
}

export interface ProfileCompletenessResult {
  score: number
  isComplete: boolean
  hasName: boolean
  missingItems: Array<{ id: string; label: string; actionModal?: string }>
}

export function calculateProfileCompleteness(profile: ProfileData): ProfileCompletenessResult {
  const missingItems: Array<{ id: string; label: string; actionModal?: string }> = []
  let score = 0

  const hasName = Boolean(profile.name && profile.name.trim().length > 0)
  if (hasName) {
    score += 20
  } else {
    missingItems.push({ id: "name", label: "Full Name", actionModal: "header" })
  }

  const hasTitle = Boolean(profile.title && profile.title.trim().length > 0)
  if (hasTitle) {
    score += 15
  } else {
    missingItems.push({ id: "title", label: "Professional Title / Role", actionModal: "header" })
  }

  const hasContact = Boolean(
    profile.personal?.email ||
    profile.personal?.phone ||
    profile.location ||
    profile.personal?.city
  )
  if (hasContact) {
    score += 15
  } else {
    missingItems.push({ id: "contact", label: "Contact Details & City", actionModal: "personal" })
  }

  const hasEducation = Boolean(profile.education && profile.education.length > 0)
  if (hasEducation) {
    score += 15
  } else {
    missingItems.push({ id: "education", label: "Academics / Education", actionModal: "education" })
  }

  const hasExperienceOrProjects = Boolean(
    (profile.experience && profile.experience.length > 0) ||
    (profile.internships && profile.internships.length > 0) ||
    (profile.projects && profile.projects.length > 0)
  )
  if (hasExperienceOrProjects) {
    score += 20
  } else {
    missingItems.push({ id: "experience", label: "Work Experience or Projects", actionModal: "job" })
  }

  const skillsCount =
    profile.skillsList?.length ||
    profile.skills?.split(",").map(s => s.trim()).filter(Boolean).length ||
    0
  if (skillsCount >= 2) {
    score += 15
  } else {
    missingItems.push({ id: "skills", label: "Skills (add at least 2)", actionModal: "skill" })
  }

  return {
    score: Math.min(100, score),
    isComplete: score >= 80,
    hasName,
    missingItems
  }
}

export function getStoredProfile(): ProfileData {
  if (typeof window === "undefined") return EMPTY_PROFILE
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE)
    if (!raw) return EMPTY_PROFILE
    const parsed = JSON.parse(raw)

    // Automatically purge legacy "John Doe" placeholder data from previous builds
    if (parsed.name === "John Doe" && parsed.personal?.email === "john.doe@example.com") {
      localStorage.removeItem(STORAGE_KEYS.PROFILE)
      return EMPTY_PROFILE
    }

    return {
      name: parsed.name || "",
      title: parsed.title || "",
      location: parsed.location || "",
      company: parsed.company || "",
      about: parsed.about || "",
      education: Array.isArray(parsed.education) ? parsed.education : [],
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      internships: Array.isArray(parsed.internships) ? parsed.internships : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      trainings: Array.isArray(parsed.trainings) ? parsed.trainings : [],
      responsibilities: Array.isArray(parsed.responsibilities) ? parsed.responsibilities : [],
      accomplishments: Array.isArray(parsed.accomplishments) ? parsed.accomplishments : [],
      skillsList: Array.isArray(parsed.skillsList) ? parsed.skillsList : [],
      personal: {
        email: parsed.personal?.email || "",
        phone: parsed.personal?.phone || "",
        portfolio: parsed.personal?.portfolio || "",
        github: parsed.personal?.github || "",
        linkedin: parsed.personal?.linkedin || "",
        city: parsed.personal?.city || ""
      },
      skills: parsed.skills || "",
      syncedWithResumeId: parsed.syncedWithResumeId,
      lastSyncedAt: parsed.lastSyncedAt
    }
  } catch {
    return EMPTY_PROFILE
  }
}

export function saveStoredProfile(profile: ProfileData): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile))
    window.dispatchEvent(new Event("oasian-profile-updated"))
  } catch (e) {
    console.error("Failed to save profile:", e)
  }
}

export function getStoredResume(): ResumeData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_RESUME)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Automatically purge legacy "John Doe" mock placeholder
    if (parsed?.header?.fullName === "John Doe" && parsed?.header?.email === "john.doe@example.com") {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_RESUME)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function saveStoredResume(resume: ResumeData): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_RESUME, JSON.stringify(resume))
    window.dispatchEvent(new Event("oasian-resume-updated"))
  } catch (e) {
    console.error("Failed to save resume:", e)
  }
}

export function getStoredResumeVersions(): ResumeData[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESUME_VERSIONS)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((p: any) => p?.header?.fullName !== "John Doe")
  } catch {
    return []
  }
}

export function saveStoredResumeVersions(versions: ResumeData[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEYS.RESUME_VERSIONS, JSON.stringify(versions))
  } catch (e) {
    console.error("Failed to save resume versions:", e)
  }
}

/**
 * Synchronize resume into the Profile Section
 */
export function syncResumeToProfile(resume: ResumeData): ProfileData {
  const currentProfile = getStoredProfile()
  
  const updatedProfile: ProfileData = {
    ...currentProfile,
    name: resume.header.fullName || currentProfile.name,
    title: resume.header.title || currentProfile.title,
    location: resume.header.location || currentProfile.location,
    company: resume.experience[0]?.company || currentProfile.company,
    about: resume.header.summary || currentProfile.about,
    personal: {
      ...currentProfile.personal,
      email: resume.header.email || currentProfile.personal.email,
      phone: resume.header.phone || currentProfile.personal.phone,
      portfolio: resume.header.portfolio || currentProfile.personal.portfolio,
      linkedin: resume.header.linkedin || currentProfile.personal.linkedin,
      github: resume.header.github || currentProfile.personal.github
    },
    skills: resume.skills.join(", "),
    skillsList: resume.skills.map(s => {
      const existing = currentProfile.skillsList?.find(item => item.name.toLowerCase() === s.toLowerCase())
      return {
        name: s,
        level: existing ? existing.level : "Intermediate"
      }
    }),
    experience: resume.experience.map((exp, idx) => ({
      id: exp.id || idx + 1,
      role: exp.role,
      company: exp.company,
      companyColor: idx === 0 ? "text-blue-600 dark:text-blue-400" : "text-foreground/80",
      location: exp.location,
      dates: exp.dates,
      description: exp.bullets.join(" ")
    })),
    education: resume.education.map((edu, idx) => ({
      id: edu.id || idx + 1,
      degree: edu.degree,
      school: edu.school,
      dates: edu.dates,
      performance: edu.gpa ? `GPA: ${edu.gpa}` : undefined
    })),
    projects: resume.projects.map((proj, idx) => ({
      id: proj.id || idx + 1,
      name: proj.name,
      techStack: proj.techStack,
      link: proj.link,
      description: proj.description
    })),
    trainings: resume.certifications.map((cert, idx) => ({
      id: idx + 1,
      program: cert,
      organization: "Verified Certificate",
      dates: "Completed"
    })),
    syncedWithResumeId: resume.versionName,
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  saveStoredProfile(updatedProfile)
  return updatedProfile
}

/**
 * Synchronize profile into a ResumeData object
 */
export function syncProfileToResume(profile: ProfileData): ResumeData {
  const currentResume = getStoredResume() || EMPTY_RESUME
  
  const combinedExperience = [
    ...profile.experience.map(exp => ({
      id: `exp-${exp.id}`,
      role: exp.role,
      company: exp.company,
      location: exp.location || profile.location,
      dates: exp.dates,
      current: exp.dates.toLowerCase().includes("present"),
      bullets: exp.description.split(".").map(b => b.trim()).filter(Boolean)
    })),
    ...(profile.internships || []).map(intern => ({
      id: `intern-${intern.id}`,
      role: `${intern.role} (Internship)`,
      company: intern.company,
      location: intern.location || profile.location,
      dates: intern.dates,
      current: intern.dates.toLowerCase().includes("present"),
      bullets: intern.description.split(".").map(b => b.trim()).filter(Boolean)
    }))
  ]

  const resumeFromProfile: ResumeData = {
    ...currentResume,
    id: `resume-from-profile-${Date.now()}`,
    versionName: "v1 - Synced from Profile",
    updatedAt: new Date().toISOString(),
    header: {
      fullName: profile.name,
      title: profile.title,
      email: profile.personal.email,
      phone: profile.personal.phone,
      location: profile.location,
      portfolio: profile.personal.portfolio,
      linkedin: profile.personal.linkedin || currentResume.header.linkedin,
      github: profile.personal.github || currentResume.header.github,
      summary: profile.about
    },
    skills: profile.skillsList?.length
      ? profile.skillsList.map(s => s.name)
      : profile.skills.split(",").map(s => s.trim()).filter(Boolean),
    experience: combinedExperience,
    education: profile.education.map(edu => ({
      id: `edu-${edu.id}`,
      degree: edu.degree,
      school: edu.school,
      location: profile.location,
      dates: edu.dates,
      gpa: edu.performance
    })),
    projects: (profile.projects || []).map(p => ({
      id: `proj-${p.id}`,
      name: p.name,
      description: p.description,
      techStack: p.techStack || [],
      link: p.link
    })),
    certifications: (profile.trainings || []).map(t => `${t.program} - ${t.organization}`)
  }

  saveStoredResume(resumeFromProfile)
  return resumeFromProfile
}

export function getSavedJobIds(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function toggleSaveJobId(jobId: string): string[] {
  const current = getSavedJobIds()
  const exists = current.includes(jobId)
  const updated = exists ? current.filter(id => id !== jobId) : [...current, jobId]
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(updated))
  }
  return updated
}

export interface JobApplication {
  jobId: string
  jobTitle: string
  company: string
  resumeVersion: string
  appliedAt: string
}

export function getJobApplications(): JobApplication[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addJobApplication(app: JobApplication): JobApplication[] {
  const current = getJobApplications()
  const filtered = current.filter(a => a.jobId !== app.jobId)
  const updated = [app, ...filtered]
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.APPLIED_JOBS, JSON.stringify(updated))
  }
  return updated
}
