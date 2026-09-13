"use client"

import { ResumeData } from "./resume-types"
import { DEFAULT_RESUME } from "./resume-analyzer"

export interface ProfileData {
  name: string
  title: string
  location: string
  company: string
  about: string
  experience: Array<{
    id: number
    role: string
    company: string
    companyColor: string
    dates: string
    description: string
  }>
  education: Array<{
    id: number
    degree: string
    school: string
    dates: string
  }>
  personal: {
    email: string
    phone: string
    portfolio: string
  }
  skills: string
  syncedWithResumeId?: string
  lastSyncedAt?: string
}

export const DEFAULT_PROFILE: ProfileData = {
  name: "John Doe",
  title: "Senior Full Stack Developer",
  location: "San Francisco, CA",
  company: "Oasian",
  about: "Passionate software engineer with over 5 years of experience building scalable web applications. I specialize in React, Node.js, and cloud architecture. I love participating in hackathons, learning new technologies, and contributing to open-source projects. Currently exploring the world of agentic AI and Web3.",
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
  ],
  personal: {
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    portfolio: "johndoe.dev"
  },
  skills: "React, Next.js, TypeScript, Node.js, Tailwind CSS, GraphQL, PostgreSQL, AWS"
}

const STORAGE_KEYS = {
  PROFILE: "oasian_profile_data",
  CURRENT_RESUME: "oasian_current_resume",
  RESUME_VERSIONS: "oasian_resume_versions",
  SAVED_JOBS: "oasian_saved_jobs",
  APPLIED_JOBS: "oasian_applied_jobs"
}

export function getStoredProfile(): ProfileData {
  if (typeof window === "undefined") return DEFAULT_PROFILE
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE)
    if (!raw) return DEFAULT_PROFILE
    return JSON.parse(raw)
  } catch {
    return DEFAULT_PROFILE
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

export function getStoredResume(): ResumeData {
  if (typeof window === "undefined") return DEFAULT_RESUME
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_RESUME)
    if (!raw) return DEFAULT_RESUME
    return JSON.parse(raw)
  } catch {
    return DEFAULT_RESUME
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
  if (typeof window === "undefined") return [DEFAULT_RESUME]
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESUME_VERSIONS)
    if (!raw) return [DEFAULT_RESUME]
    return JSON.parse(raw)
  } catch {
    return [DEFAULT_RESUME]
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
      email: resume.header.email || currentProfile.personal.email,
      phone: resume.header.phone || currentProfile.personal.phone,
      portfolio: resume.header.portfolio || currentProfile.personal.portfolio
    },
    skills: resume.skills.join(", "),
    experience: resume.experience.map((exp, idx) => ({
      id: idx + 1,
      role: exp.role,
      company: exp.company,
      companyColor: idx === 0 ? "text-blue-600 dark:text-blue-400" : "text-foreground/80",
      dates: exp.dates,
      description: exp.bullets.join(" ")
    })),
    education: resume.education.map((edu, idx) => ({
      id: idx + 1,
      degree: edu.degree,
      school: edu.school,
      dates: edu.dates
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
  const currentResume = getStoredResume()
  
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
      linkedin: currentResume.header.linkedin,
      github: currentResume.header.github,
      summary: profile.about
    },
    skills: profile.skills.split(",").map(s => s.trim()).filter(Boolean),
    experience: profile.experience.map(exp => ({
      id: `exp-${exp.id}`,
      role: exp.role,
      company: exp.company,
      location: profile.location,
      dates: exp.dates,
      current: exp.dates.toLowerCase().includes("present"),
      bullets: exp.description.split(".").map(b => b.trim()).filter(Boolean)
    })),
    education: profile.education.map(edu => ({
      id: `edu-${edu.id}`,
      degree: edu.degree,
      school: edu.school,
      location: profile.location,
      dates: edu.dates
    }))
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
