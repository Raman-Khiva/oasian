"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Sparkles, Briefcase, User, Menu, X, FileText } from "lucide-react"
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    {
      name: "Resume Analyser",
      href: "/resume",
      icon: Sparkles,
      badge: "AI Builder"
    },
    {
      name: "Find Jobs",
      href: "/jobs",
      icon: Briefcase,
      badge: "20 Active"
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User
    }
  ]

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 w-full items-center justify-between px-4 md:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-2xl font-black tracking-tight text-transparent">
              oasian
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 text-sm font-medium md:flex ml-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-2 rounded-lg px-3.5 py-2 transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/50 dark:text-blue-300"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`} />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/resume">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-violet-700">
              <Sparkles className="h-4 w-4" />
              Analyze Resume
            </Button>
          </Link>
          <SignInButton/>
          <SignUpButton/>
          <UserButton/>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/resume">
            <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 h-8 px-3 text-xs">
              Analyze
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="h-9 w-9"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b bg-background px-4 py-4 md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/50 dark:text-blue-300"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Sub-banner */}
      <div className="border-t border-foreground/10 bg-foreground/1 px-4 py-1.5 text-center text-xs font-medium text-foreground sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-blue-600">AI Resume Engine 2.0 Live:</span>
          Upload your resume for instant ATS scoring, personalized fixes, and 3 matched job opportunities!
        </span>
      </div>
    </header>
  )
}
