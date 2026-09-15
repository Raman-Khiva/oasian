import { NextRequest, NextResponse } from "next/server"
import { 
  analyzeResumeWithGroq, 
  extractResumeWithGroq, 
  GROQ_RESUME_MODEL 
} from "@/lib/groq"
import { extractTextFromDocument } from "@/lib/document-parser"
import { ResumeData } from "@/lib/resume-types"

export async function GET() {
  const hasKey = Boolean(process.env.GROQ_API_KEY)
  return NextResponse.json({
    status: "ok",
    model: GROQ_RESUME_MODEL,
    hasApiKey: hasKey,
    provider: "Groq LPU Inference"
  })
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          error: "GROQ_API_KEY is not configured in the server environment.",
          details: "Please ensure GROQ_API_KEY is defined in .env or apps/web/.env"
        },
        { status: 500 }
      )
    }

    const contentType = req.headers.get("content-type") || ""

    // Case 1: Uploading a file (PDF, TXT, MD, JSON) via multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const file = formData.get("file") as File | null

      if (!file) {
        return NextResponse.json(
          { error: "No file was uploaded in the request." },
          { status: 400 }
        )
      }

      // 1. Extract raw text from the document (PDF via unpdf, TXT, MD)
      const arrayBuffer = await file.arrayBuffer()
      const { text: rawText } = await extractTextFromDocument(
        arrayBuffer,
        file.name,
        file.type
      )

      // 2. Extract structured ResumeData using Groq SDK and the actual model
      const resume = await extractResumeWithGroq(rawText, file.name)

      // 3. Analyze the extracted resume using Groq SDK
      const feedback = await analyzeResumeWithGroq(resume, rawText)

      return NextResponse.json({
        success: true,
        model: GROQ_RESUME_MODEL,
        resume,
        rawText,
        feedback
      })
    }

    // Case 2: JSON payload (Pasting raw text or re-scanning existing resume)
    const body = await req.json().catch(() => ({}))
    const rawText: string | undefined = body.rawText
    let resume: ResumeData = body.resume

    if (!resume) {
      if (rawText && typeof rawText === "string" && rawText.trim().length > 0) {
        // Extract structured resume data from raw text using Groq
        resume = await extractResumeWithGroq(rawText, "Pasted Resume")
      } else {
        return NextResponse.json(
          { error: "Resume data or rawText is required for analysis." },
          { status: 400 }
        )
      }
    }

    const feedback = await analyzeResumeWithGroq(resume, rawText)

    return NextResponse.json({
      success: true,
      model: GROQ_RESUME_MODEL,
      resume,
      rawText,
      feedback
    })
  } catch (error: any) {
    console.error("[/api/resume/analyze POST] Groq analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze resume with Groq SDK",
        details: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}
