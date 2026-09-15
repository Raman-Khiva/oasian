import { NextRequest, NextResponse } from "next/server"
import prisma from "@workspace/db"
import { getCurrentDbUser } from "@/lib/auth"

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser()
    if (!dbUser) {
      return NextResponse.json({ resumes: [] })
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: dbUser.id },
      include: {
        analyses: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      resumes,
    })
  } catch (error: any) {
    console.error("[/api/resume GET] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch resumes", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const dbUser = await getCurrentDbUser()
    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to save resumes" },
        { status: 401 }
      )
    }

    const data = await req.json()
    const {
      versionName = "v1 - Original",
      versionNumber = 1,
      isCurrent = true,
      personal,
      skills,
      experience,
      education,
      projects,
      certifications,
      analysis,
    } = data

    // If setting as current, unset previous current resumes
    if (isCurrent) {
      await prisma.resume.updateMany({
        where: { userId: dbUser.id, isCurrent: true },
        data: { isCurrent: false },
      })
    }

    // Create the resume in DB
    const resume = await prisma.resume.create({
      data: {
        userId: dbUser.id,
        versionName,
        versionNumber,
        isCurrent,
        fullName: personal?.fullName || dbUser.name || "My Resume",
        title: personal?.title || "Developer",
        email: personal?.email || dbUser.email,
        phone: personal?.phone || null,
        location: personal?.location || null,
        portfolio: personal?.portfolio || null,
        linkedin: personal?.linkedin || null,
        github: personal?.github || null,
        summary: personal?.summary || null,
        skills: Array.isArray(skills) ? skills : [],
        experience: experience || [],
        education: education || [],
        projects: projects || [],
        certifications: certifications || [],
        analyses: analysis
          ? {
              create: {
                overallScore: analysis.overallScore || 0,
                atsScore: analysis.atsScore || 0,
                impactScore: analysis.impactScore || 0,
                brevityScore: analysis.brevityScore || 0,
                skillsScore: analysis.skillsScore || 0,
                keySummary: analysis.keySummary || "Resume Analysis Completed",
                strongSections: analysis.strongSections || [],
                weakSections: analysis.weakSections || [],
                missingOrErrors: analysis.missingOrErrors || [],
                improvements: analysis.improvements || [],
                targetRoles: analysis.targetRoles || [],
                recommendedJobIds: analysis.recommendedJobIds || [],
              },
            }
          : undefined,
      },
      include: {
        analyses: true,
      },
    })

    return NextResponse.json({
      success: true,
      resume,
      message: "Resume saved to database",
    })
  } catch (error: any) {
    console.error("[/api/resume POST] Error:", error)
    return NextResponse.json(
      { error: "Failed to save resume", details: error.message },
      { status: 500 }
    )
  }
}
