"use client"

import { useState } from "react"
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
  X
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [editingSection, setEditingSection] = useState<string | null>(null)

  // Initial State Data
  const [headerData, setHeaderData] = useState({
    name: "John Doe",
    title: "Senior Full Stack Developer",
    location: "San Francisco, CA",
    company: "Oasian"
  })

  const [aboutData, setAboutData] = useState(
    "Passionate software engineer with over 5 years of experience building scalable web applications. I specialize in React, Node.js, and cloud architecture. I love participating in hackathons, learning new technologies, and contributing to open-source projects. Currently exploring the world of agentic AI and Web3."
  )

  const [experienceData, setExperienceData] = useState([
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
  ])

  const [educationData, setEducationData] = useState([
    {
      id: 1,
      degree: "B.S. in Computer Science",
      school: "University of California, Berkeley",
      dates: "2015 - 2019"
    }
  ])

  const [personalData, setPersonalData] = useState({
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    portfolio: "johndoe.dev"
  })

  const [skillsData, setSkillsData] = useState(
    "React, Next.js, TypeScript, Node.js, Tailwind CSS, GraphQL, PostgreSQL, AWS"
  )

  const handleSave = () => {
    setEditingSection(null)
  }

  const handleCancel = () => {
    // In a real app we'd revert state here, for simplicity we just close the form
    setEditingSection(null)
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />
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
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={headerData.name} onChange={e => setHeaderData({...headerData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={headerData.title} onChange={e => setHeaderData({...headerData, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={headerData.location} onChange={e => setHeaderData({...headerData, location: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company</label>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={headerData.company} onChange={e => setHeaderData({...headerData, company: e.target.value})} />
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
                          <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">JD</span>
                        </div>
                        {/* Online Indicator */}
                        <span className="absolute bottom-2 right-2 block h-6 w-6 rounded-full border-4 border-background bg-green-500"></span>
                      </div>

                      {/* Basic Info */}
                      <div className="mb-2 space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{headerData.name}</h1>
                        <p className="text-lg font-medium text-foreground/80">{headerData.title}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {headerData.location}</span>
                          <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {headerData.company}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pb-2">
                      <Button variant="outline" size="sm" className="h-10 gap-2 rounded-full px-5">
                        <Share2 className="h-4 w-4" />
                        Share
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
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={aboutData}
                    onChange={(e) => setAboutData(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <p className="leading-relaxed text-muted-foreground">{aboutData}</p>
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
                  {experienceData.map((exp, index) => (
                    <div key={exp.id} className="rounded-lg border p-4 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Role</label>
                          <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={exp.role} onChange={(e) => {
                            setExperienceData(prev => prev.map((item, i) => i === index ? { ...item, role: e.target.value } : item));
                          }} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Company</label>
                          <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={exp.company} onChange={(e) => {
                            setExperienceData(prev => prev.map((item, i) => i === index ? { ...item, company: e.target.value } : item));
                          }} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-xs font-medium">Dates</label>
                          <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={exp.dates} onChange={(e) => {
                            setExperienceData(prev => prev.map((item, i) => i === index ? { ...item, dates: e.target.value } : item));
                          }} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-xs font-medium">Description</label>
                          <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={exp.description} onChange={(e) => {
                            setExperienceData(prev => prev.map((item, i) => i === index ? { ...item, description: e.target.value } : item));
                          }} />
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
                  {experienceData.map((exp, index) => (
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
                        <p className="mt-3 text-muted-foreground">
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
                  {educationData.map((edu, index) => (
                    <div key={edu.id} className="rounded-lg border p-4 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium">Degree</label>
                          <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={edu.degree} onChange={(e) => {
                            setEducationData(prev => prev.map((item, i) => i === index ? { ...item, degree: e.target.value } : item));
                          }} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium">School</label>
                          <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={edu.school} onChange={(e) => {
                            setEducationData(prev => prev.map((item, i) => i === index ? { ...item, school: e.target.value } : item));
                          }} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-xs font-medium">Dates</label>
                          <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={edu.dates} onChange={(e) => {
                            setEducationData(prev => prev.map((item, i) => i === index ? { ...item, dates: e.target.value } : item));
                          }} />
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
                  {educationData.map(edu => (
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
                    <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={personalData.email} onChange={(e) => setPersonalData({...personalData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Phone</label>
                    <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={personalData.phone} onChange={(e) => setPersonalData({...personalData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Portfolio</label>
                    <input className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" value={personalData.portfolio} onChange={(e) => setPersonalData({...personalData, portfolio: e.target.value})} />
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
                        <span className="font-medium break-all">{personalData.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <Phone className="h-4 w-4 text-foreground/70" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground">Phone</span>
                        <span className="font-medium">{personalData.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <LinkIcon className="h-4 w-4 text-foreground/70" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-muted-foreground">Portfolio</span>
                        <Link href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-400">{personalData.portfolio}</Link>
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
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                      value={skillsData} 
                      onChange={(e) => setSkillsData(e.target.value)} 
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                    <Button size="sm" onClick={handleSave}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skillsData.split(",").map((skill, i) => (
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
