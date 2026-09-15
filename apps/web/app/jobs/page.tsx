"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@workspace/ui/components/button"
import { Job, ResumeData } from "@/lib/resume-types"
import { DUMMY_JOBS } from "@/lib/jobs-data"
import { 
  getStoredResume, 
  getStoredResumeVersions,
  getSavedJobIds, 
  toggleSaveJobId,
  getJobApplications,
  addJobApplication
} from "@/lib/storage"
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  Zap,
  Bookmark,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Building2,
  UserCheck,
  Check,
  X,
  Share2
} from "lucide-react"

function JobsPageContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId")

  const [jobs, setJobs] = useState<Job[]>(DUMMY_JOBS)
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [resumeVersions, setResumeVersions] = useState<ResumeData[]>([])
  const [savedJobIds, setSavedJobIds] = useState<string[]>([])
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([])

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>("All")
  const [selectedType, setSelectedType] = useState<string>("All")
  const [onlySaved, setOnlySaved] = useState(false)

  // Selected job for detail modal/drawer
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [selectedResumeVersion, setSelectedResumeVersion] = useState<string>("")
  const [applySuccessToast, setApplySuccessToast] = useState<string | null>(null)

  // Load client data & Neon DB jobs
  useEffect(() => {
    const currentResume = getStoredResume()
    const versions = getStoredResumeVersions()
    setResume(currentResume)
    setResumeVersions(versions)
    const lastVersion = versions[versions.length - 1]
    if (lastVersion) {
      setSelectedResumeVersion(lastVersion.versionName)
    }

    setSavedJobIds(getSavedJobIds())
    const applied = getJobApplications().map(a => a.jobId)
    setAppliedJobIds(applied)

    // Fetch from Neon PostgreSQL via /api/jobs
    fetch("/api/jobs")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.jobs && data.jobs.length > 0) {
          setJobs(data.jobs)
          if (Array.isArray(data.savedJobIds) && data.savedJobIds.length > 0) {
            setSavedJobIds(data.savedJobIds)
          }
          if (Array.isArray(data.appliedJobIds) && data.appliedJobIds.length > 0) {
            setAppliedJobIds(data.appliedJobIds)
          }
          if (initialJobId) {
            const found = data.jobs.find((j: Job) => j.id === initialJobId)
            if (found) setActiveJob(found)
          }
        }
      })
      .catch(() => {})

    if (initialJobId) {
      const found = DUMMY_JOBS.find(j => j.id === initialJobId)
      if (found) setActiveJob(found)
    }
  }, [initialJobId])

  // Dismiss toast
  useEffect(() => {
    if (applySuccessToast) {
      const timer = setTimeout(() => setApplySuccessToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [applySuccessToast])

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Query filter
      const queryLower = searchQuery.toLowerCase()
      const matchesQuery =
        !searchQuery ||
        job.title.toLowerCase().includes(queryLower) ||
        job.company.toLowerCase().includes(queryLower) ||
        job.tags.some(t => t.toLowerCase().includes(queryLower)) ||
        job.location.toLowerCase().includes(queryLower)

      // Category filter
      const matchesCategory = selectedCategory === "All" || job.category === selectedCategory

      // Workplace filter
      const matchesWorkplace = selectedWorkplace === "All" || job.workplaceType === selectedWorkplace

      // Type filter
      const matchesType = selectedType === "All" || job.jobType === selectedType

      // Saved filter
      const matchesSaved = !onlySaved || savedJobIds.includes(job.id)

      return matchesQuery && matchesCategory && matchesWorkplace && matchesType && matchesSaved
    })
  }, [jobs, searchQuery, selectedCategory, selectedWorkplace, selectedType, onlySaved, savedJobIds])

  // Top 3 Recommended Jobs
  const top3Recommended = useMemo(() => {
    return [...jobs]
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 3)
  }, [jobs])

  const handleToggleSave = (jobId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const updated = toggleSaveJobId(jobId)
    setSavedJobIds(updated)

    // Sync to Neon DB for authenticated Clerk users
    fetch("/api/jobs/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.savedJobIds) {
          setSavedJobIds(data.savedJobIds)
        }
      })
      .catch((err) => {
        console.warn("[JobsPage] Could not sync saved job to DB:", err)
      })
  }

  const handleOpenApplyModal = (job: Job, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setActiveJob(job)
    setIsApplyModalOpen(true)
  }

  const handleConfirmApply = () => {
    if (!activeJob) return

    addJobApplication({
      jobId: activeJob.id,
      jobTitle: activeJob.title,
      company: activeJob.company,
      resumeVersion: selectedResumeVersion || "Current Resume",
      appliedAt: new Date().toLocaleDateString()
    })

    setAppliedJobIds(prev => [...prev, activeJob.id])
    setIsApplyModalOpen(false)
    setApplySuccessToast(`Application submitted to ${activeJob.company} for ${activeJob.title}!`)

    // Sync application to Neon DB for authenticated Clerk users
    fetch("/api/jobs/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: activeJob.id,
        resumeVersion: selectedResumeVersion || "Current Resume",
      }),
    }).catch((err) => {
      console.warn("[JobsPage] Could not sync application to DB:", err)
    })
  }

  const categories = ["All", "Full Stack", "Frontend", "Backend", "AI/ML", "DevOps/Cloud", "Mobile", "Design/Product"]

  return (
    <div className="flex min-h-svh flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Success Toast */}
      {applySuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-200 bg-white p-4 text-emerald-900 shadow-xl animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">{applySuccessToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="border-b border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Curated Career Opportunities
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Explore Tech Jobs Tailored to Your Resume
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Browse curated engineering, AI, and design openings. Your uploaded resume is automatically matched with relevant opportunities.
              </p>
            </div>

            {/* Resume Status Pill */}
            {resume && (
              <div className="rounded-2xl border bg-card p-4 shadow-xs flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">{resume.header.fullName}</span>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      Active Resume
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{resume.header.title}</p>
                </div>
                <Link href="/resume">
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:bg-blue-50">
                    Edit
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by job title, skill (e.g. Next.js, Python), or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border bg-card pl-10 pr-4 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedWorkplace}
                onChange={(e) => setSelectedWorkplace(e.target.value)}
                className="h-11 rounded-xl border bg-card px-3 text-xs font-medium shadow-xs"
              >
                <option value="All">All Locations</option>
                <option value="Remote">Remote Only</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-11 rounded-xl border bg-card px-3 text-xs font-medium shadow-xs"
              >
                <option value="All">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>

              <Button
                variant={onlySaved ? "default" : "outline"}
                size="sm"
                onClick={() => setOnlySaved(!onlySaved)}
                className="h-11 gap-1.5 rounded-xl px-3.5 text-xs font-medium"
              >
                <Bookmark className="h-3.5 w-3.5" />
                Saved ({savedJobIds.length})
              </Button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-card border text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* TOP 3 RECOMMENDED SECTION (IF RESUME AVAILABLE) */}
          {!searchQuery && selectedCategory === "All" && !onlySaved && (
            <section className="rounded-2xl border-2 border-blue-500/20 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Top Recommendations for Your Resume
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    3 Highest-Matching Opportunities
                  </h2>
                </div>
                <Link href="/resume">
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-blue-600 hover:bg-blue-50">
                    Analyze / Update Resume
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {top3Recommended.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => setActiveJob(job)}
                    className="cursor-pointer flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:border-blue-500 hover:shadow-md group"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${job.companyColor} text-white font-black text-base shadow-xs`}>
                          {job.companyLogo}
                        </div>
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {job.matchScore}% Match
                        </span>
                      </div>

                      <div className="mt-4">
                        <h3 className="font-bold text-base group-hover:text-blue-600 transition-colors leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs font-medium text-muted-foreground mt-0.5">
                          {job.company} • {job.location}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        <span>{job.salary}</span>
                        <span>•</span>
                        <span className="rounded-md bg-muted px-2 py-0.5 text-foreground">{job.workplaceType}</span>
                      </div>

                      <div className="mt-3 rounded-lg bg-blue-50/60 p-2.5 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                        <p className="font-medium">
                          💡 {job.matchReasons?.[0] || "Strong alignment with your core technical skills"}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {job.tags.slice(0, 3).map((tag, tIdx) => (
                          <span key={tIdx} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">{job.postedDate}</span>
                      <Button
                        size="sm"
                        onClick={(e) => handleOpenApplyModal(job, e)}
                        className="h-8 gap-1 bg-blue-600 text-white text-xs hover:bg-blue-700"
                      >
                        {appliedJobIds.includes(job.id) ? "Applied" : "Quick Apply"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ALL 20 JOBS LIST */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  All Open Roles ({filteredJobs.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Showing verified positions with direct apply integrations.
                </p>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Updated today
              </span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="rounded-2xl border bg-card p-12 text-center">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-bold">No jobs match your search</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters, clearing the search query, or checking another category.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                    setSelectedWorkplace("All")
                    setSelectedType("All")
                    setOnlySaved(false)
                  }}
                  className="mt-4"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map((job) => {
                  const isSaved = savedJobIds.includes(job.id)
                  const isApplied = appliedJobIds.includes(job.id)

                  return (
                    <div
                      key={job.id}
                      onClick={() => setActiveJob(job)}
                      className="cursor-pointer rounded-2xl border bg-card p-5 shadow-xs transition-all hover:border-blue-400 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      {/* Left: Logo & Job Details */}
                      <div className="flex items-start gap-4">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${job.companyColor} text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform`}>
                          {job.companyLogo}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            {job.featured && (
                              <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                                Featured
                              </span>
                            )}
                            {job.matchScore && (
                              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                {job.matchScore}% Match
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">{job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                            <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {job.salary}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.postedDate}</span>
                          </div>

                          {/* Tags */}
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                              {job.workplaceType}
                            </span>
                            <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                              {job.jobType}
                            </span>
                            {job.tags.slice(0, 4).map((tag, idx) => (
                              <span key={idx} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleToggleSave(job.id, e)}
                          className={`rounded-full h-9 w-9 ${isSaved ? "text-blue-600 bg-blue-50 dark:bg-blue-950" : "text-muted-foreground"}`}
                        >
                          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`} />
                        </Button>

                        <Button
                          size="sm"
                          variant={isApplied ? "outline" : "default"}
                          onClick={(e) => handleOpenApplyModal(job, e)}
                          className={`h-9 px-4 text-xs font-semibold gap-1.5 ${
                            isApplied ? "border-emerald-500 text-emerald-600" : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              Applied
                            </>
                          ) : (
                            <>
                              Quick Apply
                              <ChevronRight className="h-3.5 w-3.5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

        </div>
      </main>

      {/* JOB DETAILS DRAWER / MODAL */}
      {activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="flex h-full w-full max-w-2xl flex-col bg-background p-6 shadow-2xl sm:rounded-3xl overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${activeJob.companyColor} text-white font-black text-xl shadow-md`}>
                  {activeJob.companyLogo}
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{activeJob.title}</h2>
                  <p className="text-xs text-muted-foreground">{activeJob.company} • {activeJob.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleSave(activeJob.id)}
                  className="rounded-full h-8 w-8"
                >
                  <Bookmark className={`h-4 w-4 ${savedJobIds.includes(activeJob.id) ? "fill-blue-600 text-blue-600" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveJob(null)}
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-muted/30 p-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Salary</span>
                <span className="font-bold text-foreground">{activeJob.salary}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Location</span>
                <span className="font-bold text-foreground">{activeJob.location} ({activeJob.workplaceType})</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Experience</span>
                <span className="font-bold text-foreground">{activeJob.experience}</span>
              </div>
            </div>

            {/* Match Insights */}
            {activeJob.matchReasons && activeJob.matchReasons.length > 0 && (
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30 p-4 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    Why this matches your resume ({activeJob.matchScore}% Match):
                  </span>
                </div>
                <ul className="space-y-1.5 text-blue-950 dark:text-blue-200">
                  {activeJob.matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Role Overview */}
            <div className="mt-6 space-y-6 text-xs text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">About the Role</h3>
                <p>{activeJob.description}</p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Key Responsibilities</h3>
                <ul className="list-disc ml-4 space-y-1">
                  {activeJob.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Requirements & Qualifications</h3>
                <ul className="list-disc ml-4 space-y-1">
                  {activeJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-sm text-foreground mb-1.5">Benefits & Perks</h3>
                <ul className="list-disc ml-4 space-y-1">
                  {activeJob.benefits.map((ben, i) => (
                    <li key={i}>{ben}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {activeJob.applicantCount} applicants • Posted {activeJob.postedDate}
              </span>
              <Button
                onClick={() => handleOpenApplyModal(activeJob)}
                className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
              >
                {appliedJobIds.includes(activeJob.id) ? "Applied" : "Apply with Oasian Resume"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* QUICK APPLY MODAL */}
      {isApplyModalOpen && activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border bg-background p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Quick Application</span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">{activeJob.title}</h3>
                <p className="text-xs text-muted-foreground">{activeJob.company}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsApplyModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Resume Version Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Select Resume Version to Submit:</label>
              <div className="space-y-2">
                {resumeVersions.map((v) => (
                  <label
                    key={v.id}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer text-xs transition-all ${
                      selectedResumeVersion === v.versionName ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="resume-version"
                        checked={selectedResumeVersion === v.versionName}
                        onChange={() => setSelectedResumeVersion(v.versionName)}
                        className="text-blue-600"
                      />
                      <div>
                        <span className="font-bold text-foreground">{v.versionName}</span>
                        <p className="text-[11px] text-muted-foreground">Updated {new Date(v.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {v.versionName.includes("v2") && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Recommended (95 pts)
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Applicant Profile preview */}
            {resume && (
              <div className="rounded-xl bg-muted/40 p-3.5 text-xs space-y-1">
                <span className="font-bold text-foreground block mb-1">Applicant Details:</span>
                <p className="text-muted-foreground">Name: <strong className="text-foreground">{resume.header.fullName}</strong></p>
                <p className="text-muted-foreground">Email: <strong className="text-foreground">{resume.header.email}</strong></p>
                <p className="text-muted-foreground">Location: <strong className="text-foreground">{resume.header.location}</strong></p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmApply} className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700">
                <CheckCircle2 className="h-4 w-4" />
                Submit Application
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  )
}
