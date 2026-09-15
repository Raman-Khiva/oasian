import { currentUser } from "@clerk/nextjs/server"
import prisma, { User, Profile } from "@workspace/db"

export type DbUserWithRelations = User & {
  profile: Profile | null
  resumes?: any[]
  savedJobs?: any[]
  applications?: any[]
}

interface ClerkUserData {
  id: string
  emailAddresses?: Array<{ emailAddress: string }>
  primaryEmailAddressId?: string | null
  firstName?: string | null
  lastName?: string | null
  imageUrl?: string | null
  username?: string | null
}

/**
 * Extracts normalized email and display name from a Clerk User object or Webhook data
 */
export function extractClerkProfile(user: ClerkUserData) {
  const email =
    user.emailAddresses?.[0]?.emailAddress ||
    (user as any).email ||
    ""

  const fullName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()

  const displayName = fullName || user.username || ""
  const imageUrl = user.imageUrl || null

  return { email, displayName, imageUrl }
}

/**
 * Syncs or creates a Clerk user in the Prisma / Neon PostgreSQL database.
 * If user does not exist, creates the User and a default linked Profile without mock placeholders.
 */
export async function syncUserWithDb(user: ClerkUserData): Promise<DbUserWithRelations> {
  const { email, displayName, imageUrl } = extractClerkProfile(user)

  if (!user.id) {
    throw new Error("Missing Clerk user ID for database synchronization")
  }

  // Find or upsert user
  const dbUser = await prisma.user.upsert({
    where: { clerkId: user.id },
    create: {
      clerkId: user.id,
      email: email || `${user.id}@clerk.user`,
      name: displayName || null,
      imageUrl,
      profile: {
        create: {
          name: displayName || "",
          email: email || undefined,
          title: "",
          location: "",
          company: "",
          about: "",
          skills: [],
          experience: [],
          education: [],
        },
      },
    },
    update: {
      email: email || undefined,
      name: displayName ? displayName : undefined,
      imageUrl: imageUrl || undefined,
    },
    include: {
      profile: true,
      resumes: {
        orderBy: { updatedAt: "desc" },
        take: 5,
      },
      savedJobs: {
        include: { job: true },
      },
      applications: {
        include: { job: true },
      },
    },
  })

  // Ensure profile exists if user was created earlier without one
  if (!dbUser.profile) {
    const newProfile = await prisma.profile.create({
      data: {
        userId: dbUser.id,
        name: displayName || "",
        email: email || undefined,
        title: "",
        location: "",
        company: "",
        about: "",
        skills: [],
        experience: [],
        education: [],
      },
    })
    return { ...dbUser, profile: newProfile }
  }

  return dbUser
}

/**
 * Helper for Server Components, Route Handlers, and Server Actions:
 * Retrieves current authenticated Clerk user and ensures they exist in Neon DB.
 * Returns null if the request is unauthenticated.
 */
export async function getCurrentDbUser(): Promise<DbUserWithRelations | null> {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return null
    }

    return await syncUserWithDb(clerkUser)
  } catch (error) {
    console.error("[getCurrentDbUser] Failed to retrieve or sync DB user:", error)
    return null
  }
}

/**
 * Delete a user from Neon PostgreSQL by their Clerk ID.
 */
export async function deleteDbUser(clerkId: string) {
  try {
    return await prisma.user.delete({
      where: { clerkId },
    })
  } catch (error: any) {
    // If user already deleted or doesn't exist, ignore
    if (error.code === "P2025") {
      return null
    }
    throw error
  }
}
