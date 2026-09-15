import { extractText } from "unpdf"

export interface ExtractedDocument {
  text: string
  pageCount?: number
}

/**
 * Extracts clean, readable text from uploaded document buffers (PDF, TXT, MD, JSON).
 */
export async function extractTextFromDocument(
  buffer: ArrayBuffer | Uint8Array,
  fileName: string,
  mimeType?: string
): Promise<ExtractedDocument> {
  const isPdf =
    fileName.toLowerCase().endsWith(".pdf") ||
    mimeType === "application/pdf"

  if (isPdf) {
    try {
      const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
      const res = await extractText(uint8, { mergePages: true })
      
      const rawText = Array.isArray(res.text) 
        ? res.text.join("\n\n") 
        : String(res.text || "")

      const cleanText = rawText
        .replaceAll("\0", "")
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .trim()

      if (!cleanText || cleanText.length < 20) {
        throw new Error(
          "The uploaded PDF has no readable text. It might be a scanned image or flattened raster graphic. Please upload a PDF with selectable text."
        )
      }

      return {
        text: cleanText,
        pageCount: res.totalPages
      }
    } catch (err: any) {
      if (err.message?.includes("scanned image")) {
        throw err
      }
      console.error("[DocumentParser] PDF extraction error:", err)
      throw new Error(`Failed to parse PDF document: ${err.message || String(err)}`)
    }
  }

  // Plain text / Markdown / JSON
  try {
    const textDecoder = new TextDecoder("utf-8")
    const uint8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
    const text = textDecoder.decode(uint8).trim()

    if (!text) {
      throw new Error("The uploaded file is empty.")
    }

    return {
      text,
      pageCount: 1
    }
  } catch (err: any) {
    console.error("[DocumentParser] Text decode error:", err)
    throw new Error(`Failed to read file content: ${err.message || String(err)}`)
  }
}
