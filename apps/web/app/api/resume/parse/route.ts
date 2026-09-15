import { NextRequest, NextResponse } from "next/server"
import { extractResumeWithGroq, GROQ_RESUME_MODEL } from "@/lib/groq"
import { extractTextFromDocument } from "@/lib/document-parser"

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

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const file = formData.get("file") as File | null

      if (!file) {
        return NextResponse.json(
          { error: "No file was uploaded in the request." },
          { status: 400 }
        )
      }

      const arrayBuffer = await file.arrayBuffer()
      const { text: rawText, pageCount } = await extractTextFromDocument(
        arrayBuffer,
        file.name,
        file.type
      )

      const resume = await extractResumeWithGroq(rawText, file.name)

      return NextResponse.json({
        success: true,
        model: GROQ_RESUME_MODEL,
        resume,
        rawText,
        pageCount
      })
    }

    const body = await req.json().catch(() => ({}))
    const rawText: string | undefined = body.rawText

    if (!rawText || typeof rawText !== "string" || !rawText.trim()) {
      return NextResponse.json(
        { error: "rawText string is required for resume parsing." },
        { status: 400 }
      )
    }

    const resume = await extractResumeWithGroq(rawText, "Pasted Resume")

    return NextResponse.json({
      success: true,
      model: GROQ_RESUME_MODEL,
      resume,
      rawText
    })
  } catch (error: any) {
    console.error("[/api/resume/parse POST] Parse error:", error)
    return NextResponse.json(
      {
        error: "Failed to parse resume with Groq SDK",
        details: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}
