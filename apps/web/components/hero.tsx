import Image from "next/image"
import { Button } from "@workspace/ui/components/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-14 md:pt-16 lg:pt-14">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-background to-background dark:from-blue-900/20 dark:via-background dark:to-background"></div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-sm font-medium text-foreground">
                <span className="relative mr-3 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                </span>
                <span className="backdrop-blur-sm">
                  The Ultimate Platform for Students & Pros
                </span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none">
                Skill Up & Get Hired with{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Oasian
                </span>
              </h1>
              <p className="mx-auto max-w-[600px] text-lg text-muted-foreground sm:text-xl lg:mx-0">
                Oasian is your all-in-one platform to upgrade your skills,
                participate in hackathons, and land your dream job or
                internship. Like Internshala and Unstop, but built for the
                future.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 min-[400px]:flex-row lg:justify-start">
              <Button
                size="lg"
                className="group h-12 bg-blue-600 px-8 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700"
              >
                Coming Soon
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 bg-background/50 px-8 backdrop-blur-sm"
              >
                Join Waitlist
              </Button>
            </div>

            <div className="mx-auto flex w-fit items-center justify-center gap-4 border-t pt-4 text-sm text-muted-foreground lg:mx-0 lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="inline-block h-8 w-8 overflow-hidden rounded-full bg-muted ring-2 ring-background"
                  >
                    {/* Placeholder for user avatars */}
                    <div className="h-full w-full bg-gradient-to-br from-blue-200 to-violet-200 dark:from-blue-800 dark:to-violet-800" />
                  </div>
                ))}
              </div>
              <p>
                Join{" "}
                <span className="font-semibold text-foreground">10,000+</span>{" "}
                students waiting
              </p>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative mx-auto flex w-full max-w-[500px] items-center justify-center lg:max-w-none lg:justify-end">
            {/* Decorative blob behind image */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-400/20 to-violet-400/20 blur-3xl"></div>

            <div className="relative aspect-square w-full max-w-[600px]">
              <Image
                src="/hero-illustration.svg"
                alt="Student jumping with graduation cap and briefcase"
                fill
                priority
                className="animate-in object-contain drop-shadow-2xl duration-1000 fade-in zoom-in"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
        {/* Quote Section */}
        <div className="mt-16 flex animate-in justify-center text-center delay-300 duration-1000 fade-in slide-in-from-bottom-4">
          <div className="max-w-2xl border-t border-foreground/10 pt-2">
            <p className="text-lg text-muted-foreground italic">
              &quot;Maa kasam, jiwan ke L lage pade hain.&quot;
            </p>
            <p className="mt-2 text-end font-semibold text-foreground/70">
              - Naman Jain,{" "}
              <span className="font-normal text-muted-foreground">Founder</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
