import { NextRequest, NextResponse } from "next/server"
import { getCurrentDbUser } from "@/lib/auth"
import prisma from "@workspace/db"

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser()

    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to access your profile" },
        { status: 401 }
      )
    }

    // Fetch fresh profile from DB
    const profile = await prisma.profile.findUnique({
      where: { userId: dbUser.id },
    })

    return NextResponse.json({
      success: true,
      profile: profile || dbUser.profile,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        imageUrl: dbUser.imageUrl,
      },
    })
  } catch (error: any) {
    console.error("[/api/profile GET] Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile", details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const dbUser = await getCurrentDbUser()

    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to update your profile" },
        { status: 401 }
      )
    }

    const data = await req.json()

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: dbUser.id },
      create: {
        userId: dbUser.id,
        name: data.name || dbUser.name || "",
        title: data.title || "",
        location: data.location || null,
        company: data.company || null,
        about: data.about || null,
        skills: Array.isArray(data.skills)
          ? data.skills
          : typeof data.skills === "string"
          ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
        email: data.email || dbUser.email || null,
        phone: data.phone || null,
        portfolio: data.portfolio || null,
        experience: data.experience ?? [],
        education: data.education ?? [],
        syncedWithResumeId: data.syncedWithResumeId || null,
        lastSyncedAt: data.lastSyncedAt ? new Date(data.lastSyncedAt) : null,
      },
      update: {
        name: data.name ?? undefined,
        title: data.title ?? undefined,
        location: data.location ?? undefined,
        company: data.company ?? undefined,
        about: data.about ?? undefined,
        skills: Array.isArray(data.skills)
          ? data.skills
          : typeof data.skills === "string"
          ? data.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
          : undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        portfolio: data.portfolio ?? undefined,
        experience: data.experience ?? undefined,
        education: data.education ?? undefined,
        syncedWithResumeId: data.syncedWithResumeId ?? undefined,
        lastSyncedAt: data.lastSyncedAt ? new Date(data.lastSyncedAt) : undefined,
      },
    })

    // Also update User name if provided
    if (data.name && data.name !== dbUser.name) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { name: data.name },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Profile saved successfully in Neon DB",
      profile: updatedProfile,
    })
  } catch (error: any) {
    console.error("[/api/profile PUT] Error:", error)
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    )
  }
}
