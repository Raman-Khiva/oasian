"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import {
  getStoredProfile,
  saveStoredProfile,
  calculateProfileCompleteness,
  ProfileData
} from "@/lib/storage"
import {
  Sparkles,
  User,
  ArrowRight,
  X,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Code2,
  ChevronRight
} from "lucide-react"

const SESSION_REMINDER_KEY = "oasian_profile_prompt_skipped"

export function ProfilePrompt() {
  const { isSignedIn, user, isLoaded } = useUser()
  const pathname = usePathname()
  const router = useRouter()

  const [profile, setProfile] = useState<ProfileData>(getStoredProfile())
  const [showNameModal, setShowNameModal] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [fullNameInput, setFullNameInput] = useState("")
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

  // Sync profile data on mount and listen to storage updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfile(getStoredProfile())
    }
    window.addEventListener("oasian-profile-updated", handleProfileUpdate)
    return () => window.removeEventListener("oasian-profile-updated", handleProfileUpdate)
  }, [])

  // Check profile state when user is loaded
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    // Fetch database profile to be sure we have the latest data
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const dbProfile = data?.profile
        const current = getStoredProfile()
        const resolvedName =
          dbProfile?.name ||
          current.name ||
          (user.fullName ? user.fullName.trim() : "")

        const updated: ProfileData = {
          ...current,
          name: resolvedName,
          title: dbProfile?.title || current.title || "",
          location: dbProfile?.location || current.location || "",
          company: dbProfile?.company || current.company || "",
          about: dbProfile?.about || current.about || "",
          personal: {
            ...current.personal,
            email: dbProfile?.email || current.personal.email || user.primaryEmailAddress?.emailAddress || ""
          },
          skills: Array.isArray(dbProfile?.skills) ? dbProfile.skills.join(", ") : current.skills,
          experience: Array.isArray(dbProfile?.experience) && dbProfile.experience.length > 0 ? dbProfile.experience : current.experience,
          education: Array.isArray(dbProfile?.education) && dbProfile.education.length > 0 ? dbProfile.education : current.education
        }

        saveStoredProfile(updated)
        setProfile(updated)

        // 1. Check if user needs to provide their complete name
        if (!resolvedName || resolvedName.trim().length === 0 || resolvedName.toLowerCase() === "user") {
          setShowNameModal(true)
        } else {
          // 2. If name is already set, evaluate whether to ask for profile completion on this visit
          evaluateProfileCompletion(updated)
        }
      })
      .catch((err) => {
        console.warn("[ProfilePrompt] Check error:", err)
        const current = getStoredProfile()
        if (!current.name || current.name.trim().length === 0) {
          setShowNameModal(true)
        } else {
          evaluateProfileCompletion(current)
        }
      })
  }, [isLoaded, isSignedIn, user, pathname])

  // Evaluates profile completion and triggers prompt on each visit (skippable)
  const evaluateProfileCompletion = (prof: ProfileData) => {
    // Don't show completion prompt if already on /profile
    if (pathname === "/profile") return

    // Check if skipped for this browsing session
    const hasSkipped = typeof window !== "undefined" && sessionStorage.getItem(SESSION_REMINDER_KEY) === "true"
    if (hasSkipped) return

    const completeness = calculateProfileCompleteness(prof)

    // If profile is not complete (< 80%), prompt the user
    if (!completeness.isComplete) {
      setShowCompletionModal(true)
    }
  }

  // Handle saving complete name
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = fullNameInput.trim()

    if (!trimmed || trimmed.length < 2) {
      setNameError("Please enter your first and last name.")
      return
    }

    setSavingName(true)
    setNameError(null)

    try {
      const updated: ProfileData = {
        ...profile,
        name: trimmed
      }

      // Persist to Neon DB
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      })

      saveStoredProfile(updated)
      setProfile(updated)
      setShowNameModal(false)

      // Next, check if completion modal should be shown
      evaluateProfileCompletion(updated)
    } catch (err: any) {
      setNameError(err.message || "Failed to save your name. Please try again.")
    } finally {
      setSavingName(false)
    }
  }

  // Handle skip for this visit
  const handleSkipCompletion = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_REMINDER_KEY, "true")
    }
    setShowCompletionModal(false)
  }

  // Handle redirect to profile
  const handleGoToProfile = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_REMINDER_KEY, "true")
    }
    setShowCompletionModal(false)
    router.push("/profile")
  }

  const completeness = calculateProfileCompleteness(profile)

  return (
    <>
      {/* 1. NAME PROMPT MODAL (REQUIRED ON SIGN UP IF NAME NOT SET) */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4 shadow-sm">
              <User className="h-6 w-6" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Welcome to Oasian!
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Please provide your complete full name so recruiters, companies, and ATS matchers can recognize you.
            </p>

            <form onSubmit={handleSaveName} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name (First & Last Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Ramandeep Singh"
                  value={fullNameInput}
                  onChange={(e) => {
                    setFullNameInput(e.target.value)
                    if (nameError) setNameError(null)
                  }}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {nameError && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {nameError}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="submit"
                  disabled={savingName || !fullNameInput.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm h-10 shadow-sm"
                >
                  {savingName ? "Saving name..." : "Save & Continue"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. SKIPPABLE PROFILE COMPLETION REMINDER (TRIGGERED ON EACH VISIT IF INCOMPLETE) */}
      {showCompletionModal && !showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Dismiss Button */}
            <button
              onClick={handleSkipCompletion}
              aria-label="Skip for now"
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                <Sparkles className="h-3 w-3 text-amber-600" />
                Profile Incomplete ({completeness.score}%)
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {profile.name ? `Hi ${profile.name.split(" ")[0]}, complete your profile` : "Complete your profile"}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Profiles with complete education, skills, and experience receive up to <strong>5x more job match opportunities</strong> and higher ATS callback scores.
            </p>

            {/* Progress Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Profile Strength</span>
                <span className="text-blue-600">{completeness.score}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${completeness.score}%` }}
                />
              </div>
            </div>

            {/* Missing Sections Highlights */}
            {completeness.missingItems.length > 0 && (
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Sections to complete:
                </span>
                <div className="space-y-1.5">
                  {completeness.missingItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2">
              <Button
                onClick={handleGoToProfile}
                className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 gap-1.5 shadow-sm"
              >
                Complete Profile Now
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                onClick={handleSkipCompletion}
                className="w-full sm:w-auto text-xs h-9 border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
