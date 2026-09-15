import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UserSync } from "@/components/user-sync"
import { ProfilePrompt } from "@/components/profile-prompt"
import { cn } from "@workspace/ui/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Oasian - AI Resume Analyser & Career Platform",
  description: "Intelligent ATS resume diagnostics, instant scoring, and personalized career matchmaking.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "light antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
      style={{ colorScheme: "light" }}
    >
      <body className="bg-white text-slate-900">
        <ClerkProvider>
          <ThemeProvider>
            <UserSync />
            <ProfilePrompt />
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
