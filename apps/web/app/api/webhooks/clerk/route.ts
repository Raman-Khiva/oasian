import { NextRequest, NextResponse } from "next/server"
import { Webhook } from "svix"
import { headers } from "next/headers"
import { syncUserWithDb, deleteDbUser } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: any = payload

  // If a webhook secret is configured, verify signature using Svix
  if (WEBHOOK_SECRET) {
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: "Missing required svix headers for webhook verification" },
        { status: 400 }
      )
    }

    const wh = new Webhook(WEBHOOK_SECRET)
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      })
    } catch (err) {
      console.error("[Clerk Webhook] Signature verification failed:", err)
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      )
    }
  } else {
    // In local dev without webhook secret configured yet, warn in console
    console.warn(
      "[Clerk Webhook] Warning: CLERK_WEBHOOK_SECRET is not set. Processing event without signature verification."
    )
  }

  const eventType = evt.type
  console.log(`[Clerk Webhook] Received event: ${eventType} for ID: ${evt.data?.id}`)

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const user = await syncUserWithDb(evt.data)
        console.log(`[Clerk Webhook] Successfully synced user ${user.id} (${user.email}) to Neon DB`)
        return NextResponse.json({
          success: true,
          message: `User ${user.id} synced with database`,
          userId: user.id,
        })
      }

      case "user.deleted": {
        const clerkId = evt.data.id
        if (clerkId) {
          await deleteDbUser(clerkId)
          console.log(`[Clerk Webhook] Deleted user ${clerkId} from Neon DB`)
        }
        return NextResponse.json({
          success: true,
          message: `User ${clerkId} deleted from database`,
        })
      }

      default:
        console.log(`[Clerk Webhook] Unhandled event type: ${eventType}`)
        return NextResponse.json({
          success: true,
          message: `Ignored unhandled event ${eventType}`,
        })
    }
  } catch (error: any) {
    console.error(`[Clerk Webhook] Error processing ${eventType}:`, error)
    return NextResponse.json(
      { error: "Database operation failed", details: error.message },
      { status: 500 }
    )
  }
}
