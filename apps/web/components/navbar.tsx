"use client"

import Link from "next/link"
import { Button } from "@workspace/ui/components/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex w-full flex-col border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 w-full items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-2xl font-bold text-transparent">
              oasian
            </span>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="#features"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Features
          </Link>
          <Link
            href="#jobs"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Jobs
          </Link>
          <Link
            href="#skills"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Upskill
          </Link>
          <Link
            href="/profile"
            className="text-foreground/60 transition-colors hover:text-foreground/80"
          >
            Profile
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:inline-flex">
            Log in
          </Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            Sign up
          </Button>
        </div>
      </div>
      <div className="border-t border-foreground/10 bg-foreground/1 px-4 py-2 text-center text-sm font-medium text-foreground sm:px-6 lg:px-8">
        <span className="font-bold text-blue-600">Congratulations!</span>{" "}
        Website is live now. We have made our first move. ✨
      </div>
    </header>
  )
}
