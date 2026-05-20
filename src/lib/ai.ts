import { GoogleGenAI, Type } from "@google/genai";

const geminiKey = (typeof process !== 'undefined' && process.env.GEMINI_API_KEY)
  ? process.env.GEMINI_API_KEY
  : (typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.VITE_GEMINI_API_KEY || '')
    : '');

const ai = new GoogleGenAI({ 
  apiKey: geminiKey
});

const isGeminiKeyMissing = !geminiKey || geminiKey.includes('your-');
if (isGeminiKeyMissing) {
  console.error('Gemini API Key is missing. AI features will not work.\n' +
    'On Vercel, please add VITE_GEMINI_API_KEY to your Environment Variables.');
}

export interface AnalysisResult {
  matchScore: number;
  recruiterVerdict: string;
  missingSkills: string[];
  matchedSkills: string[];
  rewrittenBullets: string[];
  interviewQuestions: string[];
}

export async function analyzeResume(resumeText: string, jobDescription: string): Promise<AnalysisResult> {
  const prompt = `
    Compare the following resume with this job description.
    
    Job Description:
    ${jobDescription}
    
    Resume:
    ${resumeText}
    
    Analyze and return a JSON object with:
    - matchScore: A percentage score (0-100) representing how well the candidate fits the role.
    - recruiterVerdict: A short, professional feedback summary (max 3 sentences).
      CRITICAL ALIGNMENT RULE: The tone, feedback, and summary within recruiterVerdict MUST strictly align with the generated matchScore:
      * If matchScore is low (< 60), the verdict MUST be realistic and critical about key gaps, and you are strictly FORBIDDEN from using high-praise or elite-tier terms like "Optimized Tier", "Top 5% candidate", "exceptional fit", "perfect alignment", or "outstanding".
      * If matchScore is high (>= 80), the verdict can be encouraging, acknowledging strong qualifications.
      * Keep it thoroughly professional, constructive, and realistic.
    - missingSkills: List of technical or soft skills mentioned in the job description but not clearly found in the resume.
    - matchedSkills: List of skills found in both.
    - rewrittenBullets: 3-5 improved, high-impact bullet points for the resume based on the job requirements.
    - interviewQuestions: 3 likely interview questions based on the gaps identified.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            recruiterVerdict: { type: Type.STRING },
            missingSkills: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            matchedSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            rewrittenBullets: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            interviewQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["matchScore", "recruiterVerdict", "missingSkills", "matchedSkills", "rewrittenBullets", "interviewQuestions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI engine");
    
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
}
