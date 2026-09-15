import { NextRequest, NextResponse } from "next/server"
import prisma from "@workspace/db"
import { getCurrentDbUser } from "@/lib/auth"

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser()
    if (!dbUser) {
      return NextResponse.json({ savedJobIds: [] })
    }

    const saved = await prisma.savedJob.findMany({
      where: { userId: dbUser.id },
      include: { job: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      savedJobs: saved.map((s: any) => s.job),
      savedJobIds: saved.map((s: any) => s.jobId),
    })
  } catch (error: any) {
    console.error("[/api/jobs/saved GET] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch saved jobs", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const dbUser = await getCurrentDbUser()
    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to save jobs" },
        { status: 401 }
      )
    }

    const { jobId } = await req.json()
    if (!jobId) {
      return NextResponse.json(
        { error: "jobId is required" },
        { status: 400 }
      )
    }

    // Check if already saved
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: dbUser.id,
          jobId,
        },
      },
    })

    let isSaved: boolean
    if (existing) {
      await prisma.savedJob.delete({
        where: { id: existing.id },
      })
      isSaved = false
    } else {
      await prisma.savedJob.create({
        data: {
          userId: dbUser.id,
          jobId,
        },
      })
      isSaved = true
    }

    // Return current list of saved IDs
    const currentSaved = await prisma.savedJob.findMany({
      where: { userId: dbUser.id },
      select: { jobId: true },
    })

    return NextResponse.json({
      success: true,
      isSaved,
      savedJobIds: currentSaved.map((s: any) => s.jobId),
      message: isSaved ? "Job saved to your profile" : "Job removed from saved",
    })
  } catch (error: any) {
    console.error("[/api/jobs/saved POST] Error:", error)
    return NextResponse.json(
      { error: "Failed to update saved job", details: error.message },
      { status: 500 }
    )
  }
}
