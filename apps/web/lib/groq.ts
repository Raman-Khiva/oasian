import Groq from "groq-sdk"
import { 
  ResumeData, 
  AnalysisFeedback, 
  SectionScore, 
  WeakSection, 
  MissingOrError
} from "./resume-types"
import { DUMMY_JOBS } from "./jobs-data"
import { matchJobsForResume } from "./resume-analyzer"

export const GROQ_RESUME_MODEL = process.env.GROQ_RESUME_MODEL || "openai/gpt-oss-120b"

let groqInstance: Groq | null = null

export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured in environment variables. Please add GROQ_API_KEY to your .env file."
    )
  }
  if (!groqInstance) {
    groqInstance = new Groq({ apiKey })
  }
  return groqInstance
}

interface GroqAnalysisRawOutput {
  overallScore?: number
  atsScore?: number
  impactScore?: number
  brevityScore?: number
  skillsScore?: number
  keySummary?: string
  strongSections?: SectionScore[]
  weakSections?: WeakSection[]
  missingOrErrors?: MissingOrError[]
  improvements?: Array<{
    id?: string
    section?: "summary" | "experience" | "skills" | "header" | "projects"
    targetId?: string
    bulletIndex?: number
    title: string
    before: string
    after: string
    rationale: string
    impact: string
  }>
  targetRoles?: string[]
}

/**
 * Extracts structured ResumeData from raw text (e.g. from an uploaded PDF or text file)
 * using Groq SDK and the gpt-oss-120b model.
 */
export async function extractResumeWithGroq(
  rawText: string,
  fileName?: string
): Promise<ResumeData> {
  const groq = getGroqClient()

  const systemPrompt = `You are a world-class ATS resume parser and data extraction specialist.
Your mission is to parse the candidate's raw resume text and extract all factual details into clean, typed, structured JSON.

Extract the information into STRICTLY valid JSON conforming to this schema:
{
  "header": {
    "fullName": string (candidate full name),
    "title": string (current or target job title, e.g. Senior Software Engineer),
    "email": string,
    "phone": string,
    "location": string (city, state, or country),
    "portfolio": string (personal website or portfolio url),
    "linkedin": string (LinkedIn url or handle),
    "github": string (GitHub url or handle),
    "summary": string (candidate professional summary or objective)
  },
  "skills": string[] (array of discrete technical and domain skills, e.g. ["React", "TypeScript", "Node.js", "PostgreSQL"]),
  "experience": [
    {
      "id": string (unique id like "exp-1"),
      "role": string (job title),
      "company": string (company name),
      "location": string,
      "dates": string (e.g. "Jan 2022 - Present"),
      "current": boolean,
      "bullets": string[] (array of bullet achievement points, preserve details and metrics)
    }
  ],
  "education": [
    {
      "id": string (unique id like "edu-1"),
      "degree": string (e.g. "B.S. in Computer Science"),
      "school": string (university or institution name),
      "location": string,
      "dates": string (e.g. "2018 - 2022"),
      "gpa": string (if provided)
    }
  ],
  "projects": [
    {
      "id": string (unique id like "proj-1"),
      "name": string (project title),
      "description": string,
      "techStack": string[] (technologies used),
      "link": string (if provided)
    }
  ],
  "certifications": string[] (array of certifications/licenses)
}

CRITICAL RULES:
1. Extract ALL real information present in the resume text. Do NOT fabricate or hallucinate details.
2. For experience: extract all distinct jobs/internships, preserving each bullet point separately in the bullets array.
3. If no summary is explicitly written in the resume, synthesize a concise 2-sentence professional summary reflecting their background.
4. Normalize URLs (LinkedIn, GitHub, Portfolio) and contact info.
5. Return ONLY valid JSON matching the schema, with no markdown fences or introductory chatter.`

  const completion = await groq.chat.completions.create({
    model: GROQ_RESUME_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Extract structured resume data from the following resume text:\n\n${rawText.slice(0, 16000)}`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.1
  })

  const rawContent = completion.choices[0]?.message?.content || "{}"
  let parsed: any
  try {
    parsed = JSON.parse(rawContent)
  } catch (err) {
    console.error("[Groq Extraction] Failed to parse JSON response:", rawContent, err)
    throw new Error("Invalid JSON received from Groq during resume extraction.")
  }

  const cleanName = fileName ? fileName.replace(/\.[^/.]+$/, "").trim() : ""
  const extractedName = parsed?.header?.fullName?.trim()
  const resolvedName = extractedName || cleanName || "Candidate Resume"

  const resume: ResumeData = {
    id: `resume-${Date.now()}`,
    versionNumber: 1,
    versionName: cleanName ? `${cleanName} (Extracted)` : `${resolvedName} - Resume`,
    updatedAt: new Date().toISOString(),
    header: {
      fullName: resolvedName,
      title: parsed?.header?.title || "Professional",
      email: parsed?.header?.email || "",
      phone: parsed?.header?.phone || "",
      location: parsed?.header?.location || "",
      portfolio: parsed?.header?.portfolio || "",
      linkedin: parsed?.header?.linkedin || "",
      github: parsed?.header?.github || "",
      summary: parsed?.header?.summary || ""
    },
    skills: Array.isArray(parsed?.skills) ? parsed.skills.map((s: any) => String(s).trim()).filter(Boolean) : [],
    experience: Array.isArray(parsed?.experience)
      ? parsed.experience.map((exp: any, i: number) => ({
          id: exp.id || `exp-${i + 1}`,
          role: exp.role || "Professional",
          company: exp.company || "Company",
          location: exp.location || "",
          dates: exp.dates || "",
          current: Boolean(exp.current || exp.dates?.toLowerCase?.()?.includes("present")),
          bullets: Array.isArray(exp.bullets) 
            ? exp.bullets.map((b: any) => String(b).trim()).filter(Boolean) 
            : typeof exp.description === "string" 
            ? exp.description.split(".").map((s: string) => s.trim()).filter(Boolean) 
            : []
        }))
      : [],
    education: Array.isArray(parsed?.education)
      ? parsed.education.map((edu: any, i: number) => ({
          id: edu.id || `edu-${i + 1}`,
          degree: edu.degree || "Degree",
          school: edu.school || "Institution",
          location: edu.location || "",
          dates: edu.dates || "",
          gpa: edu.gpa ? String(edu.gpa) : undefined
        }))
      : [],
    projects: Array.isArray(parsed?.projects)
      ? parsed.projects.map((proj: any, i: number) => ({
          id: proj.id || `proj-${i + 1}`,
          name: proj.name || "Project",
          description: proj.description || "",
          techStack: Array.isArray(proj.techStack) ? proj.techStack.map((t: any) => String(t).trim()).filter(Boolean) : [],
          link: proj.link || undefined
        }))
      : [],
    certifications: Array.isArray(parsed?.certifications) 
      ? parsed.certifications.map((c: any) => String(c).trim()).filter(Boolean) 
      : []
  }

  return resume
}

/**
 * Analyzes resume data using Groq SDK with the openai/gpt-oss-120b model.
 * Provides live, LLM-powered feedback on ATS parsability, impact metrics,
 * power verbs, keyword density, and actionable rewrite recommendations.
 */
export async function analyzeResumeWithGroq(
  resume: ResumeData,
  rawText?: string
): Promise<AnalysisFeedback> {
  const groq = getGroqClient()

  const systemPrompt = `You are an elite Senior Technical Recruiter and ATS (Applicant Tracking System) Optimization Specialist.
Your task is to analyze the candidate's resume with extreme precision and provide actionable, rigorous, and constructive feedback.

Evaluate the resume across these dimensions:
1. Overall ATS Compatibility (0-100): Formatting clarity, standard section titles, parsability, contact URLs (LinkedIn, GitHub, Portfolio).
2. Quantifiable Impact & Power Verbs (0-100): Use of active verbs (e.g., Spearheaded, Architected, Accelerated vs. worked with, helped), metric density (percentages, revenue, latency, users), and outcome-oriented achievements (XYZ formula: Accomplished [X] as measured by [Y] by doing [Z]).
3. Conciseness & Brevity (0-100): Elimination of fluff, appropriate bullet length (1-2 lines), readability.
4. Technical Skills & Keyword Match (0-100): High-demand technologies, framework recency, categorization.

CRITICAL INSTRUCTIONS:
- Generate 3 to 6 high-value, actionable 'improvements'. For each improvement:
  * 'before': The exact text or bullet from the candidate's resume experience, summary, or projects that needs enhancement.
  * 'after': A punchy, quantified, recruiter-grade rewrite with strong power verbs and metrics.
  * 'rationale': Why this rewrite performs significantly better in ATS and human recruiter review.
  * 'impact': Expected percentage increase in interview callbacks or ATS score boost (e.g., "+15 ATS points").
  * 'section': Specify one of "summary", "experience", "skills", "header", or "projects".
- Identify 2 to 4 'strongSections' with clear highlights from their real resume.
- Identify 2 to 4 'weakSections' with severity ('high', 'medium', 'low') and clear fix recommendations.
- Identify any 'missingOrErrors' (e.g. missing LinkedIn/GitHub, missing dates, missing GPA/education details, lack of metrics).
- Recommend 3 to 5 realistic 'targetRoles' based on the candidate's demonstrated skill level.

You MUST respond with STRICTLY valid JSON matching this schema:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "impactScore": number (0-100),
  "brevityScore": number (0-100),
  "skillsScore": number (0-100),
  "keySummary": string (2-3 sentences concise executive summary of the resume's strengths and primary blocker),
  "strongSections": [
    {
      "category": string,
      "score": number (0-100),
      "title": string,
      "description": string,
      "highlights": string[]
    }
  ],
  "weakSections": [
    {
      "category": string,
      "severity": "high" | "medium" | "low",
      "title": string,
      "issue": string,
      "impact": string,
      "suggestion": string
    }
  ],
  "missingOrErrors": [
    {
      "id": string,
      "type": "missing" | "error" | "warning",
      "title": string,
      "description": string,
      "fix": string
    }
  ],
  "improvements": [
    {
      "id": string,
      "section": "summary" | "experience" | "skills" | "header" | "projects",
      "title": string,
      "before": string,
      "after": string,
      "rationale": string,
      "impact": string
    }
  ],
  "targetRoles": string[]
}`

  const resumePayload = {
    header: resume.header,
    skills: resume.skills,
    experience: resume.experience.map(e => ({
      role: e.role,
      company: e.company,
      dates: e.dates,
      bullets: e.bullets
    })),
    education: resume.education.map(e => ({
      degree: e.degree,
      school: e.school,
      dates: e.dates,
      gpa: e.gpa
    })),
    projects: resume.projects.map(p => ({
      name: p.name,
      techStack: p.techStack,
      description: p.description
    })),
    certifications: resume.certifications,
    rawText: rawText ? rawText.slice(0, 8000) : undefined
  }

  const completion = await groq.chat.completions.create({
    model: GROQ_RESUME_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Here is the candidate resume to analyze:\n\n${JSON.stringify(resumePayload, null, 2)}`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2
  })

  const rawContent = completion.choices[0]?.message?.content || "{}"
  let parsed: GroqAnalysisRawOutput
  try {
    parsed = JSON.parse(rawContent)
  } catch (err) {
    console.error("[Groq Analyzer] Failed to parse JSON response:", rawContent, err)
    throw new Error("Invalid JSON received from Groq LLM inference.")
  }

  // Calculate matched job IDs from catalog
  const { top3 } = matchJobsForResume(resume, DUMMY_JOBS)
  const recommendedJobIds = top3.map(j => j.id)

  // Sanitize scores and fallbacks
  const clampScore = (n: any, fallback: number) => {
    const num = typeof n === "number" ? Math.round(n) : fallback
    return Math.max(0, Math.min(100, isNaN(num) ? fallback : num))
  }

  const overallScore = clampScore(parsed.overallScore, 70)
  const atsScore = clampScore(parsed.atsScore, 68)
  const impactScore = clampScore(parsed.impactScore, 65)
  const brevityScore = clampScore(parsed.brevityScore, 75)
  const skillsScore = clampScore(parsed.skillsScore, 72)

  const feedback: AnalysisFeedback = {
    overallScore,
    atsScore,
    impactScore,
    brevityScore,
    skillsScore,
    keySummary:
      parsed.keySummary ||
      "Resume analysis completed with AI-driven ATS evaluation and recruiter scoring.",
    strongSections: Array.isArray(parsed.strongSections) && parsed.strongSections.length > 0
      ? parsed.strongSections
      : [
          {
            category: "Core Technical Competencies",
            score: skillsScore,
            title: "Relevant Skill Alignment",
            description: "Solid presence of modern technical libraries and developer fundamentals.",
            highlights: resume.skills.slice(0, 4)
          }
        ],
    weakSections: Array.isArray(parsed.weakSections) ? parsed.weakSections : [],
    missingOrErrors: Array.isArray(parsed.missingOrErrors) ? parsed.missingOrErrors : [],
    improvements: Array.isArray(parsed.improvements)
      ? parsed.improvements.map((imp, idx) => ({
          id: imp.id || `groq-imp-${idx + 1}`,
          section: imp.section || "experience",
          targetId: imp.targetId,
          bulletIndex: imp.bulletIndex,
          title: imp.title || `Improvement #${idx + 1}`,
          before: imp.before || "",
          after: imp.after || "",
          rationale: imp.rationale || "Improves keyword strength and quantifiable impact.",
          impact: imp.impact || "+10 ATS score",
          applied: false
        }))
      : [],
    recommendedJobIds,
    targetRoles: Array.isArray(parsed.targetRoles) && parsed.targetRoles.length > 0
      ? parsed.targetRoles
      : ["Full Stack Developer", "Software Engineer", "Frontend Engineer"],
    analyzedAt: new Date().toISOString()
  }

  return feedback
}

/**
 * Uses Groq GPT-120B to rewrite and optimize the entire resume into a high-scoring ATS version.
 */
export async function optimizeResumeWithGroq(
  resume: ResumeData
): Promise<{ improvedResume: ResumeData; feedback: AnalysisFeedback }> {
  const groq = getGroqClient()

  const prompt = `You are an executive resume writer. Take the following resume and rewrite it to achieve a 95+ ATS score.
Enhance summary, add quantified achievements (metrics, %, latency, scale) to bullets, optimize skill keywords, and ensure full ATS parsability.
Output STRICTLY valid JSON with structure:
{
  "header": {
    "fullName": string,
    "title": string,
    "email": string,
    "phone": string,
    "location": string,
    "portfolio": string,
    "linkedin": string,
    "github": string,
    "summary": string
  },
  "skills": string[],
  "experience": [
    {
      "id": string,
      "role": string,
      "company": string,
      "location": string,
      "dates": string,
      "current": boolean,
      "bullets": string[]
    }
  ],
  "education": [
    {
      "id": string,
      "degree": string,
      "school": string,
      "location": string,
      "dates": string,
      "gpa": string
    }
  ],
  "projects": [
    {
      "id": string,
      "name": string,
      "description": string,
      "techStack": string[],
      "link": string
    }
  ],
  "certifications": string[]
}`

  const completion = await groq.chat.completions.create({
    model: GROQ_RESUME_MODEL,
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: JSON.stringify(resume) }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3
  })

  const content = completion.choices[0]?.message?.content || "{}"
  const parsed = JSON.parse(content)

  const newVersionNumber = (resume.versionNumber || 1) + 1
  const improvedResume: ResumeData = {
    ...resume,
    id: `resume-v${newVersionNumber}-${Date.now()}`,
    versionNumber: newVersionNumber,
    versionName: `v${newVersionNumber} - Groq AI Optimized`,
    updatedAt: new Date().toISOString(),
    header: {
      ...resume.header,
      ...(parsed.header || {})
    },
    skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : resume.skills,
    experience: Array.isArray(parsed.experience) && parsed.experience.length > 0 ? parsed.experience : resume.experience,
    education: Array.isArray(parsed.education) && parsed.education.length > 0 ? parsed.education : resume.education,
    projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : resume.projects,
    certifications: Array.isArray(parsed.certifications) ? parsed.certifications : resume.certifications
  }

  // Re-run analysis on the optimized resume
  const feedback = await analyzeResumeWithGroq(improvedResume)

  return { improvedResume, feedback }
}
