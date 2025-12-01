import { generateObject } from "ai"
import { z } from "zod"

const sentimentAnalysisSchema = z.object({
  category: z
    .enum([
      "Administration",
      "Instruction",
      "Physical Facilities & Equipment",
      "Student Services",
      "Campus Safety",
      "Other",
    ])
    .describe("The category that best fits the sentiment"),
  sentimentType: z.enum(["Positive", "Negative", "Neutral"]).describe("The overall sentiment tone"),
  isAppropriate: z.boolean().describe("Whether the content is appropriate and constructive"),
  rewrittenContent: z
    .string()
    .describe("If inappropriate, a rewritten constructive version. If appropriate, return the original content."),
  reason: z.string().optional().describe("Brief explanation if content was rewritten"),
})

export async function POST(req: Request) {
  const { content } = await req.json()

  if (!content || typeof content !== "string") {
    return Response.json({ error: "Content is required" }, { status: 400 })
  }

  const { object } = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: sentimentAnalysisSchema,
    prompt: `Analyze the following sentiment submission from a university student/staff member and provide:

1. Category: Classify into one of these categories based on the content:
   - "Administration" - Related to administrative processes, policies, enrollment, records, management
   - "Instruction" - Related to teaching, classes, professors, curriculum, learning experience
   - "Physical Facilities & Equipment" - Related to buildings, classrooms, equipment, infrastructure, maintenance
   - "Student Services" - Related to student support, counseling, activities, organizations
   - "Campus Safety" - Related to security, safety measures, emergency procedures
   - "Other" - If it doesn't fit any category above

2. Sentiment Type: Determine if the overall tone is Positive, Negative, or Neutral

3. Content Appropriateness: Check if the content is:
   - Free from hate speech, profanity, or personal attacks
   - Constructive rather than purely destructive
   - Respectful even if critical

4. Rewritten Content: 
   - If the content contains inappropriate language, profanity, or is overly harsh/unconstructive, rewrite it to be constructive and professional while preserving the core message/concern
   - If the content is already appropriate, return it as-is

Sentiment to analyze:
"${content}"`,
    maxOutputTokens: 500,
    temperature: 0.3,
  })

  return Response.json(object)
}
