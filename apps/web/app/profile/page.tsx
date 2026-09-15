"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@workspace/ui/components/button"
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Award,
  BookOpen,
  Globe,
  Code2,
  Users,
  User,
  Building2,
  Zap,
  Printer,
  FileText
} from "lucide-react"
import {
  getStoredProfile,
  saveStoredProfile,
  syncProfileToResume,
  getStoredResume,
  ProfileData,
  ProfileEducation,
  ProfileExperience,
  ProfileProject,
  ProfileTraining,
  ProfileResponsibility,
  ProfileAccomplishment,
  ProfileSkillItem
} from "@/lib/storage"

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

type ModalType =
  | "header"
  | "personal"
  | "education"
  | "job"
  | "internship"
  | "project"
  | "training"
  | "responsibility"
  | "accomplishment"
  | "skill"
  | null

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData>(getStoredProfile())
  const [resumeVersionName, setResumeVersionName] = useState<string>("v1 - Original")
  const [syncToast, setSyncToast] = useState<{ message: string; type?: "success" | "info" } | null>(null)

  // Modal states
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Delete confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    section: string
    index: number
    title: string
  } | null>(null)

  // Temporary form states for modals
  const [headerForm, setHeaderForm] = useState({
    name: "",
    title: "",
    location: "",
    company: "",
    about: ""
  })

  const [personalForm, setPersonalForm] = useState({
    email: "",
    phone: "",
    city: "",
    portfolio: "",
    github: "",
    linkedin: ""
  })

  const [educationForm, setEducationForm] = useState<ProfileEducation>({
    id: "",
    degree: "",
    school: "",
    stream: "",
    dates: "",
    performance: ""
  })

  const [jobForm, setJobForm] = useState<ProfileExperience>({
    id: "",
    role: "",
    company: "",
    location: "",
    dates: "",
    description: "",
    isInternship: false
  })

  const [internshipForm, setInternshipForm] = useState<ProfileExperience>({
    id: "",
    role: "",
    company: "",
    location: "",
    dates: "",
    description: "",
    isInternship: true
  })

  const [projectForm, setProjectForm] = useState<{
    id: string | number
    name: string
    techStackText: string
    link: string
    dates: string
    description: string
  }>({
    id: "",
    name: "",
    techStackText: "",
    link: "",
    dates: "",
    description: ""
  })

  const [trainingForm, setTrainingForm] = useState<ProfileTraining>({
    id: "",
    program: "",
    organization: "",
    dates: "",
    credentialUrl: "",
    description: ""
  })

  const [responsibilityForm, setResponsibilityForm] = useState<ProfileResponsibility>({
    id: "",
    title: "",
    organization: "",
    description: ""
  })

  const [accomplishmentForm, setAccomplishmentForm] = useState<ProfileAccomplishment>({
    id: "",
    title: "",
    description: ""
  })

  const [skillForm, setSkillForm] = useState<ProfileSkillItem>({
    name: "",
    level: "Intermediate"
  })

  // Hydrate on mount & listen for sync events
  useEffect(() => {
    const loaded = getStoredProfile()
    setProfile(loaded)
    const storedResume = getStoredResume()
    if (storedResume?.versionName) {
      setResumeVersionName(storedResume.versionName)
    }

    // Attempt to load profile from Neon DB if logged in
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.profile) {
          const dbProf = data.profile
          setProfile((prev) => {
            const merged: ProfileData = {
              ...prev,
              name: dbProf.name || prev.name,
              title: dbProf.title || prev.title,
              location: dbProf.location || prev.location,
              company: dbProf.company || prev.company,
              about: dbProf.about || prev.about,
              personal: {
                ...prev.personal,
                email: dbProf.email || prev.personal?.email || "",
                phone: dbProf.phone || prev.personal?.phone || "",
                portfolio: dbProf.portfolio || prev.personal?.portfolio || "",
              },
              skills: Array.isArray(dbProf.skills) && dbProf.skills.length > 0 ? dbProf.skills.join(", ") : prev.skills,
              experience: Array.isArray(dbProf.experience) && dbProf.experience.length > 0 ? dbProf.experience : prev.experience,
              education: Array.isArray(dbProf.education) && dbProf.education.length > 0 ? dbProf.education : prev.education,
            }
            saveStoredProfile(merged)
            return merged
          })
        }
      })
      .catch(() => {})

    const handleProfileUpdate = () => {
      const updated = getStoredProfile()
      setProfile(updated)
      const res = getStoredResume()
      if (res?.versionName) {
        setResumeVersionName(res.versionName)
      }
    }

    window.addEventListener("oasian-profile-updated", handleProfileUpdate)
    return () => window.removeEventListener("oasian-profile-updated", handleProfileUpdate)
  }, [])

  useEffect(() => {
    if (syncToast) {
      const timer = setTimeout(() => setSyncToast(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [syncToast])

  // Profile Completeness calculation (Internshala Style)
  const completenessData = useMemo(() => {
    let score = 0
    const steps: { name: string; completed: boolean; points: number; actionModal: ModalType }[] = []

    // 1. Personal & Header info
    const hasPersonal = Boolean(
      profile.name &&
      profile.personal?.email &&
      profile.personal?.phone &&
      (profile.location || profile.personal?.city)
    )
    score += hasPersonal ? 15 : 5
    steps.push({
      name: "Contact Details",
      completed: hasPersonal,
      points: 15,
      actionModal: "personal"
    })

    // 2. Education
    const hasEdu = Boolean(profile.education && profile.education.length > 0)
    score += hasEdu ? 20 : 0
    steps.push({
      name: "Education (College/School)",
      completed: hasEdu,
      points: 20,
      actionModal: "education"
    })

    // 3. Work Experience / Internships
    const hasExp = Boolean(
      (profile.experience && profile.experience.length > 0) ||
      (profile.internships && profile.internships.length > 0)
    )
    score += hasExp ? 20 : 0
    steps.push({
      name: "Jobs & Internships",
      completed: hasExp,
      points: 20,
      actionModal: "internship"
    })

    // 4. Projects
    const hasProj = Boolean(profile.projects && profile.projects.length > 0)
    score += hasProj ? 15 : 0
    steps.push({
      name: "Projects & Work Samples",
      completed: hasProj,
      points: 15,
      actionModal: "project"
    })

    // 5. Skills
    const skillsCount = profile.skillsList?.length || profile.skills?.split(",").filter(Boolean).length || 0
    const hasSkills = skillsCount >= 3
    score += hasSkills ? 15 : skillsCount > 0 ? 8 : 0
    steps.push({
      name: "Skills (at least 3)",
      completed: hasSkills,
      points: 15,
      actionModal: "skill"
    })

    // 6. Portfolio / Social Links
    const hasLinks = Boolean(profile.personal?.github || profile.personal?.linkedin || profile.personal?.portfolio)
    score += hasLinks ? 10 : 0
    steps.push({
      name: "GitHub / Portfolio Links",
      completed: hasLinks,
      points: 10,
      actionModal: "personal"
    })

    // 7. Certifications or Accomplishments
    const hasBonus = Boolean(
      (profile.trainings && profile.trainings.length > 0) ||
      (profile.accomplishments && profile.accomplishments.length > 0)
    )
    score += hasBonus ? 5 : 0

    const clampedScore = Math.min(100, Math.max(10, score))
    
    let strengthLabel = "Beginner"
    let strengthColor = "text-amber-500"
    let barColor = "bg-amber-500"
    if (clampedScore >= 80) {
      strengthLabel = "All-Star (Excellent)"
      strengthColor = "text-emerald-500"
      barColor = "bg-emerald-500"
    } else if (clampedScore >= 50) {
      strengthLabel = "Intermediate"
      strengthColor = "text-blue-600 dark:text-blue-400"
      barColor = "bg-blue-600"
    }

    return {
      score: clampedScore,
      strengthLabel,
      strengthColor,
      barColor,
      steps: steps.filter(s => !s.completed)
    }
  }, [profile])

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setSyncToast({ message, type })
  }

  // Save profile helper
  const commitProfile = (updated: ProfileData, toastMsg: string) => {
    setProfile(updated)
    saveStoredProfile(updated)
    // Persist to Neon PostgreSQL via /api/profile
    fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch((err) => {
      console.warn("[ProfilePage] DB sync warning:", err)
    })
    showToast(toastMsg)
    closeModal()
  }

  const closeModal = () => {
    setActiveModal(null)
    setEditingIndex(null)
  }

  // Open Handlers
  const openHeaderModal = () => {
    setHeaderForm({
      name: profile.name || "",
      title: profile.title || "",
      location: profile.location || "",
      company: profile.company || "",
      about: profile.about || ""
    })
    setActiveModal("header")
  }

  const openPersonalModal = () => {
    setPersonalForm({
      email: profile.personal?.email || "",
      phone: profile.personal?.phone || "",
      city: profile.personal?.city || profile.location || "",
      portfolio: profile.personal?.portfolio || "",
      github: profile.personal?.github || "",
      linkedin: profile.personal?.linkedin || ""
    })
    setActiveModal("personal")
  }

  const openEducationModal = (index?: number) => {
    if (typeof index === "number" && profile.education[index]) {
      setEducationForm({ ...profile.education[index] })
      setEditingIndex(index)
    } else {
      setEducationForm({
        id: Date.now(),
        degree: "",
        school: "",
        stream: "",
        dates: "",
        performance: ""
      })
      setEditingIndex(null)
    }
    setActiveModal("education")
  }

  const openJobModal = (index?: number) => {
    if (typeof index === "number" && profile.experience[index]) {
      setJobForm({ ...profile.experience[index] })
      setEditingIndex(index)
    } else {
      setJobForm({
        id: Date.now(),
        role: "",
        company: "",
        location: "",
        dates: "",
        description: "",
        isInternship: false
      })
      setEditingIndex(null)
    }
    setActiveModal("job")
  }

  const openInternshipModal = (index?: number) => {
    if (typeof index === "number" && profile.internships?.[index]) {
      setInternshipForm({ ...profile.internships[index] })
      setEditingIndex(index)
    } else {
      setInternshipForm({
        id: Date.now(),
        role: "",
        company: "",
        location: "",
        dates: "",
        description: "",
        isInternship: true
      })
      setEditingIndex(null)
    }
    setActiveModal("internship")
  }

  const openProjectModal = (index?: number) => {
    if (typeof index === "number" && profile.projects?.[index]) {
      const proj = profile.projects[index]
      setProjectForm({
        id: proj.id,
        name: proj.name,
        techStackText: proj.techStack?.join(", ") || "",
        link: proj.link || "",
        dates: proj.dates || "",
        description: proj.description || ""
      })
      setEditingIndex(index)
    } else {
      setProjectForm({
        id: Date.now(),
        name: "",
        techStackText: "",
        link: "",
        dates: "",
        description: ""
      })
      setEditingIndex(null)
    }
    setActiveModal("project")
  }

  const openTrainingModal = (index?: number) => {
    if (typeof index === "number" && profile.trainings?.[index]) {
      setTrainingForm({ ...profile.trainings[index] })
      setEditingIndex(index)
    } else {
      setTrainingForm({
        id: Date.now(),
        program: "",
        organization: "",
        dates: "",
        credentialUrl: "",
        description: ""
      })
      setEditingIndex(null)
    }
    setActiveModal("training")
  }

  const openResponsibilityModal = (index?: number) => {
    if (typeof index === "number" && profile.responsibilities?.[index]) {
      setResponsibilityForm({ ...profile.responsibilities[index] })
      setEditingIndex(index)
    } else {
      setResponsibilityForm({
        id: Date.now(),
        title: "",
        organization: "",
        description: ""
      })
      setEditingIndex(null)
    }
    setActiveModal("responsibility")
  }

  const openAccomplishmentModal = (index?: number) => {
    if (typeof index === "number" && profile.accomplishments?.[index]) {
      setAccomplishmentForm({ ...profile.accomplishments[index] })
      setEditingIndex(index)
    } else {
      setAccomplishmentForm({
        id: Date.now(),
        title: "",
        description: ""
      })
      setEditingIndex(null)
    }
    setActiveModal("accomplishment")
  }

  const openSkillModal = () => {
    setSkillForm({
      name: "",
      level: "Intermediate"
    })
    setActiveModal("skill")
  }

  // Save Submit Handlers
  const handleSaveHeader = (e: React.FormEvent) => {
    e.preventDefault()
    const updated: ProfileData = {
      ...profile,
      name: headerForm.name.trim() || profile.name,
      title: headerForm.title.trim() || profile.title,
      location: headerForm.location.trim() || profile.location,
      company: headerForm.company.trim() || profile.company,
      about: headerForm.about.trim()
    }
    commitProfile(updated, "Basic details updated!")
  }

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault()
    const updated: ProfileData = {
      ...profile,
      location: personalForm.city.trim() || profile.location,
      personal: {
        ...profile.personal,
        email: personalForm.email.trim(),
        phone: personalForm.phone.trim(),
        city: personalForm.city.trim(),
        portfolio: personalForm.portfolio.trim(),
        github: personalForm.github.trim(),
        linkedin: personalForm.linkedin.trim()
      }
    }
    commitProfile(updated, "Contact & work links updated!")
  }

  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!educationForm.degree || !educationForm.school) return
    const list = [...(profile.education || [])]
    if (editingIndex !== null) {
      list[editingIndex] = educationForm
    } else {
      list.push(educationForm)
    }
    const updated: ProfileData = { ...profile, education: list }
    commitProfile(updated, "Education details saved!")
  }

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobForm.role || !jobForm.company) return
    const list = [...(profile.experience || [])]
    if (editingIndex !== null) {
      list[editingIndex] = jobForm
    } else {
      list.push(jobForm)
    }
    const updated: ProfileData = { ...profile, experience: list }
    commitProfile(updated, "Work experience saved!")
  }

  const handleSaveInternship = (e: React.FormEvent) => {
    e.preventDefault()
    if (!internshipForm.role || !internshipForm.company) return
    const list = [...(profile.internships || [])]
    if (editingIndex !== null) {
      list[editingIndex] = internshipForm
    } else {
      list.push(internshipForm)
    }
    const updated: ProfileData = { ...profile, internships: list }
    commitProfile(updated, "Internship experience saved!")
  }

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectForm.name) return
    const stacks = projectForm.techStackText
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)

    const newProj: ProfileProject = {
      id: projectForm.id || Date.now(),
      name: projectForm.name.trim(),
      techStack: stacks,
      link: projectForm.link.trim(),
      dates: projectForm.dates.trim(),
      description: projectForm.description.trim()
    }

    const list = [...(profile.projects || [])]
    if (editingIndex !== null) {
      list[editingIndex] = newProj
    } else {
      list.push(newProj)
    }
    const updated: ProfileData = { ...profile, projects: list }
    commitProfile(updated, "Project saved successfully!")
  }

  const handleSaveTraining = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trainingForm.program) return
    const list = [...(profile.trainings || [])]
    if (editingIndex !== null) {
      list[editingIndex] = trainingForm
    } else {
      list.push(trainingForm)
    }
    const updated: ProfileData = { ...profile, trainings: list }
    commitProfile(updated, "Training & certification saved!")
  }

  const handleSaveResponsibility = (e: React.FormEvent) => {
    e.preventDefault()
    if (!responsibilityForm.title) return
    const list = [...(profile.responsibilities || [])]
    if (editingIndex !== null) {
      list[editingIndex] = responsibilityForm
    } else {
      list.push(responsibilityForm)
    }
    const updated: ProfileData = { ...profile, responsibilities: list }
    commitProfile(updated, "Position of responsibility saved!")
  }

  const handleSaveAccomplishment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!accomplishmentForm.title) return
    const list = [...(profile.accomplishments || [])]
    if (editingIndex !== null) {
      list[editingIndex] = accomplishmentForm
    } else {
      list.push(accomplishmentForm)
    }
    const updated: ProfileData = { ...profile, accomplishments: list }
    commitProfile(updated, "Accomplishment saved!")
  }

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!skillForm.name.trim()) return
    const currentList = profile.skillsList ? [...profile.skillsList] : []
    // check duplicate
    if (currentList.some(s => s.name.toLowerCase() === skillForm.name.trim().toLowerCase())) {
      showToast("Skill already added!", "info")
      return
    }
    currentList.push({
      name: skillForm.name.trim(),
      level: skillForm.level
    })
    const updated: ProfileData = {
      ...profile,
      skillsList: currentList,
      skills: currentList.map(s => s.name).join(", ")
    }
    commitProfile(updated, `Added ${skillForm.name.trim()} to skills!`)
  }

  const handleRemoveSkill = (skillName: string) => {
    const currentList = (profile.skillsList || []).filter(s => s.name !== skillName)
    const updated: ProfileData = {
      ...profile,
      skillsList: currentList,
      skills: currentList.map(s => s.name).join(", ")
    }
    setProfile(updated)
    saveStoredProfile(updated)
    showToast(`Removed ${skillName}`)
  }

  // Delete Handlers
  const confirmDelete = (section: string, index: number, title: string) => {
    setDeleteConfirm({ section, index, title })
  }

  const executeDelete = () => {
    if (!deleteConfirm) return
    const { section, index } = deleteConfirm
    let updated = { ...profile }

    switch (section) {
      case "education":
        updated.education = profile.education.filter((_, i) => i !== index)
        break
      case "job":
        updated.experience = profile.experience.filter((_, i) => i !== index)
        break
      case "internship":
        updated.internships = (profile.internships || []).filter((_, i) => i !== index)
        break
      case "project":
        updated.projects = (profile.projects || []).filter((_, i) => i !== index)
        break
      case "training":
        updated.trainings = (profile.trainings || []).filter((_, i) => i !== index)
        break
      case "responsibility":
        updated.responsibilities = (profile.responsibilities || []).filter((_, i) => i !== index)
        break
      case "accomplishment":
        updated.accomplishments = (profile.accomplishments || []).filter((_, i) => i !== index)
        break
    }

    setProfile(updated)
    saveStoredProfile(updated)
    fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch(() => {})
    setDeleteConfirm(null)
    showToast("Entry removed successfully")
  }

  // Sync with AI Resume
  const handleAnalyzeProfileAsResume = () => {
    syncProfileToResume(profile)
    router.push("/resume")
  }

  // Print PDF
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-50/60 dark:bg-zinc-950 text-foreground print:bg-white print:text-black">
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* Floating Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-3 text-xs font-semibold text-white dark:text-slate-900 shadow-2xl border border-border animate-in slide-in-from-bottom-3 duration-200">
          <Check className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          {syncToast.message}
        </div>
      )}

      {/* Top Banner: Resume Engine Auto-Sync & Action Bar (Internshala / Oasian integration) */}
      <div className="border-b bg-white dark:bg-zinc-900/80 px-4 py-2.5 shadow-xs sm:px-6 lg:px-8 print:hidden">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <div className="text-muted-foreground">
              <span className="font-semibold text-foreground">Live Profile Resume:</span>{" "}
              Syncs with <span className="font-medium text-blue-600 dark:text-blue-400">{profile.syncedWithResumeId || resumeVersionName}</span>
              {profile.lastSyncedAt && ` • Updated at ${profile.lastSyncedAt}`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 gap-1.5 text-xs border-border bg-background hover:bg-muted"
            >
              <Printer className="h-3.5 w-3.5 text-muted-foreground" />
              Download / Print PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyzeProfileAsResume}
              className="h-8 gap-1.5 text-xs border-blue-200 bg-blue-50/50 text-blue-700 hover:bg-blue-100/70 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
            >
              <Zap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              AI Resume Score
            </Button>
            <Link href="/resume">
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
              >
                <FileText className="h-3.5 w-3.5" />
                Open Resume Builder
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 py-6 sm:py-8 print:p-0">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          {/* Section 1: Internshala Profile Completeness Bar */}
          <div className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-background p-5 shadow-xs dark:border-blue-900/40 dark:from-blue-950/20 dark:via-zinc-900 dark:to-zinc-900 print:hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-black text-white">
                    %
                  </span>
                  <h3 className="text-sm font-bold tracking-tight text-foreground sm:text-base">
                    Profile Strength:{" "}
                    <span className={completenessData.strengthColor}>
                      {completenessData.score}% • {completenessData.strengthLabel}
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground max-w-xl">
                  {completenessData.score >= 80 ? (
                    "Outstanding! Your profile is complete and stands out to top employers looking for talent."
                  ) : (
                    "Complete your profile to increase your chances of getting shortlisted for internships and full-time jobs by 3x!"
                  )}
                </p>
              </div>

              {/* Action suggestions pills */}
              {completenessData.steps.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground hidden lg:inline">
                    Suggestions:
                  </span>
                  {completenessData.steps.slice(0, 3).map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (step.actionModal === "education") openEducationModal()
                        else if (step.actionModal === "internship") openInternshipModal()
                        else if (step.actionModal === "project") openProjectModal()
                        else if (step.actionModal === "skill") openSkillModal()
                        else if (step.actionModal === "personal") openPersonalModal()
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 shadow-2xs hover:bg-blue-50 transition-colors dark:border-blue-800 dark:bg-zinc-800 dark:text-blue-300"
                    >
                      <Plus className="h-3 w-3" />
                      Add {step.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Visual Progress Track */}
            <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-zinc-800">
              <div
                className={`h-full transition-all duration-500 rounded-full ${completenessData.barColor}`}
                style={{ width: `${completenessData.score}%` }}
              />
            </div>
          </div>

          {/* Section 2: Internshala Main Resume Sheet Container */}
          <div className="rounded-2xl border border-slate-200 bg-card p-6 shadow-sm dark:border-zinc-800 sm:p-10 print:border-none print:p-0 print:shadow-none">
            
            {/* Header / Personal Details Card */}
            <div className="border-b pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Initials Avatar */}
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-md sm:h-24 sm:w-24 sm:text-3xl">
                    {profile.name && profile.name.trim() ? (
                      profile.name
                        .split(" ")
                        .filter(Boolean)
                        .map(w => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    ) : (
                      <User className="h-10 w-10 text-white/80" />
                    )}
                    <span className="absolute -bottom-1 -right-1 block h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900" />
                  </div>

                  {/* Name & Headline */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                        {profile.name || "Add Your Full Name"}
                      </h1>
                      <button
                        onClick={openHeaderModal}
                        aria-label="Edit Header"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-blue-600 transition-colors print:hidden"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-base font-medium text-muted-foreground">
                      {profile.title || "Add your professional title / role"}
                    </p>

                    {/* Contact Badges Row (Internshala Style) */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-foreground/90 font-medium">
                          {profile.personal?.email || "No email added"}
                        </span>
                      </span>

                      {profile.personal?.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{profile.personal.phone}</span>
                        </span>
                      )}

                      {(profile.location || profile.personal?.city) && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{profile.location || profile.personal?.city}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Header Action Buttons */}
                <div className="flex sm:flex-col items-end gap-2 print:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openPersonalModal}
                    className="h-8 gap-1.5 text-xs border-border hover:bg-muted"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                    Edit Contact & Links
                  </Button>
                </div>
              </div>

              {/* About Me / Professional Summary */}
              <div className="mt-5 rounded-xl bg-slate-50/70 dark:bg-zinc-900/60 p-4 border border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    About / Professional Summary
                  </span>
                  <button
                    onClick={openHeaderModal}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 inline-flex items-center gap-1 print:hidden"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                  {profile.about ||
                    "No bio added yet. Add a short professional summary to introduce your background and goals to recruiters."}
                </p>
              </div>
            </div>

            {/* INTERNSHALA STANDARDIZED SECTIONS */}
            <div className="divide-y divide-slate-200/80 dark:divide-zinc-800">
              
              {/* SECTION: ACADEMICS / EDUCATION */}
              <div className="py-6 sm:py-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-foreground">
                      Academics / Education
                    </h2>
                  </div>
                  <button
                    onClick={() => openEducationModal()}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 print:hidden cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add education
                  </button>
                </div>

                {profile.education && profile.education.length > 0 ? (
                  <div className="space-y-5">
                    {profile.education.map((edu, idx) => (
                      <div
                        key={edu.id || idx}
                        className="group relative flex flex-col sm:flex-row sm:items-start justify-between gap-2 rounded-xl p-3 sm:p-4 hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-zinc-800"
                      >
                        <div className="space-y-1">
                          <h3 className="text-sm sm:text-base font-bold text-foreground">
                            {edu.degree}
                          </h3>
                          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                            {edu.school} {edu.stream ? `• ${edu.stream}` : ""}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                            <span className="flex items-center gap-1 text-slate-500">
                              <Calendar className="h-3 w-3" />
                              {edu.dates}
                            </span>
                            {edu.performance && (
                              <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                                {edu.performance}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 pt-1 sm:pt-0 print:hidden">
                          <button
                            onClick={() => openEducationModal(idx)}
                            aria-label="Edit education"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete("education", idx, edu.degree)}
                            aria-label="Delete education"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No education added yet. Adding degrees and high school marks builds recruiter confidence.
                    </p>
                    <button
                      onClick={() => openEducationModal()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add education
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION: JOBS / WORK EXPERIENCE */}
              <div className="py-6 sm:py-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-foreground">
                      Jobs / Full-Time Experience
                    </h2>
                  </div>
                  <button
                    onClick={() => openJobModal()}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 print:hidden cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add job
                  </button>
                </div>

                {profile.experience && profile.experience.length > 0 ? (
                  <div className="space-y-6">
                    {profile.experience.map((job, idx) => (
                      <div
                        key={job.id || idx}
                        className="group relative flex flex-col sm:flex-row sm:items-start justify-between gap-2 rounded-xl p-3 sm:p-4 hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-zinc-800"
                      >
                        <div className="space-y-1.5 flex-1 pr-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-foreground">
                              {job.role}
                            </h3>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              @{job.company}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 text-slate-500">
                              <Calendar className="h-3 w-3" />
                              {job.dates}
                            </span>
                            {job.location && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </span>
                            )}
                          </div>

                          {job.description && (
                            <p className="pt-1 text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                              {job.description}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 pt-1 sm:pt-0 print:hidden">
                          <button
                            onClick={() => openJobModal(idx)}
                            aria-label="Edit job"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete("job", idx, job.role)}
                            aria-label="Delete job"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No full-time job added yet. You can add internships and projects below if you are a student or fresher.
                    </p>
                    <button
                      onClick={() => openJobModal()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add job
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION: INTERNSHIPS (Internshala's signature section) */}
              <div className="py-6 sm:py-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-foreground">
                      Internships
                    </h2>
                  </div>
                  <button
                    onClick={() => openInternshipModal()}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 print:hidden cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add internship
                  </button>
                </div>

                {profile.internships && profile.internships.length > 0 ? (
                  <div className="space-y-6">
                    {profile.internships.map((intern, idx) => (
                      <div
                        key={intern.id || idx}
                        className="group relative flex flex-col sm:flex-row sm:items-start justify-between gap-2 rounded-xl p-3 sm:p-4 hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-zinc-800"
                      >
                        <div className="space-y-1.5 flex-1 pr-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-foreground">
                              {intern.role}
                            </h3>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              @{intern.company}
                            </span>
                            <span className="rounded-full bg-blue-100 dark:bg-blue-950/70 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                              Internship
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1 text-slate-500">
                              <Calendar className="h-3 w-3" />
                              {intern.dates}
                            </span>
                            {intern.location && (
                              <span className="flex items-center gap-1 text-slate-500">
                                <MapPin className="h-3 w-3" />
                                {intern.location}
                              </span>
                            )}
                          </div>

                          {intern.description && (
                            <p className="pt-1 text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                              {intern.description}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 pt-1 sm:pt-0 print:hidden">
                          <button
                            onClick={() => openInternshipModal(idx)}
                            aria-label="Edit internship"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete("internship", idx, intern.role)}
                            aria-label="Delete internship"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No internships added yet. Showcasing internship experience significantly boosts employer response.
                    </p>
                    <button
                      onClick={() => openInternshipModal()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add internship
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION: ACADEMIC / PERSONAL PROJECTS */}
              <div className="py-6 sm:py-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-foreground">
                      Academic / Personal Projects
                    </h2>
                  </div>
                  <button
                    onClick={() => openProjectModal()}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 print:hidden cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add project
                  </button>
                </div>

                {profile.projects && profile.projects.length > 0 ? (
                  <div className="space-y-6">
                    {profile.projects.map((proj, idx) => (
                      <div
                        key={proj.id || idx}
                        className="group relative flex flex-col sm:flex-row sm:items-start justify-between gap-2 rounded-xl p-3 sm:p-4 hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-zinc-800"
                      >
                        <div className="space-y-1.5 flex-1 pr-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-foreground">
                              {proj.name}
                            </h3>
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                              >
                                Project Link
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>

                          {proj.dates && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {proj.dates}
                            </p>
                          )}

                          {proj.description && (
                            <p className="pt-0.5 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                              {proj.description}
                            </p>
                          )}

                          {proj.techStack && proj.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {proj.techStack.map((tech, i) => (
                                <span
                                  key={i}
                                  className="rounded-md bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-zinc-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 pt-1 sm:pt-0 print:hidden">
                          <button
                            onClick={() => openProjectModal(idx)}
                            aria-label="Edit project"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete("project", idx, proj.name)}
                            aria-label="Delete project"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No projects added yet. Hands-on coding projects or research papers highlight your practical abilities.
                    </p>
                    <button
                      onClick={() => openProjectModal()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add project
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION: SKILLS */}
              <div className="py-6 sm:py-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-foreground">
                      Skills
                    </h2>
                  </div>
                  <button
                    onClick={() => openSkillModal()}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 print:hidden cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add skill
                  </button>
                </div>

                {profile.skillsList && profile.skillsList.length > 0 ? (
                  <div className="flex flex-wrap gap-2.5">
                    {profile.skillsList.map((skill, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center gap-2 rounded-lg border border-slate-200/90 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-blue-400/70 shadow-2xs"
                      >
                        <span className="font-semibold">{skill.name}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            skill.level === "Advanced"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                              : skill.level === "Intermediate"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300"
                              : "bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {skill.level}
                        </span>
                        <button
                          onClick={() => handleRemoveSkill(skill.name)}
                          aria-label={`Remove skill ${skill.name}`}
                          className="text-muted-foreground hover:text-red-500 transition-colors ml-0.5 print:hidden"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : profile.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.split(",").map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No skills added yet. Add relevant technical and domain skills to match job descriptions.
                    </p>
                    <button
                      onClick={() => openSkillModal()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add skill
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION: TRAININGS / CERTIFICATIONS */}
              <div className="py-6 sm:py-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-foreground">
                      Trainings / Courses / Certifications
                    </h2>
                  </div>
                  <button
                    onClick={() => openTrainingModal()}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 print:hidden cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add training / certificate
                  </button>
                </div>

                {profile.trainings && profile.trainings.length > 0 ? (
                  <div className="space-y-5">
                    {profile.trainings.map((cert, idx) => (
                      <div
                        key={cert.id || idx}
                        className="group relative flex flex-col sm:flex-row sm:items-start justify-between gap-2 rounded-xl p-3 sm:p-4 hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-zinc-800"
                      >
                        <div className="space-y-1 flex-1 pr-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-foreground">
                              {cert.program}
                            </h3>
                            <span className="text-xs font-medium text-muted-foreground">
                              • {cert.organization}
                            </span>
                            {cert.credentialUrl && (
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                              >
                                View Certificate
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>

                          {cert.dates && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {cert.dates}
                            </p>
                          )}

                          {cert.description && (
                            <p className="pt-0.5 text-xs sm:text-sm text-foreground/80 leading-relaxed">
                              {cert.description}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 pt-1 sm:pt-0 print:hidden">
                          <button
                            onClick={() => openTrainingModal(idx)}
                            aria-label="Edit training"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete("training", idx, cert.program)}
                            aria-label="Delete training"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No certifications added. Online courses (Internshala, Coursera, AWS, Meta) validate domain expertise.
                    </p>
                    <button
                      onClick={() => openTrainingModal()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add training / certificate
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION: POSITIONS OF RESPONSIBILITY */}
              <div className="py-6 sm:py-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-foreground">
                      Positions of Responsibility
                    </h2>
                  </div>
                  <button
                    onClick={() => openResponsibilityModal()}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 print:hidden cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add position
                  </button>
                </div>

                {profile.responsibilities && profile.responsibilities.length > 0 ? (
                  <div className="space-y-5">
                    {profile.responsibilities.map((resp, idx) => (
                      <div
                        key={resp.id || idx}
                        className="group relative flex flex-col sm:flex-row sm:items-start justify-between gap-2 rounded-xl p-3 sm:p-4 hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-zinc-800"
                      >
                        <div className="space-y-1 flex-1 pr-4">
                          <h3 className="text-sm sm:text-base font-bold text-foreground">
                            {resp.title} {resp.organization ? `• ${resp.organization}` : ""}
                          </h3>
                          {resp.description && (
                            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                              {resp.description}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 pt-1 sm:pt-0 print:hidden">
                          <button
                            onClick={() => openResponsibilityModal(idx)}
                            aria-label="Edit responsibility"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete("responsibility", idx, resp.title)}
                            aria-label="Delete responsibility"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No leadership or club positions added yet. Mentioning student club roles or event organizing highlights leadership.
                    </p>
                    <button
                      onClick={() => openResponsibilityModal()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add position
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION: PORTFOLIO / WORK SAMPLES */}
              <div className="py-6 sm:py-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-foreground">
                      Portfolio / Work Samples
                    </h2>
                  </div>
                  <button
                    onClick={openPersonalModal}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 print:hidden cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit links
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* GitHub */}
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-3.5 bg-slate-50/40 dark:bg-zinc-900/30">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-foreground">
                      <GithubIcon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[11px] font-semibold text-muted-foreground">GitHub Profile</span>
                      {profile.personal?.github ? (
                        <a
                          href={profile.personal.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 truncate"
                        >
                          {profile.personal.github.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">Not linked</span>
                      )}
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-3.5 bg-slate-50/40 dark:bg-zinc-900/30">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                      <LinkedinIcon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[11px] font-semibold text-muted-foreground">LinkedIn Profile</span>
                      {profile.personal?.linkedin ? (
                        <a
                          href={profile.personal.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 truncate"
                        >
                          {profile.personal.linkedin.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">Not linked</span>
                      )}
                    </div>
                  </div>

                  {/* Portfolio Website */}
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 p-3.5 bg-slate-50/40 dark:bg-zinc-900/30">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[11px] font-semibold text-muted-foreground">Portfolio Website</span>
                      {profile.personal?.portfolio ? (
                        <a
                          href={profile.personal.portfolio.startsWith("http") ? profile.personal.portfolio : `https://${profile.personal.portfolio}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400 truncate"
                        >
                          {profile.personal.portfolio.replace(/^https?:\/\//, "")}
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">Not linked</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: ACCOMPLISHMENTS / AWARDS */}
              <div className="py-6 sm:py-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    <h2 className="text-sm sm:text-base font-bold tracking-wide uppercase text-foreground">
                      Accomplishments / Additional Details
                    </h2>
                  </div>
                  <button
                    onClick={() => openAccomplishmentModal()}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 print:hidden cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Add accomplishment
                  </button>
                </div>

                {profile.accomplishments && profile.accomplishments.length > 0 ? (
                  <div className="space-y-4">
                    {profile.accomplishments.map((acc, idx) => (
                      <div
                        key={acc.id || idx}
                        className="group relative flex flex-col sm:flex-row sm:items-start justify-between gap-2 rounded-xl p-3 sm:p-4 hover:bg-slate-50/80 dark:hover:bg-zinc-900/40 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-zinc-800"
                      >
                        <div className="space-y-1 flex-1 pr-4">
                          <h3 className="text-sm sm:text-base font-bold text-foreground">
                            {acc.title}
                          </h3>
                          {acc.description && (
                            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                              {acc.description}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 pt-1 sm:pt-0 print:hidden">
                          <button
                            onClick={() => openAccomplishmentModal(idx)}
                            aria-label="Edit accomplishment"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDelete("accomplishment", idx, acc.title)}
                            aria-label="Delete accomplishment"
                            className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No accomplishments added yet. Hackathon wins, research publications, or open-source recognition make your profile stand out.
                    </p>
                    <button
                      onClick={() => openAccomplishmentModal()}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add accomplishment
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ========================================================= */}
      {/* MODALS SECTION (INTERNSHALA ADD & EDIT DIALOGS)          */}
      {/* ========================================================= */}

      {/* 1. Header & Summary Modal */}
      {activeModal === "header" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">Edit Basic Profile Details</h3>
              <button onClick={closeModal} className="rounded-md p-1 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveHeader} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Full Name *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={headerForm.name}
                  onChange={e => setHeaderForm({ ...headerForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Professional Title / Headline *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={headerForm.title}
                  onChange={e => setHeaderForm({ ...headerForm, title: e.target.value })}
                  placeholder="e.g. Senior Full Stack Developer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Current City / Location</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={headerForm.location}
                    onChange={e => setHeaderForm({ ...headerForm, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Current Organization</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={headerForm.company}
                    onChange={e => setHeaderForm({ ...headerForm, company: e.target.value })}
                    placeholder="e.g. TechCorp Solutions"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">About / Professional Summary</label>
                <textarea
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-background p-3 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={headerForm.about}
                  onChange={e => setHeaderForm({ ...headerForm, about: e.target.value })}
                  placeholder="Write 2-4 sentences summarizing your core strengths, experience, and goals..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Personal & Links Modal */}
      {activeModal === "personal" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">Edit Contact & Work Links</h3>
              <button onClick={closeModal} className="rounded-md p-1 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSavePersonal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Email Address *</label>
                  <input
                    required
                    type="email"
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={personalForm.email}
                    onChange={e => setPersonalForm({ ...personalForm, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Phone Number</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={personalForm.phone}
                    onChange={e => setPersonalForm({ ...personalForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Current City</label>
                <input
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={personalForm.city}
                  onChange={e => setPersonalForm({ ...personalForm, city: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">GitHub Profile URL</label>
                <input
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={personalForm.github}
                  onChange={e => setPersonalForm({ ...personalForm, github: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">LinkedIn Profile URL</label>
                <input
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={personalForm.linkedin}
                  onChange={e => setPersonalForm({ ...personalForm, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Portfolio / Personal Website</label>
                <input
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={personalForm.portfolio}
                  onChange={e => setPersonalForm({ ...personalForm, portfolio: e.target.value })}
                  placeholder="https://johndoe.dev"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Links
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Education Modal */}
      {activeModal === "education" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">
                {editingIndex !== null ? "Edit Education" : "Add Education"}
              </h3>
              <button onClick={closeModal} className="rounded-md p-1 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEducation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Degree / Program *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={educationForm.degree}
                  onChange={e => setEducationForm({ ...educationForm, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Technology (B.Tech) or Senior Secondary (XII)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">College / University / School *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={educationForm.school}
                  onChange={e => setEducationForm({ ...educationForm, school: e.target.value })}
                  placeholder="e.g. University of California, Berkeley"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Stream / Specialization</label>
                <input
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={educationForm.stream || ""}
                  onChange={e => setEducationForm({ ...educationForm, stream: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Dates / Year Range *</label>
                  <input
                    required
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={educationForm.dates}
                    onChange={e => setEducationForm({ ...educationForm, dates: e.target.value })}
                    placeholder="e.g. 2019 - 2023"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Performance (CGPA / %)</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={educationForm.performance || ""}
                    onChange={e => setEducationForm({ ...educationForm, performance: e.target.value })}
                    placeholder="e.g. CGPA: 8.9 / 10 or 92%"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Education
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Job Modal */}
      {activeModal === "job" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">
                {editingIndex !== null ? "Edit Job" : "Add Job"}
              </h3>
              <button onClick={closeModal} className="rounded-md p-1 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveJob} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Profile / Role *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={jobForm.role}
                  onChange={e => setJobForm({ ...jobForm, role: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Organization / Company *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={jobForm.company}
                  onChange={e => setJobForm({ ...jobForm, company: e.target.value })}
                  placeholder="e.g. TechCorp Solutions"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Location / Work Mode</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={jobForm.location || ""}
                    onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA (Hybrid)"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Dates / Tenure *</label>
                  <input
                    required
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={jobForm.dates}
                    onChange={e => setJobForm({ ...jobForm, dates: e.target.value })}
                    placeholder="e.g. Jan 2022 - Present"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Work Description / Responsibilities</label>
                <textarea
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-background p-3 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={jobForm.description}
                  onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Summarize key contributions, tech stack used, metrics improved..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Job
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Internship Modal */}
      {activeModal === "internship" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">
                {editingIndex !== null ? "Edit Internship" : "Add Internship"}
              </h3>
              <button onClick={closeModal} className="rounded-md p-1 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveInternship} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Internship Profile / Role *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={internshipForm.role}
                  onChange={e => setInternshipForm({ ...internshipForm, role: e.target.value })}
                  placeholder="e.g. Software Engineering Intern or Frontend Intern"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Organization / Company *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={internshipForm.company}
                  onChange={e => setInternshipForm({ ...internshipForm, company: e.target.value })}
                  placeholder="e.g. InnovateTech Labs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Location / Mode</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={internshipForm.location || ""}
                    onChange={e => setInternshipForm({ ...internshipForm, location: e.target.value })}
                    placeholder="e.g. Remote or Bangalore"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Duration / Dates *</label>
                  <input
                    required
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={internshipForm.dates}
                    onChange={e => setInternshipForm({ ...internshipForm, dates: e.target.value })}
                    placeholder="e.g. May 2023 - Jul 2023"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">What did you build / learn?</label>
                <textarea
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-background p-3 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={internshipForm.description}
                  onChange={e => setInternshipForm({ ...internshipForm, description: e.target.value })}
                  placeholder="Detail key features you shipped, tools learned, and team impact..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Internship
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Project Modal */}
      {activeModal === "project" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">
                {editingIndex !== null ? "Edit Project" : "Add Project"}
              </h3>
              <button onClick={closeModal} className="rounded-md p-1 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Project Title *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={projectForm.name}
                  onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="e.g. Oasian AI Career Launchpad"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Project Link / GitHub Repo</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={projectForm.link}
                    onChange={e => setProjectForm({ ...projectForm, link: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Dates / Month</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={projectForm.dates}
                    onChange={e => setProjectForm({ ...projectForm, dates: e.target.value })}
                    placeholder="e.g. Jan 2023 - Present"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Tech Stack (comma separated)</label>
                <input
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={projectForm.techStackText}
                  onChange={e => setProjectForm({ ...projectForm, techStackText: e.target.value })}
                  placeholder="Next.js, TypeScript, Tailwind CSS, PostgreSQL"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Project Description</label>
                <textarea
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-background p-3 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={projectForm.description}
                  onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Describe problem solved, technical highlights, and impact..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Skill Modal */}
      {activeModal === "skill" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">Add New Skill</h3>
              <button onClick={closeModal} className="rounded-md p-1 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Skill Name *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={skillForm.name}
                  onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. React, Python, Figma, Docker"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Proficiency Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Beginner", "Intermediate", "Advanced"] as const).map(lvl => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setSkillForm({ ...skillForm, level: lvl })}
                      className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all ${
                        skillForm.level === lvl
                          ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-2xs"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Add Skill
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Training / Certification Modal */}
      {activeModal === "training" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">
                {editingIndex !== null ? "Edit Training / Course" : "Add Training / Course"}
              </h3>
              <button onClick={closeModal} className="rounded-md p-1 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTraining} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Program / Certification Name *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={trainingForm.program}
                  onChange={e => setTrainingForm({ ...trainingForm, program: e.target.value })}
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Platform / Organization *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={trainingForm.organization}
                  onChange={e => setTrainingForm({ ...trainingForm, organization: e.target.value })}
                  placeholder="e.g. Internshala Trainings, Coursera, Meta, AWS"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Completion Date / Year</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={trainingForm.dates || ""}
                    onChange={e => setTrainingForm({ ...trainingForm, dates: e.target.value })}
                    placeholder="e.g. 2023"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Credential Link</label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                    value={trainingForm.credentialUrl || ""}
                    onChange={e => setTrainingForm({ ...trainingForm, credentialUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Description / Key Learnings</label>
                <textarea
                  rows={3}
                  className="flex w-full rounded-lg border border-input bg-background p-3 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={trainingForm.description || ""}
                  onChange={e => setTrainingForm({ ...trainingForm, description: e.target.value })}
                  placeholder="Briefly describe key skills gained and practical modules finished..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Training
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Position of Responsibility Modal */}
      {activeModal === "responsibility" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">
                {editingIndex !== null ? "Edit Position" : "Add Position of Responsibility"}
              </h3>
              <button onClick={closeModal} className="rounded-md p-1 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveResponsibility} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Role / Position Title *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={responsibilityForm.title}
                  onChange={e => setResponsibilityForm({ ...responsibilityForm, title: e.target.value })}
                  placeholder="e.g. Lead Organizer or Core Technical Lead"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Organization / Club</label>
                <input
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={responsibilityForm.organization || ""}
                  onChange={e => setResponsibilityForm({ ...responsibilityForm, organization: e.target.value })}
                  placeholder="e.g. Google Developer Student Club or College Fest"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Description of Responsibilities</label>
                <textarea
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-background p-3 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={responsibilityForm.description}
                  onChange={e => setResponsibilityForm({ ...responsibilityForm, description: e.target.value })}
                  placeholder="Mention number of members led, events managed, or initiatives organized..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Position
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. Accomplishment Modal */}
      {activeModal === "accomplishment" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-lg font-bold">
                {editingIndex !== null ? "Edit Accomplishment" : "Add Accomplishment / Additional Details"}
              </h3>
              <button onClick={closeModal} className="rounded-md p-1 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAccomplishment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Title / Award / Publication *</label>
                <input
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={accomplishmentForm.title}
                  onChange={e => setAccomplishmentForm({ ...accomplishmentForm, title: e.target.value })}
                  placeholder="e.g. 1st Place Winner - Global AI Hackathon 2023"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Details / Description</label>
                <textarea
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-background p-3 text-sm shadow-2xs focus:ring-2 focus:ring-blue-600"
                  value={accomplishmentForm.description}
                  onChange={e => setAccomplishmentForm({ ...accomplishmentForm, description: e.target.value })}
                  placeholder="Add details regarding competition size, judges, paper title, or impact..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Accomplishment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-foreground">Confirm Delete</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Are you sure you want to remove &quot;{deleteConfirm.title}&quot; from your profile? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={executeDelete} className="bg-red-600 text-white hover:bg-red-700">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
