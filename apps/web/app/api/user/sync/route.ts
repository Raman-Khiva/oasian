import { NextResponse } from "next/server"
import { getCurrentDbUser } from "@/lib/auth"

export async function GET() {
  try {
    const dbUser = await getCurrentDbUser()

    if (!dbUser) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        name: dbUser.name,
        imageUrl: dbUser.imageUrl,
        profile: dbUser.profile,
        createdAt: dbUser.createdAt,
      },
    })
  } catch (error: any) {
    console.error("[/api/user/sync] Error syncing user:", error)
    return NextResponse.json(
      { error: "Failed to sync user with database", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST() {
  return GET()
}
