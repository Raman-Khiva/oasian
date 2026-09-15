"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Sparkles, Briefcase, User, Menu, X, FileText } from "lucide-react"
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    {
      name: "Resume Analyser",
      href: "/resume",
      icon: Sparkles
    },
    {
      name: "Find Jobs",
      href: "/jobs",
      icon: Briefcase
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
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{link.name}</span>
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
          
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="font-semibold text-foreground/80 hover:text-foreground">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm font-semibold">
                Sign Up
              </Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3 pl-1">
              <UserButton
                userProfileMode="modal"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 ring-blue-500/20 hover:ring-blue-500/50 transition-all",
                  },
                }}
              />
            </div>
          </Show>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Show when="signed-in">
            <UserButton userProfileMode="modal" />
          </Show>
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
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <span>{link.name}</span>
                  </div>
                </Link>
              )
            })}
          </nav>

          <div className="mt-4 pt-4 border-t flex flex-col gap-2">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline" className="w-full justify-center">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="w-full justify-center bg-blue-600 text-white hover:bg-blue-700">
                  Sign Up Free
                </Button>
              </SignUpButton>
            </Show>
          </div>
        </div>
      )}
    </header>
  )
}
