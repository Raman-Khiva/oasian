import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { FileText } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-background to-background dark:from-violet-950/30 dark:via-background dark:to-background" />

      {/* Brand Header */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <FileText className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-3xl font-black tracking-tight text-transparent">
            oasian
          </span>
        </Link>
        <p className="text-sm text-muted-foreground">
          Create an account to unlock AI resume optimization and job matchmaking.
        </p>
      </div>

      <div className="w-full max-w-md flex justify-center">
        <SignUp
          appearance={{
            elements: {
              card: "shadow-xl border border-border bg-card/95 backdrop-blur-sm rounded-2xl",
              primaryButton: "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-md shadow-blue-500/20",
              headerTitle: "text-foreground font-bold",
              headerSubtitle: "text-muted-foreground",
              formFieldLabel: "text-foreground font-medium",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
              footerActionLink: "text-blue-600 hover:text-blue-500 font-semibold"
            }
          }}
          routing="path"
          path="/sign-up"
        />
      </div>
    </div>
  )
}
