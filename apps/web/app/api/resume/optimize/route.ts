import { NextRequest, NextResponse } from "next/server"
import { optimizeResumeWithGroq, GROQ_RESUME_MODEL } from "@/lib/groq"
import { ResumeData } from "@/lib/resume-types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const resume: ResumeData = body.resume

    if (!resume) {
      return NextResponse.json(
        { error: "Resume data is required for optimization." },
        { status: 400 }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          error: "GROQ_API_KEY is not configured in the server environment.",
          details: "Please ensure GROQ_API_KEY is defined in .env or apps/web/.env"
        },
        { status: 500 }
      )
    }

    const { improvedResume, feedback } = await optimizeResumeWithGroq(resume)

    return NextResponse.json({
      success: true,
      model: GROQ_RESUME_MODEL,
      improvedResume,
      feedback
    })
  } catch (error: any) {
    console.error("[/api/resume/optimize POST] Groq optimize error:", error)
    return NextResponse.json(
      {
        error: "Failed to optimize resume with Groq SDK",
        details: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}
