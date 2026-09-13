"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@workspace/ui/components/button"
import { 
  ResumeData, 
  AnalysisFeedback, 
  ImprovementItem 
} from "@/lib/resume-types"
import { 
  DEFAULT_RESUME, 
  SAMPLE_RESUMES, 
  analyzeResume, 
  createImprovedResume 
} from "@/lib/resume-analyzer"
import { DUMMY_JOBS } from "@/lib/jobs-data"
import { 
  getStoredResume, 
  saveStoredResume, 
  getStoredResumeVersions, 
  saveStoredResumeVersions,
  syncResumeToProfile,
  getStoredProfile
} from "@/lib/storage"
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Briefcase,
  ExternalLink,
  Edit3,
  Copy,
  Printer,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  Zap,
  Award,
  Layers,
  FileCheck,
  HelpCircle,
  ChevronRight,
  Share2
} from "lucide-react"

export default function ResumePage() {
  const [currentResume, setCurrentResume] = useState<ResumeData>(DEFAULT_RESUME)
  const [resumeVersions, setResumeVersions] = useState<ResumeData[]>([DEFAULT_RESUME])
  const [feedback, setFeedback] = useState<AnalysisFeedback>(() => analyzeResume(DEFAULT_RESUME))
  const [activeTab, setActiveTab] = useState<"analysis" | "builder" | "compare">("analysis")
  const [feedbackSubTab, setFeedbackSubTab] = useState<"all" | "strong" | "weak" | "missing" | "improvements">("all")
  const [isScanning, setIsScanning] = useState(false)
  const [scanStep, setScanStep] = useState(0)
  const [syncSuccessToast, setSyncSuccessToast] = useState<string | null>(null)
  const [copiedToast, setCopiedToast] = useState(false)
  const [template, setTemplate] = useState<"modern" | "classic" | "minimal">("modern")
  const [isPending, startTransition] = useTransition()

  // Load stored resume on mount
  useEffect(() => {
    const stored = getStoredResume()
    const versions = getStoredResumeVersions()
    setCurrentResume(stored)
    setResumeVersions(versions.length > 0 ? versions : [stored])
    setFeedback(analyzeResume(stored))
  }, [])

  // Auto-dismiss toasts
  useEffect(() => {
    if (syncSuccessToast) {
      const timer = setTimeout(() => setSyncSuccessToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [syncSuccessToast])

  useEffect(() => {
    if (copiedToast) {
      const timer = setTimeout(() => setCopiedToast(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [copiedToast])

  // Handle fake scan simulation
  const triggerScan = (resumeToAnalyze: ResumeData) => {
    setIsScanning(true)
    setScanStep(1)
    
    setTimeout(() => setScanStep(2), 500)
    setTimeout(() => setScanStep(3), 1000)
    setTimeout(() => {
      setIsScanning(false)
      const resFeedback = analyzeResume(resumeToAnalyze)
      setFeedback(resFeedback)
      saveStoredResume(resumeToAnalyze)
    }, 1500)
  }

  // Load a sample resume
  const handleLoadSample = (sampleKey: string) => {
    const sample = SAMPLE_RESUMES[sampleKey] || DEFAULT_RESUME
    setCurrentResume(sample)
    triggerScan(sample)
  }

  // Import from Profile
  const handleImportFromProfile = () => {
    const profile = getStoredProfile()
    const resumeFromProfile: ResumeData = {
      ...currentResume,
      id: `resume-profile-${Date.now()}`,
      versionNumber: currentResume.versionNumber,
      versionName: `v${currentResume.versionNumber} - Synced from Profile`,
      updatedAt: new Date().toISOString(),
      header: {
        ...currentResume.header,
        fullName: profile.name,
        title: profile.title,
        location: profile.location,
        email: profile.personal.email,
        phone: profile.personal.phone,
        portfolio: profile.personal.portfolio,
        summary: profile.about
      },
      skills: profile.skills.split(",").map(s => s.trim()).filter(Boolean),
      experience: profile.experience.map((exp, idx) => ({
        id: `exp-profile-${idx}`,
        role: exp.role,
        company: exp.company,
        location: profile.location,
        dates: exp.dates,
        current: exp.dates.toLowerCase().includes("present"),
        bullets: exp.description.split(".").map(b => b.trim()).filter(Boolean)
      }))
    }

    setCurrentResume(resumeFromProfile)
    triggerScan(resumeFromProfile)
    setSyncSuccessToast("Imported live data from your Profile section!")
  }

  // Simulate file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a new simulated resume based on file name
    const uploadedResume: ResumeData = {
      ...currentResume,
      id: `resume-upload-${Date.now()}`,
      versionNumber: 1,
      versionName: `v1 - ${file.name.replace(/\.[^/.]+$/, "")}`,
      updatedAt: new Date().toISOString(),
      header: {
        ...currentResume.header,
        summary: currentResume.header.summary + ` (Parsed from ${file.name})`
      }
    }

    setCurrentResume(uploadedResume)
    setResumeVersions([uploadedResume])
    triggerScan(uploadedResume)
  }

  // Create improved version (v2) considering points found
  const handleCreateImprovedVersion = () => {
    const { improvedResume, newFeedback } = createImprovedResume(currentResume, feedback)
    
    // Update state
    setCurrentResume(improvedResume)
    setFeedback(newFeedback)
    
    const updatedVersions = [...resumeVersions.filter(v => v.id !== improvedResume.id), improvedResume]
    setResumeVersions(updatedVersions)
    
    // Save to storage
    saveStoredResume(improvedResume)
    saveStoredResumeVersions(updatedVersions)
    
    setActiveTab("builder")
    setSyncSuccessToast("🎉 Version 2 Created! All weak points & missing items have been optimized to score 95/100.")
  }

  // Switch between saved versions
  const handleSwitchVersion = (v: ResumeData) => {
    setCurrentResume(v)
    setFeedback(analyzeResume(v))
    saveStoredResume(v)
  }

  // Apply single improvement item
  const handleApplySingleImprovement = (item: ImprovementItem) => {
    let updated = { ...currentResume }

    if (item.section === "summary") {
      updated = {
        ...updated,
        header: {
          ...updated.header,
          summary: item.after
        }
      }
    } else if (item.section === "experience" && item.targetId && item.bulletIndex !== undefined) {
      updated = {
        ...updated,
        experience: updated.experience.map(exp => {
          if (exp.id === item.targetId) {
            const newBullets = [...exp.bullets]
            newBullets[item.bulletIndex!] = item.after
            return { ...exp, bullets: newBullets }
          }
          return exp
        })
      }
    } else if (item.section === "skills") {
      const parsedSkills = item.after
        .replace(/Frontend:|Backend:|Cloud & DevOps:|Architecture:/g, "")
        .split(/[|,]/)
        .map(s => s.trim())
        .filter(Boolean)
      
      updated = {
        ...updated,
        skills: Array.from(new Set([...updated.skills, ...parsedSkills]))
      }
    }

    setCurrentResume(updated)
    const newFeedback = analyzeResume(updated)
    setFeedback({
      ...newFeedback,
      improvements: feedback.improvements.map(imp => imp.id === item.id ? { ...imp, applied: true } : imp)
    })
    saveStoredResume(updated)
    setSyncSuccessToast(`Applied fix: "${item.title}"! Score updated.`)
  }

  // Sync to Profile Section
  const handleSyncToProfile = () => {
    syncResumeToProfile(currentResume)
    setSyncSuccessToast(`Successfully synced ${currentResume.versionName} to your Profile Section!`)
  }

  // Copy plain text resume
  const handleCopyPlainText = () => {
    const text = `
${currentResume.header.fullName}
${currentResume.header.title} | ${currentResume.header.location}
Email: ${currentResume.header.email} | Phone: ${currentResume.header.phone}
Portfolio: ${currentResume.header.portfolio} | LinkedIn: ${currentResume.header.linkedin}

PROFESSIONAL SUMMARY
${currentResume.header.summary}

TECHNICAL SKILLS
${currentResume.skills.join(", ")}

EXPERIENCE
${currentResume.experience.map(e => `
${e.role} — ${e.company} (${e.dates})
${e.bullets.map(b => `• ${b}`).join("\n")}
`).join("\n")}

EDUCATION
${currentResume.education.map(e => `${e.degree} — ${e.school} (${e.dates})`).join("\n")}
    `.trim()

    navigator.clipboard.writeText(text)
    setCopiedToast(true)
  }

  // Print resume
  const handlePrint = () => {
    window.print()
  }

  // Find the 3 recommended jobs for this resume
  const recommendedJobs = DUMMY_JOBS.filter(job => feedback.recommendedJobIds.includes(job.id)).slice(0, 3)

  return (
    <div className="flex min-h-svh flex-col bg-slate-50 dark:bg-background text-foreground">
      <Navbar />

      {/* Sync Toast Notification */}
      {syncSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-800 shadow-xl backdrop-blur-md dark:bg-emerald-950/80 dark:text-emerald-200 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">{syncSuccessToast}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSyncSuccessToast(null)} 
            className="h-7 w-7 p-0 text-emerald-700 hover:bg-emerald-500/20"
          >
            ✕
          </Button>
        </div>
      )}

      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl dark:bg-white dark:text-slate-900 animate-in fade-in duration-200">
          <Check className="h-4 w-4 text-emerald-400" />
          Resume copied to clipboard!
        </div>
      )}

      {/* Top Banner & Action Header */}
      <section className="border-b bg-background/80 backdrop-blur-md py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Title & Badge */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                    Resume Analyser & Builder
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                      AI Powered
                    </span>
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Upload your resume to get real-time ATS scoring, identify weak & missing sections, generate optimized versions, and sync with your profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Version Switcher & Primary Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Version Selector */}
              <div className="flex items-center rounded-lg border bg-muted/50 p-1 text-xs font-medium">
                {resumeVersions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSwitchVersion(v)}
                    className={`rounded-md px-3 py-1.5 transition-all ${
                      currentResume.id === v.id
                        ? "bg-background text-foreground font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {(v.versionName.split("-")[0] ?? "v1").trim()}
                  </button>
                ))}
              </div>

              {/* Sync to Profile Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncToProfile}
                className="gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-blue-950/50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Sync to Profile
              </Button>

              {/* Create Improved Version Button */}
              <Button
                size="sm"
                onClick={handleCreateImprovedVersion}
                className="gap-1.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm hover:from-blue-700 hover:to-violet-700"
              >
                <Zap className="h-3.5 w-3.5" />
                Improve & Build v2
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex items-center gap-2 border-b border-foreground/10 pb-px">
            <button
              onClick={() => setActiveTab("analysis")}
              className={`relative flex items-center gap-2 pb-3 px-3 text-sm font-semibold transition-colors ${
                activeTab === "analysis"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              Analysis & Feedback
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                feedback.overallScore >= 90 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              }`}>
                {feedback.overallScore}/100
              </span>
            </button>

            <button
              onClick={() => setActiveTab("builder")}
              className={`relative flex items-center gap-2 pb-3 px-3 text-sm font-semibold transition-colors ${
                activeTab === "builder"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="h-4 w-4" />
              Resume Builder & Preview
            </button>

            <button
              onClick={() => setActiveTab("compare")}
              className={`relative flex items-center gap-2 pb-3 px-3 text-sm font-semibold transition-colors ${
                activeTab === "compare"
                  ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-4 w-4" />
              Before & After Comparison
            </button>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Scanning Overlay Modal/Animation */}
          {isScanning && (
            <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50/70 p-6 text-center shadow-md dark:border-blue-900/50 dark:bg-blue-950/30">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 animate-pulse">
                  <Sparkles className="h-7 w-7 animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Analyzing Your Resume Structure & Impact</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {scanStep === 1 && "Step 1: Extracting text, header data, and career sections..."}
                  {scanStep === 2 && "Step 2: Checking ATS keyword density, formatting compliance, and contact links..."}
                  {scanStep === 3 && "Step 3: Calculating quantifiable metrics, action verbs, and matching against 20 active jobs..."}
                </p>
                <div className="w-64 h-2 bg-blue-100 rounded-full overflow-hidden dark:bg-blue-900">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300 rounded-full" 
                    style={{ width: `${(scanStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ANALYSIS & FEEDBACK */}
          {activeTab === "analysis" && (
            <div className="space-y-8">
              
              {/* Quick Resume Upload & Quick Sample Pickers Bar */}
              <div className="rounded-2xl border bg-card p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input 
                      type="file" 
                      id="resume-upload-input" 
                      className="hidden" 
                      accept=".pdf,.docx,.doc,.txt,.json"
                      onChange={handleFileUpload}
                    />
                    <label 
                      htmlFor="resume-upload-input"
                      className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Resume File
                    </label>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleImportFromProfile}
                    className="h-10 gap-1.5"
                  >
                    <FileCheck className="h-4 w-4 text-blue-600" />
                    Load From My Profile
                  </Button>
                </div>

                {/* Sample Presets */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Test Sample:</span>
                  <button 
                    onClick={() => handleLoadSample("default")}
                    className="rounded-lg border bg-muted/40 px-2.5 py-1.5 text-xs font-medium hover:bg-muted hover:text-foreground transition-colors"
                  >
                    Senior Full Stack (74 pts)
                  </button>
                  <button 
                    onClick={() => handleLoadSample("frontend")}
                    className="rounded-lg border bg-muted/40 px-2.5 py-1.5 text-xs font-medium hover:bg-muted hover:text-foreground transition-colors"
                  >
                    Frontend Dev (68 pts)
                  </button>
                  <button 
                    onClick={() => handleLoadSample("ai")}
                    className="rounded-lg border bg-muted/40 px-2.5 py-1.5 text-xs font-medium hover:bg-muted hover:text-foreground transition-colors"
                  >
                    AI Engineer (79 pts)
                  </button>
                </div>
              </div>

              {/* Score Dashboard Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                
                {/* Overall Radial Score Card */}
                <div className="rounded-2xl border bg-gradient-to-br from-card via-card to-blue-50/30 dark:to-blue-950/20 p-6 shadow-sm md:col-span-4 flex flex-col items-center justify-center text-center">
                  <div className="relative flex h-36 w-36 items-center justify-center">
                    {/* SVG Circular Progress */}
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="stroke-muted"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * feedback.overallScore) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className={`transition-all duration-1000 ${
                          feedback.overallScore >= 90
                            ? "text-emerald-500"
                            : feedback.overallScore >= 75
                            ? "text-blue-600"
                            : "text-amber-500"
                        }`}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-black tracking-tight">{feedback.overallScore}</span>
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase">Out of 100</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-bold">
                      {feedback.overallScore >= 90 ? "Excellent ATS Readiness" : feedback.overallScore >= 75 ? "Good Foundation • Needs Polish" : "Needs Key Improvements"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 px-4">
                      {currentResume.versionName} • Evaluated against modern ATS algorithms & technical hiring bars.
                    </p>
                  </div>

                  {feedback.overallScore < 90 && (
                    <Button
                      onClick={handleCreateImprovedVersion}
                      className="mt-5 w-full gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700"
                    >
                      <Zap className="h-4 w-4" />
                      Boost to 95/100 (Create v2)
                    </Button>
                  )}
                </div>

                {/* Sub-scores & Summary */}
                <div className="rounded-2xl border bg-card p-6 shadow-sm md:col-span-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold">Comprehensive Analysis Breakdown</h2>
                      <span className="text-xs text-muted-foreground">
                        Last scanned: {new Date(feedback.analyzedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {feedback.keySummary}
                    </p>
                  </div>

                  {/* 4 Metric Meters */}
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border bg-muted/30 p-3.5">
                      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>ATS Keywords</span>
                        <span className="font-bold text-foreground">{feedback.atsScore}%</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${feedback.atsScore}%` }}></div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-3.5">
                      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>Impact & ROI</span>
                        <span className="font-bold text-foreground">{feedback.impactScore}%</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${feedback.impactScore >= 80 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${feedback.impactScore}%` }}></div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-3.5">
                      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>Brevity & Layout</span>
                        <span className="font-bold text-foreground">{feedback.brevityScore}%</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${feedback.brevityScore}%` }}></div>
                      </div>
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-3.5">
                      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>Skills Relevance</span>
                        <span className="font-bold text-foreground">{feedback.skillsScore}%</span>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-violet-600" style={{ width: `${feedback.skillsScore}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Target Roles Pills */}
                  <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Target Matches:</span>
                    {feedback.targetRoles.map((role, idx) => (
                      <span key={idx} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3 AI RECOMMENDED JOBS BASED ON RESUME */}
              <section className="rounded-2xl border-2 border-blue-500/20 bg-gradient-to-b from-blue-50/40 to-transparent dark:from-blue-950/20 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/60 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      Precision Match Engine
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                      3 Jobs Recommended Based on Your Resume
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Curated from our database of 20 live tech openings matching your verified skills & experience level.
                    </p>
                  </div>
                  <Link href="/jobs">
                    <Button variant="outline" className="gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300">
                      View All 20 Jobs
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  {recommendedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:border-blue-400 hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${job.companyColor} text-white font-black text-sm shadow-xs`}>
                            {job.companyLogo}
                          </div>
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {job.matchScore}% Match
                          </span>
                        </div>

                        <div className="mt-3">
                          <h3 className="font-bold text-base leading-snug">{job.title}</h3>
                          <p className="text-xs font-medium text-muted-foreground mt-0.5">{job.company} • {job.location}</p>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <span>{job.salary}</span>
                          <span>•</span>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-foreground">{job.workplaceType}</span>
                        </div>

                        {/* Why matched reason */}
                        <div className="mt-3 rounded-lg bg-blue-50/60 p-2.5 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                          <p className="font-medium">
                            💡 {job.matchReasons?.[0] || "Strong alignment with your core technical skills"}
                          </p>
                        </div>

                        {/* Skill Pills */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {job.tags.slice(0, 3).map((tag, tIdx) => (
                            <span key={tIdx} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">{job.postedDate}</span>
                        <Link href={`/jobs?jobId=${job.id}`}>
                          <Button size="sm" className="h-8 gap-1.5 bg-blue-600 text-white hover:bg-blue-700 text-xs">
                            View & Apply
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Feedback Breakdown (Strong / Weak / Missing / Improvements) */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Detailed Section Audit & Diagnostics</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Review specific insights, flagged errors, and actionable recommendations.
                    </p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border bg-muted/40 p-1 text-xs font-semibold">
                    <button
                      onClick={() => setFeedbackSubTab("all")}
                      className={`rounded-lg px-3 py-1.5 transition-all ${
                        feedbackSubTab === "all" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      All ({feedback.strongSections.length + feedback.weakSections.length + feedback.missingOrErrors.length})
                    </button>
                    <button
                      onClick={() => setFeedbackSubTab("strong")}
                      className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1 ${
                        feedbackSubTab === "strong" ? "bg-background text-emerald-600 shadow-xs" : "text-muted-foreground hover:text-emerald-600"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Strong ({feedback.strongSections.length})
                    </button>
                    <button
                      onClick={() => setFeedbackSubTab("weak")}
                      className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1 ${
                        feedbackSubTab === "weak" ? "bg-background text-amber-600 shadow-xs" : "text-muted-foreground hover:text-amber-600"
                      }`}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Weak Points ({feedback.weakSections.length})
                    </button>
                    <button
                      onClick={() => setFeedbackSubTab("missing")}
                      className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1 ${
                        feedbackSubTab === "missing" ? "bg-background text-rose-600 shadow-xs" : "text-muted-foreground hover:text-rose-600"
                      }`}
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      Missing / Errors ({feedback.missingOrErrors.length})
                    </button>
                    <button
                      onClick={() => setFeedbackSubTab("improvements")}
                      className={`rounded-lg px-3 py-1.5 transition-all flex items-center gap-1 ${
                        feedbackSubTab === "improvements" ? "bg-background text-blue-600 shadow-xs" : "text-muted-foreground hover:text-blue-600"
                      }`}
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Improvements ({feedback.improvements.length})
                    </button>
                  </div>
                </div>

                {/* Section Content */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  
                  {/* STRONG SECTIONS */}
                  {(feedbackSubTab === "all" || feedbackSubTab === "strong") && feedback.strongSections.map((sec, idx) => (
                    <div key={idx} className="rounded-2xl border border-emerald-500/20 bg-card p-6 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Strong Section</span>
                            <h3 className="font-bold text-base">{sec.title}</h3>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                          {sec.score}/100
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground">{sec.description}</p>

                      <div className="mt-4 space-y-2 border-t pt-3">
                        {sec.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* WEAK SECTIONS */}
                  {(feedbackSubTab === "all" || feedbackSubTab === "weak") && feedback.weakSections.map((sec, idx) => (
                    <div key={idx} className="rounded-2xl border border-amber-500/20 bg-card p-6 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                              Weak Section • {sec.category}
                            </span>
                            <h3 className="font-bold text-base">{sec.title}</h3>
                          </div>
                        </div>
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 uppercase">
                          {sec.severity}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground">{sec.issue}</p>

                      <div className="mt-4 rounded-xl bg-amber-50/60 p-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                        <p className="font-semibold">⚠️ Impact on Hiring:</p>
                        <p className="mt-0.5">{sec.impact}</p>
                      </div>

                      <div className="mt-3 text-xs">
                        <span className="font-bold text-foreground">Recommended Fix: </span>
                        <span className="text-muted-foreground">{sec.suggestion}</span>
                      </div>
                    </div>
                  ))}

                  {/* MISSING OR ERRORS */}
                  {(feedbackSubTab === "all" || feedbackSubTab === "missing") && feedback.missingOrErrors.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-rose-500/20 bg-card p-6 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                            {item.type} Detected
                          </span>
                          <h3 className="font-bold text-base">{item.title}</h3>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground">{item.description}</p>

                      <div className="mt-3 rounded-xl bg-rose-50/60 p-3 text-xs text-rose-950 dark:bg-rose-950/40 dark:text-rose-200">
                        <span className="font-semibold">How to Fix: </span>
                        <span>{item.fix}</span>
                      </div>
                    </div>
                  ))}

                </div>

                {/* ACTIONABLE IMPROVEMENTS CARDS */}
                {(feedbackSubTab === "all" || feedbackSubTab === "improvements") && (
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">1-Click Actionable Rewrites & Fixes</h3>
                      <Button 
                        size="sm" 
                        onClick={handleCreateImprovedVersion}
                        className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        Apply All into New Version (v2)
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {feedback.improvements.map((imp) => (
                        <div key={imp.id} className="rounded-2xl border bg-card p-5 shadow-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase">
                                {imp.section} Optimization
                              </span>
                              <h4 className="font-bold text-base mt-1">{imp.title}</h4>
                            </div>

                            <Button
                              size="sm"
                              variant={imp.applied ? "secondary" : "default"}
                              disabled={imp.applied}
                              onClick={() => handleApplySingleImprovement(imp)}
                              className="h-8 gap-1.5 text-xs font-semibold"
                            >
                              {imp.applied ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  Applied
                                </>
                              ) : (
                                <>
                                  <Zap className="h-3.5 w-3.5" />
                                  Apply Fix
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="rounded-xl border border-rose-200 bg-rose-50/40 dark:border-rose-900/50 dark:bg-rose-950/20 p-3">
                              <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">Before (Weak):</span>
                              <p className="text-muted-foreground italic">&quot;{imp.before}&quot;</p>
                            </div>

                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20 p-3">
                              <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">After (AI Optimized):</span>
                              <p className="text-foreground font-medium">&quot;{imp.after}&quot;</p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                            <span>💡 <strong className="text-foreground">Why:</strong> {imp.rationale}</span>
                            <span className="font-bold text-emerald-600 shrink-0 ml-2">{imp.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* TAB 2: RESUME BUILDER & LIVE PREVIEW */}
          {activeTab === "builder" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              
              {/* Left Column: Form Editor */}
              <div className="space-y-6 lg:col-span-5">
                <div className="flex items-center justify-between border-b pb-3">
                  <h2 className="text-xl font-bold tracking-tight">Interactive Resume Editor</h2>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                    Live Auto-Save
                  </span>
                </div>

                {/* Header Inputs */}
                <div className="rounded-2xl border bg-card p-5 space-y-3">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Header & Contact
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-medium text-muted-foreground">Full Name</label>
                      <input 
                        className="mt-1 flex h-9 w-full rounded-md border bg-background px-3 py-1 text-xs" 
                        value={currentResume.header.fullName}
                        onChange={(e) => {
                          const updated = { ...currentResume, header: { ...currentResume.header, fullName: e.target.value } }
                          setCurrentResume(updated)
                          saveStoredResume(updated)
                        }}
                      />
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">Target Title</label>
                      <input 
                        className="mt-1 flex h-9 w-full rounded-md border bg-background px-3 py-1 text-xs" 
                        value={currentResume.header.title}
                        onChange={(e) => {
                          const updated = { ...currentResume, header: { ...currentResume.header, title: e.target.value } }
                          setCurrentResume(updated)
                          saveStoredResume(updated)
                        }}
                      />
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">Email</label>
                      <input 
                        className="mt-1 flex h-9 w-full rounded-md border bg-background px-3 py-1 text-xs" 
                        value={currentResume.header.email}
                        onChange={(e) => {
                          const updated = { ...currentResume, header: { ...currentResume.header, email: e.target.value } }
                          setCurrentResume(updated)
                          saveStoredResume(updated)
                        }}
                      />
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">Location</label>
                      <input 
                        className="mt-1 flex h-9 w-full rounded-md border bg-background px-3 py-1 text-xs" 
                        value={currentResume.header.location}
                        onChange={(e) => {
                          const updated = { ...currentResume, header: { ...currentResume.header, location: e.target.value } }
                          setCurrentResume(updated)
                          saveStoredResume(updated)
                        }}
                      />
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">LinkedIn</label>
                      <input 
                        className="mt-1 flex h-9 w-full rounded-md border bg-background px-3 py-1 text-xs" 
                        value={currentResume.header.linkedin}
                        onChange={(e) => {
                          const updated = { ...currentResume, header: { ...currentResume.header, linkedin: e.target.value } }
                          setCurrentResume(updated)
                          saveStoredResume(updated)
                        }}
                      />
                    </div>
                    <div>
                      <label className="font-medium text-muted-foreground">GitHub / Portfolio</label>
                      <input 
                        className="mt-1 flex h-9 w-full rounded-md border bg-background px-3 py-1 text-xs" 
                        value={currentResume.header.portfolio}
                        onChange={(e) => {
                          const updated = { ...currentResume, header: { ...currentResume.header, portfolio: e.target.value } }
                          setCurrentResume(updated)
                          saveStoredResume(updated)
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Summary Editor */}
                <div className="rounded-2xl border bg-card p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground">Professional Summary</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const improvedSummary = `Results-driven ${currentResume.header.title} with 5+ years of production experience architecting high-scale distributed systems and responsive web applications. Proven track record reducing system latency by 40% and leading engineering teams across React 19, Next.js, TypeScript, and AWS cloud infrastructure.`
                        const updated = { ...currentResume, header: { ...currentResume.header, summary: improvedSummary } }
                        setCurrentResume(updated)
                        saveStoredResume(updated)
                        setSyncSuccessToast("Summary updated with AI high-impact draft!")
                      }}
                      className="h-7 text-xs text-blue-600 gap-1 hover:bg-blue-50"
                    >
                      <Sparkles className="h-3 w-3" />
                      AI Rewrite
                    </Button>
                  </div>
                  <textarea
                    rows={4}
                    className="w-full rounded-md border bg-background p-2.5 text-xs leading-relaxed"
                    value={currentResume.header.summary}
                    onChange={(e) => {
                      const updated = { ...currentResume, header: { ...currentResume.header, summary: e.target.value } }
                      setCurrentResume(updated)
                      saveStoredResume(updated)
                    }}
                  />
                </div>

                {/* Skills Editor */}
                <div className="rounded-2xl border bg-card p-5 space-y-2">
                  <h3 className="font-bold text-sm text-foreground">Skills (Comma-separated)</h3>
                  <textarea
                    rows={2}
                    className="w-full rounded-md border bg-background p-2.5 text-xs"
                    value={currentResume.skills.join(", ")}
                    onChange={(e) => {
                      const list = e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                      const updated = { ...currentResume, skills: list }
                      setCurrentResume(updated)
                      saveStoredResume(updated)
                    }}
                  />
                </div>

                {/* Experience Editor */}
                <div className="rounded-2xl border bg-card p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground">Work Experience</h3>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        const newExp = {
                          id: `exp-${Date.now()}`,
                          role: "Software Engineer",
                          company: "New Company",
                          location: "Remote",
                          dates: "2024 - Present",
                          current: true,
                          bullets: ["Engineered core user features with Next.js and TypeScript."]
                        }
                        const updated = { ...currentResume, experience: [newExp, ...currentResume.experience] }
                        setCurrentResume(updated)
                        saveStoredResume(updated)
                      }}
                      className="h-7 text-xs gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Role
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {currentResume.experience.map((exp, expIdx) => (
                      <div key={exp.id} className="rounded-xl border bg-muted/20 p-3 space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            className="h-8 rounded-md border bg-background px-2 font-semibold"
                            value={exp.role}
                            placeholder="Role Title"
                            onChange={(e) => {
                              const updated = {
                                ...currentResume,
                                experience: currentResume.experience.map((item, i) => i === expIdx ? { ...item, role: e.target.value } : item)
                              }
                              setCurrentResume(updated)
                              saveStoredResume(updated)
                            }}
                          />
                          <input 
                            className="h-8 rounded-md border bg-background px-2"
                            value={exp.company}
                            placeholder="Company"
                            onChange={(e) => {
                              const updated = {
                                ...currentResume,
                                experience: currentResume.experience.map((item, i) => i === expIdx ? { ...item, company: e.target.value } : item)
                              }
                              setCurrentResume(updated)
                              saveStoredResume(updated)
                            }}
                          />
                        </div>

                        {/* Bullets */}
                        <div className="space-y-1.5 mt-2">
                          <label className="text-[11px] font-semibold text-muted-foreground">Bullet Points (Quantified Achievements):</label>
                          {exp.bullets.map((b, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-1.5">
                              <span className="text-muted-foreground mt-1.5">•</span>
                              <textarea
                                rows={2}
                                className="w-full rounded-md border bg-background p-1.5 text-xs"
                                value={b}
                                onChange={(e) => {
                                  const updated = {
                                    ...currentResume,
                                    experience: currentResume.experience.map((item, i) => {
                                      if (i !== expIdx) return item
                                      const newBullets = [...item.bullets]
                                      newBullets[bIdx] = e.target.value
                                      return { ...item, bullets: newBullets }
                                    })
                                  }
                                  setCurrentResume(updated)
                                  saveStoredResume(updated)
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Live Printable Resume Document View */}
              <div className="space-y-4 lg:col-span-7">
                
                {/* Document Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border bg-card p-3 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span>Layout Template:</span>
                    <button 
                      onClick={() => setTemplate("modern")} 
                      className={`rounded-lg px-2.5 py-1 ${template === "modern" ? "bg-blue-600 text-white" : "hover:bg-muted"}`}
                    >
                      Modern ATS
                    </button>
                    <button 
                      onClick={() => setTemplate("classic")} 
                      className={`rounded-lg px-2.5 py-1 ${template === "classic" ? "bg-blue-600 text-white" : "hover:bg-muted"}`}
                    >
                      Executive
                    </button>
                    <button 
                      onClick={() => setTemplate("minimal")} 
                      className={`rounded-lg px-2.5 py-1 ${template === "minimal" ? "bg-blue-600 text-white" : "hover:bg-muted"}`}
                    >
                      Minimal
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopyPlainText}
                      className="h-8 gap-1 text-xs"
                    >
                      <Copy className="h-3 w-3" />
                      Copy Text
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePrint}
                      className="h-8 gap-1 text-xs"
                    >
                      <Printer className="h-3 w-3" />
                      Print / PDF
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSyncToProfile}
                      className="h-8 gap-1.5 bg-blue-600 text-white text-xs hover:bg-blue-700"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Sync to Profile
                    </Button>
                  </div>
                </div>

                {/* Printable Resume Paper Canvas */}
                <div 
                  id="printable-resume" 
                  className="rounded-2xl border bg-white p-8 sm:p-12 text-slate-900 shadow-xl dark:bg-slate-900 dark:text-slate-100 min-h-[850px] transition-all"
                >
                  {/* Header */}
                  <header className={`border-b pb-6 ${template === "classic" ? "text-center" : ""}`}>
                    <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                      {currentResume.header.fullName}
                    </h1>
                    <p className="text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {currentResume.header.title}
                    </p>
                    <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 ${template === "classic" ? "justify-center" : ""}`}>
                      <span>📍 {currentResume.header.location}</span>
                      <span>✉️ {currentResume.header.email}</span>
                      <span>📞 {currentResume.header.phone}</span>
                      {currentResume.header.portfolio && <span>🌐 {currentResume.header.portfolio}</span>}
                      {currentResume.header.linkedin && <span>🔗 {currentResume.header.linkedin}</span>}
                    </div>
                  </header>

                  {/* Summary */}
                  <section className="mt-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-1">
                      Professional Summary
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {currentResume.header.summary}
                    </p>
                  </section>

                  {/* Skills */}
                  <section className="mt-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-1">
                      Technical Skills
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {currentResume.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Experience */}
                  <section className="mt-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-1">
                      Professional Experience
                    </h2>
                    <div className="mt-3 space-y-5">
                      {currentResume.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                            <div>
                              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{exp.role}</span>
                              <span className="text-slate-600 dark:text-slate-400 font-medium"> — {exp.company}</span>
                            </div>
                            <span className="text-slate-500 font-medium text-[11px] mt-0.5 sm:mt-0">{exp.dates}</span>
                          </div>
                          <ul className="mt-2 space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-outside ml-4">
                            {exp.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="leading-relaxed">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Education */}
                  <section className="mt-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-1">
                      Education
                    </h2>
                    <div className="mt-3 space-y-2">
                      {currentResume.education.map((edu) => (
                        <div key={edu.id} className="flex items-baseline justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-100">{edu.degree}</span>
                            <span className="text-slate-600 dark:text-slate-400 font-medium">, {edu.school}</span>
                          </div>
                          <span className="text-slate-500 text-[11px]">{edu.dates}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Projects */}
                  {currentResume.projects && currentResume.projects.length > 0 && (
                    <section className="mt-6">
                      <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-1">
                        Key Projects
                      </h2>
                      <div className="mt-3 space-y-3">
                        {currentResume.projects.map((proj) => (
                          <div key={proj.id} className="text-xs">
                            <div className="flex items-baseline justify-between">
                              <span className="font-bold text-slate-900 dark:text-slate-100">{proj.name}</span>
                              {proj.link && (
                                <span className="text-[11px] text-blue-600 dark:text-blue-400">{proj.link}</span>
                              )}
                            </div>
                            <p className="mt-0.5 text-slate-700 dark:text-slate-300">{proj.description}</p>
                            <div className="mt-1 flex gap-1">
                              {proj.techStack.map((tech, tIdx) => (
                                <span key={tIdx} className="text-[10px] text-slate-500 font-medium">
                                  #{tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Certifications */}
                  {currentResume.certifications && currentResume.certifications.length > 0 && (
                    <section className="mt-6">
                      <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-1">
                        Certifications
                      </h2>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {currentResume.certifications.map((cert, cIdx) => (
                          <span key={cIdx} className="font-medium text-slate-700 dark:text-slate-300">
                            • {cert}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* TAB 3: BEFORE & AFTER COMPARISON */}
          {activeTab === "compare" && (
            <div className="space-y-6">
              <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                    Version Comparison
                  </span>
                  <h2 className="text-2xl font-black tracking-tight mt-1">
                    v1 (Original Upload) vs v2 (AI Optimized)
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Inspect how AI analysis addressed missing data, strengthened verbs, and quantified business impact (+23 score boost).
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleSyncToProfile}
                    className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Sync v2 to Profile
                  </Button>
                </div>
              </div>

              {/* Diff Columns */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                
                {/* Version 1 (Original) */}
                <div className="rounded-2xl border border-rose-200/50 bg-card p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Before</span>
                      <h3 className="font-bold text-lg">v1 - Original Upload</h3>
                    </div>
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      Score: 72/100
                    </span>
                  </div>

                  <div className="mt-5 space-y-6 text-xs">
                    <div>
                      <h4 className="font-bold text-muted-foreground uppercase text-[11px]">Professional Summary</h4>
                      <p className="mt-1.5 rounded-lg border bg-muted/20 p-3 leading-relaxed text-muted-foreground">
                        {DEFAULT_RESUME.header.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-muted-foreground uppercase text-[11px]">Key Experience Bullets</h4>
                      <div className="mt-1.5 space-y-2">
                        {DEFAULT_RESUME.experience[0]?.bullets.map((b, i) => (
                          <div key={i} className="rounded-lg border border-rose-200/40 bg-rose-50/20 p-2.5 text-muted-foreground">
                            {b}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-muted-foreground uppercase text-[11px]">Skills & Links</h4>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {DEFAULT_RESUME.skills.map((s, i) => (
                          <span key={i} className="rounded-md border bg-muted/40 px-2 py-0.5 text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Version 2 (AI Optimized) */}
                <div className="rounded-2xl border border-emerald-500/30 bg-card p-6 shadow-xs">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">After (AI Optimized)</span>
                      <h3 className="font-bold text-lg">v2 - High Converting</h3>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Score: 95/100 (+23 pts)
                    </span>
                  </div>

                  <div className="mt-5 space-y-6 text-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[11px]">Professional Summary (Quantified)</h4>
                        <span className="text-[10px] font-bold text-emerald-600">+14 ATS pts</span>
                      </div>
                      <p className="mt-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50/20 p-3 leading-relaxed font-medium">
                        Results-driven Senior Full Stack Developer with 5+ years of experience architecting high-scale distributed systems and modern web applications. Proven track record reducing system latency by 40% and leading engineering teams across React 19, Next.js, TypeScript, Node.js, and AWS cloud infrastructure. Experienced in building agentic AI interfaces and resilient microservices.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[11px]">Quantified Experience Bullets</h4>
                        <span className="text-[10px] font-bold text-emerald-600">+18 Impact pts</span>
                      </div>
                      <div className="mt-1.5 space-y-2">
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-50/20 p-2.5">
                          Architected and deployed 12+ fault-tolerant microservices on AWS EKS with Node.js and TypeScript, handling 45,000+ daily peak transactions with 99.98% uptime.
                        </div>
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-50/20 p-2.5">
                          Spearheaded database query optimization and Redis caching layer, reducing API p95 response latency by 40% and cutting cloud infrastructure expenses by $18,000 annually.
                        </div>
                        <div className="rounded-lg border border-emerald-500/30 bg-emerald-50/20 p-2.5">
                          Mentored and led 4 junior developers through rigorous code reviews, automated CI/CD pipeline adoption, and comprehensive test coverage (88%+).
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[11px]">Categorized Skills Stack</h4>
                        <span className="text-[10px] font-bold text-emerald-600">+10 ATS Match</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {["React 19", "Next.js 15", "TypeScript", "Node.js", "Docker", "PostgreSQL", "Redis", "AWS EKS", "Microservices", "CI/CD"].map((s, i) => (
                          <span key={i} className="rounded-md border border-emerald-500/30 bg-emerald-50/30 px-2 py-0.5 font-semibold text-emerald-800 dark:text-emerald-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
