import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is missing. AI features will not work.');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

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
    
    Analyze and return:
    - matchScore: A percentage score (0-100) representing how well the candidate fits the role.
    - recruiterVerdict: A short, professional feedback summary (max 3 sentences).
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
}
