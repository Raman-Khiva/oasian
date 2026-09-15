import { NextRequest, NextResponse } from "next/server"
import prisma from "@workspace/db"
import { getCurrentDbUser } from "@/lib/auth"

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser()
    if (!dbUser) {
      return NextResponse.json({ applications: [], appliedJobIds: [] })
    }

    const applications = await prisma.jobApplication.findMany({
      where: { userId: dbUser.id },
      include: { job: true },
      orderBy: { appliedAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      applications,
      appliedJobIds: applications.map((a: any) => a.jobId),
    })
  } catch (error: any) {
    console.error("[/api/jobs/apply GET] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch job applications", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const dbUser = await getCurrentDbUser()
    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to apply for jobs" },
        { status: 401 }
      )
    }

    const { jobId, resumeVersion, notes } = await req.json()
    if (!jobId) {
      return NextResponse.json(
        { error: "jobId is required" },
        { status: 400 }
      )
    }

    // Upsert application
    const application = await prisma.jobApplication.upsert({
      where: {
        userId_jobId: {
          userId: dbUser.id,
          jobId,
        },
      },
      create: {
        userId: dbUser.id,
        jobId,
        resumeVersion: resumeVersion || "v1 - Default Profile",
        status: "applied",
        notes: notes || null,
      },
      update: {
        resumeVersion: resumeVersion || undefined,
        notes: notes || undefined,
        updatedAt: new Date(),
      },
    })

    // Increment applicant count on the Job
    await prisma.job.update({
      where: { id: jobId },
      data: {
        applicantCount: { increment: 1 },
      },
    }).catch(() => {
      // Ignore if job id not found or count increment fails
    })

    return NextResponse.json({
      success: true,
      application,
      message: "Application submitted successfully",
    })
  } catch (error: any) {
    console.error("[/api/jobs/apply POST] Error:", error)
    return NextResponse.json(
      { error: "Failed to submit application", details: error.message },
      { status: 500 }
    )
  }
}
