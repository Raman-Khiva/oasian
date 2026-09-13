import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Button } from "@workspace/ui/components/button"
import { 
  Sparkles, 
  FileText, 
  Briefcase, 
  RefreshCw, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Award
} from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Feature Section */}
        <section id="features" className="py-20 border-t bg-muted/20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
                Next-Gen Career Launchpad
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Designed to Analyze, Optimize, and Land Offers
              </h2>
              <p className="text-muted-foreground text-base">
                Oasian merges intelligent resume diagnostics, a high-converting builder, profile synchronization, and precision job matchmaking into one fluid workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="rounded-2xl border bg-card p-6 shadow-xs hover:border-blue-400 transition-all hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 mb-4">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">AI Resume Analyser</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Instant ATS score, section-by-section breakdown (strong vs weak points), error audits, and missing metric detection.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Link href="/resume" className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                    Try Analyser <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border bg-card p-6 shadow-xs hover:border-blue-400 transition-all hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 mb-4">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">1-Click Builder & v2</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Automatically generates an optimized version considering points found during analysis, injecting power verbs and ROI metrics.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Link href="/resume" className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                    Build Version 2 <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border bg-card p-6 shadow-xs hover:border-blue-400 transition-all hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-4">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">Profile Auto-Sync</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Seamless two-way sync keeps your public profile and tailored resume versions updated without duplicate manual editing.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Link href="/profile" className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                    View Profile <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border bg-card p-6 shadow-xs hover:border-blue-400 transition-all hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mb-4">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg">Smart Job Matches</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Top 3 personalized recommendations directly based on your resume, plus 20 active full-time and remote tech openings.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Link href="/jobs" className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                    Explore 20 Jobs <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick CTA Banner */}
            <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-black">
                  Ready to upgrade your resume and get hired?
                </h3>
                <p className="text-blue-100 text-sm max-w-xl">
                  Upload your resume in seconds, review your diagnostic score, and explore 20 live tech roles tailored to you.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/resume">
                  <Button size="lg" className="h-12 bg-white text-blue-700 font-bold hover:bg-blue-50 shadow-md">
                    Start Resume Scan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button size="lg" variant="outline" className="h-12 border-white/40 text-white hover:bg-white/10">
                    Browse All Jobs
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  )
}
