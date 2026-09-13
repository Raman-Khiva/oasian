"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@workspace/ui/components/button"
import { 
  MapPin, 
  Mail, 
  Phone, 
  Link as LinkIcon, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Edit3, 
  Share2, 
  Award,
  GitBranch,
  Link2,
  Check,
  X,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Zap,
  FileText
} from "lucide-react"
import Link from "next/link"
import { 
  getStoredProfile, 
  saveStoredProfile, 
  syncProfileToResume, 
  getStoredResume,
  ProfileData 
} from "@/lib/storage"

export default function ProfilePage() {
  const router = useRouter()
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [syncToast, setSyncToast] = useState<string | null>(null)

  // Profile data from storage
  const [profile, setProfile] = useState<ProfileData>(getStoredProfile())
  const [resumeVersionName, setResumeVersionName] = useState<string>("v1 - Original")

  // Hydrate on mount & listen for sync events from Resume page
  useEffect(() => {
    const loaded = getStoredProfile()
    setProfile(loaded)
    const storedResume = getStoredResume()
    setResumeVersionName(storedResume.versionName)

    const handleProfileUpdate = () => {
      const updated = getStoredProfile()
      setProfile(updated)
      const res = getStoredResume()
      setResumeVersionName(res.versionName)
    }

    window.addEventListener("oasian-profile-updated", handleProfileUpdate)
    return () => window.removeEventListener("oasian-profile-updated", handleProfileUpdate)
  }, [])

  useEffect(() => {
    if (syncToast) {
      const timer = setTimeout(() => setSyncToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [syncToast])

  const handleSave = () => {
    saveStoredProfile(profile)
    setEditingSection(null)
    setSyncToast("Profile changes saved and synced!")
  }

  const handleCancel = () => {
    setProfile(getStoredProfile())
    setEditingSection(null)
  }

  const handleAnalyzeProfileAsResume = () => {
    syncProfileToResume(profile)
    router.push("/resume")
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Navbar />

      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-bottom-3 duration-200">
          <Check className="h-4 w-4" />
          {syncToast}
        </div>
      )}

      {/* Resume Sync Bar */}
      <div className="border-b bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 px-4 py-3 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span>
              <strong className="text-foreground">Resume Auto-Sync Active:</strong>{" "}
              Synced with <span className="font-semibold text-blue-600 dark:text-blue-400">{profile.syncedWithResumeId || resumeVersionName}</span>
              {profile.lastSyncedAt && ` • Updated at ${profile.lastSyncedAt}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyzeProfileAsResume}
              className="h-8 gap-1.5 text-xs bg-background/80"
            >
              <Zap className="h-3 w-3 text-blue-600" />
              Analyze Profile with Resume AI
            </Button>
            <Link href="/resume">
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs bg-blue-600 text-white hover:bg-blue-700"
              >
                <FileText className="h-3 w-3" />
                Open Resume Builder
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 pb-16">
        
        {/* Cover Photo & Header Section */}
        <section className="relative w-full">
          {/* Cover Photo Background */}
          <div className="h-64 w-full bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 sm:h-80 md:h-96">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative -mt-24 sm:-mt-32">
              {/* Profile Header Card */}
              <div className="rounded-2xl border border-foreground/10 bg-background/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                {editingSection === "header" ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <input 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                          value={profile.name} 
                          onChange={e => setProfile({ ...profile, name: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <input 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                          value={profile.title} 
                          onChange={e => setProfile({ ...profile, title: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <input 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                          value={profile.location} 
                          onChange={e => setProfile({ ...profile, location: e.target.value })} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company</label>
                        <input 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                          value={profile.company} 
                          onChange={e => setProfile({ ...profile, company: e.target.value })} 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                      {/* Avatar */}
                      <div className="relative h-32 w-32 shrink-0 rounded-full border-4 border-background bg-muted shadow-lg sm:h-40 sm:w-40">
                        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-blue-100 to-violet-100 dark:from-blue-900/50 dark:to-violet-900/50">
                          <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                            {profile.name.split(" ").map(n => n[0]).join("") || "JD"}
                          </span>
                        </div>
                        {/* Online Indicator */}
                        <span className="absolute bottom-2 right-2 block h-6 w-6 rounded-full border-4 border-background bg-green-500"></span>
                      </div>

                      {/* Basic Info */}
                      <div className="mb-2 space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{profile.name}</h1>
                        <p className="text-lg font-medium text-foreground/80">{profile.title}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {profile.location}</span>
                          <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {profile.company}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pb-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAnalyzeProfileAsResume}
                        className="h-10 gap-2 rounded-full px-4 border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-300"
                      >
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        Analyze Resume
                      </Button>
                      <Button size="sm" onClick={() => setEditingSection("header")} className="h-10 gap-2 rounded-full bg-blue-600 px-5 text-white hover:bg-blue-700">
                        <Edit3 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto mt-8 grid grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          
          {/* Left Column (Main Content) */}
          <div className="space-y-8 lg:col-span-8">
            
            {/* About Section */}
            <section className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">About Me</h2>
                {editingSection !== "about" && (
                  <Button variant="ghost" size="icon" onClick={() => setEditingSection("about")} className="h-8 w-8 rounded-full"><Edit3 className="h-4 w-4" /></Button>
                )}
              </div>
              {editingSection === "about" ? (
                <div className="space-y-4">
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed"
                    value={profile.about}
                    onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <p className="leading-relaxed text-muted-foreground">{profile.about}</p>
              )}
            </section>

            {/* Experience Section */}
            <section className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Experience</h2>
                {editingSection !== "experience" && (
                  <Button variant="ghost" size="icon" onClick={() => setEditingSection("experience")} className="h-8 w-8 rounded-full"><Edit3 className="h-4 w-4" /></Button>
                )}
              </div>
              
              {editingSection === "experience" ? (
                <div className="space-y-6">
                  {profile.experience.map((exp, index) => (
                    <div key={exp.id} className="rounded-lg border p-4 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Role</label>
                          <input 
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs" 
                            value={exp.role} 
                            onChange={(e) => {
                              setProfile({
                                ...profile,
                                experience: profile.experience.map((item, i) => i === index ? { ...item, role: e.target.value } : item)
                              })
                            }} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Company</label>
                          <input 
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs" 
                            value={exp.company} 
                            onChange={(e) => {
                              setProfile({
                                ...profile,
                                experience: profile.experience.map((item, i) => i === index ? { ...item, company: e.target.value } : item)
                              })
                            }} 
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-xs font-medium">Dates</label>
                          <input 
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs" 
                            value={exp.dates} 
                            onChange={(e) => {
                              setProfile({
                                ...profile,
                                experience: profile.experience.map((item, i) => i === index ? { ...item, dates: e.target.value } : item)
                              })
                            }} 
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-xs font-medium">Description</label>
                          <textarea 
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs" 
                            value={exp.description} 
                            onChange={(e) => {
                              setProfile({
                                ...profile,
                                experience: profile.experience.map((item, i) => i === index ? { ...item, description: e.target.value } : item)
                              })
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:-translate-x-px before:bg-linear-to-b before:from-blue-500 before:via-blue-500/50 before:to-transparent sm:before:ml-9">
                  {profile.experience.map((exp, index) => (
                    <div key={exp.id} className="relative flex items-start gap-4 sm:gap-6">
                      <div className="relative z-10 hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border bg-background shadow-sm sm:flex">
                        <Briefcase className={`h-6 w-6 ${index === 0 ? "text-blue-600" : "text-foreground/50"}`} />
                      </div>
                      <div className={`absolute left-0 mt-1.5 h-4 w-4 rounded-full border-2 border-background sm:hidden ${index === 0 ? "bg-blue-500" : "bg-foreground/20"}`}></div>
                      
                      <div className="ml-6 sm:ml-0 flex-1">
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="text-lg font-bold">{exp.role}</h3>
                            <p className={`font-medium ${exp.companyColor}`}>{exp.company}</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground sm:mt-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{exp.dates}</span>
                          </div>
                        </div>
                        <p className="mt-3 text-muted-foreground leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Education Section */}
            <section className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">Education</h2>
                {editingSection !== "education" && (
                  <Button variant="ghost" size="icon" onClick={() => setEditingSection("education")} className="h-8 w-8 rounded-full"><Edit3 className="h-4 w-4" /></Button>
                )}
              </div>
              
              {editingSection === "education" ? (
                <div className="space-y-6">
                  {profile.education.map((edu, index) => (
                    <div key={edu.id} className="rounded-lg border p-4 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Degree</label>
                          <input 
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs" 
                            value={edu.degree} 
                            onChange={(e) => {
                              setProfile({
                                ...profile,
                                education: profile.education.map((item, i) => i === index ? { ...item, degree: e.target.value } : item)
                              })
                            }} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">School</label>
                          <input 
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs" 
                            value={edu.school} 
                            onChange={(e) => {
                              setProfile({
                                ...profile,
                                education: profile.education.map((item, i) => i === index ? { ...item, school: e.target.value } : item)
                              })
                            }} 
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-xs font-medium">Dates</label>
                          <input 
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs" 
                            value={edu.dates} 
                            onChange={(e) => {
                              setProfile({
                                ...profile,
                                education: profile.education.map((item, i) => i === index ? { ...item, dates: e.target.value } : item)
                              })
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {profile.education.map(edu => (
                    <div key={edu.id} className="flex gap-4 sm:gap-6">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        <GraduationCap className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{edu.degree}</h3>
                        <p className="text-foreground/80">{edu.school}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" /> {edu.dates}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8 lg:col-span-4">
            
            {/* Personal Details */}
            <section className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">Personal Details</h3>
                {editingSection !== "personal" && (
                  <Button variant="ghost" size="icon" onClick={() => setEditingSection("personal")} className="h-8 w-8 rounded-full"><Edit3 className="h-4 w-4" /></Button>
                )}
              </div>
              
              {editingSection === "personal" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Email</label>
                    <input 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs" 
                      value={profile.personal.email} 
                      onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, email: e.target.value } })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Phone</label>
                    <input 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs" 
                      value={profile.personal.phone} 
                      onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, phone: e.target.value } })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Portfolio</label>
                    <input 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs" 
                      value={profile.personal.portfolio} 
                      onChange={(e) => setProfile({ ...profile, personal: { ...profile.personal, portfolio: e.target.value } })} 
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                    <Button size="sm" onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <Mail className="h-4 w-4 text-foreground/70" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground">Email</span>
                        <span className="font-medium break-all">{profile.personal.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <Phone className="h-4 w-4 text-foreground/70" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground">Phone</span>
                        <span className="font-medium">{profile.personal.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <LinkIcon className="h-4 w-4 text-foreground/70" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground">Portfolio</span>
                        <Link href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-400">{profile.personal.portfolio}</Link>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <GitBranch className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Link2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </section>

            {/* Skills */}
            <section className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">Skills</h3>
                {editingSection !== "skills" && (
                  <Button variant="ghost" size="icon" onClick={() => setEditingSection("skills")} className="h-8 w-8 rounded-full"><Edit3 className="h-4 w-4" /></Button>
                )}
              </div>
              
              {editingSection === "skills" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Skills (comma separated)</label>
                    <textarea 
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs" 
                      value={profile.skills} 
                      onChange={(e) => setProfile({ ...profile, skills: e.target.value })} 
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                    <Button size="sm" onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.split(",").map((skill, i) => (
                    <span
                      key={i}
                      className="cursor-default rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground transition-transform hover:scale-105 hover:bg-secondary/80"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Achievements */}
            <section className="rounded-2xl border border-foreground/10 bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold">Achievements</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <h4 className="font-semibold">Hackathon Winner</h4>
                    <p className="text-sm text-muted-foreground">1st Place at Global AI Hack 2023</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Award className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <h4 className="font-semibold">Top Contributor</h4>
                    <p className="text-sm text-muted-foreground">Recognized in the Open Source Community</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  )
}
