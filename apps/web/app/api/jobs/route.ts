import { NextResponse } from "next/server"
import prisma from "@workspace/db"
import { getCurrentDbUser } from "@/lib/auth"
import { DUMMY_JOBS } from "@/lib/jobs-data"

export async function GET() {
  try {
    let jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    })

    // If database is empty, automatically seed initial jobs from dummy data
    if (jobs.length === 0) {
      console.log("[/api/jobs] Jobs table is empty. Auto-seeding initial jobs into Neon DB...")
      for (const dj of DUMMY_JOBS) {
        await prisma.job.upsert({
          where: { id: dj.id },
          create: {
            id: dj.id,
            title: dj.title,
            company: dj.company,
            companyLogo: dj.companyLogo || "CP",
            companyColor: dj.companyColor || "from-blue-600 to-indigo-600",
            location: dj.location,
            workplaceType: dj.workplaceType,
            jobType: dj.jobType,
            salary: dj.salary,
            experience: dj.experience,
            category: dj.category,
            tags: dj.tags || [],
            featured: Boolean(dj.featured),
            department: dj.department || "Engineering",
            applicantCount: dj.applicantCount || 0,
            description: dj.description,
            responsibilities: dj.responsibilities || [],
            requirements: dj.requirements || [],
            benefits: dj.benefits || [],
            postedDate: dj.postedDate || "Recently",
          },
          update: {},
        })
      }

      jobs = await prisma.job.findMany({
        orderBy: { createdAt: "desc" },
      })
    }

    // Check if user is authenticated to decorate jobs with saved & applied status
    const dbUser = await getCurrentDbUser()

    let savedJobIds: string[] = []
    let appliedJobIds: string[] = []

    if (dbUser) {
      const saved = await prisma.savedJob.findMany({
        where: { userId: dbUser.id },
        select: { jobId: true },
      })
      savedJobIds = saved.map((s) => s.jobId)

      const applied = await prisma.jobApplication.findMany({
        where: { userId: dbUser.id },
        select: { jobId: true },
      })
      appliedJobIds = applied.map((a) => a.jobId)
    }

    const enhancedJobs = jobs.map((j) => ({
      ...j,
      isSaved: savedJobIds.includes(j.id),
      isApplied: appliedJobIds.includes(j.id),
    }))

    return NextResponse.json({
      success: true,
      jobs: enhancedJobs,
      savedJobIds,
      appliedJobIds,
      user: dbUser
        ? {
            id: dbUser.id,
            clerkId: dbUser.clerkId,
            email: dbUser.email,
            name: dbUser.name,
          }
        : null,
    })
  } catch (error: any) {
    console.error("[/api/jobs GET] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: error.message },
      { status: 500 }
    )
  }
}
