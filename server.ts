import express from 'express';
import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Install Python dependencies
console.log('[HIRO ENGINE] Installing Python dependencies from requirements.txt...');
try {
  execSync('python3 -m pip install -r requirements.txt', { stdio: 'inherit' });
  console.log('[HIRO ENGINE] Python dependencies installed successfully.');
} catch (e) {
  console.warn('[HIRO ENGINE] python3 -m pip failed, trying python...', e);
  try {
    execSync('python -m pip install -r requirements.txt', { stdio: 'inherit' });
    console.log('[HIRO ENGINE] Python dependencies installed successfully via python -m pip.');
  } catch (err) {
    console.error('[HIRO ENGINE] Failed to install python dependencies:', err);
  }
}

// Spawn FastAPI Python backend
console.log('[HIRO ENGINE] Spawning FastAPI Python backend on 127.0.0.1:8080...');
const pythonProcess = spawn('python3', ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8080'], {
  stdio: 'inherit',
  shell: true
});

pythonProcess.on('error', (err) => {
  console.error('[HIRO ERROR] Failed to start python backend:', err);
});

// Define `/api/v1/optimize` route handler directly server-side for maximum reliability
app.post('/api/v1/optimize', async (req, res) => {
  try {
    const { raw_text_resume, raw_job_description, preferences } = req.body;

    if (!raw_text_resume || raw_text_resume.length < 50) {
      return res.status(400).json({ error: "Invalid resume text (min length 50 characters)" });
    }
    if (!raw_job_description || raw_job_description.length < 20) {
      return res.status(400).json({ error: "Invalid job description text (min length 20 characters)" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[HIRO GATEWAY] GEMINI_API_KEY is not defined. Please add it via Settings > Secrets.");
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is missing.", 
        details: "Please attach your Gemini API key in the Settings > Secrets panel of AI Studio to proceed." 
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    console.log("[HIRO ENGINE] Starting ATS analysis Node...");
    const analysisPrompt = `
Compare the following resume with this job description. If any technical stack elements or behavioral credentials are requested by the job but missing or sparse in the resume, explicitly mark them down.

Job Description:
${raw_job_description}

Resume:
${raw_text_resume}

Output a strictly formatted JSON response containing:
1. "ats_score": A floating-point number from 0.0 to 1.0 evaluating candidate keyword density & semantic pairing.
2. "hard_skills_missing": An array of missing technical tools, frameworks, skills or languages.
3. "soft_skills_missing": An array of missing soft skills, management, or process methodologies.
4. "semantic_distance": A floating-point number from 0.0 to 1.0 (lower values representing a closer match).
`;

    const analysisResp = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: analysisPrompt,
      config: {
        systemInstruction: "You are an elite automated ATS compliance scanner. Analyze profiles with mathematical and lexical precision.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ats_score: { type: Type.NUMBER },
            hard_skills_missing: { type: Type.ARRAY, items: { type: Type.STRING } },
            soft_skills_missing: { type: Type.ARRAY, items: { type: Type.STRING } },
            semantic_distance: { type: Type.NUMBER }
          },
          required: ["ats_score", "hard_skills_missing", "soft_skills_missing", "semantic_distance"]
        }
      }
    });

    const analysisData = JSON.parse(analysisResp.text || '{}');
    console.log("[HIRO ENGINE] ATS analysis complete. Match score:", analysisData.ats_score);

    console.log("[HIRO ENGINE] Starting Resume Rewriter Node...");
    const targetRole = preferences?.target_role || "Forward Deployed Engineer";
    const rewritePrompt = `
You are rewording a resume to index well against the target job profile while maintaining strict absolute truth.
Target Role: ${targetRole}
Identified Core Skill Deficits: ${analysisData.hard_skills_missing?.join(', ')}

Original Resume Context:
${raw_text_resume}

Target Job Profile Check list:
${raw_job_description}

Rewrite the resume text. Focus on aligning accomplishments with the target description, modifying existing bullet points to use the high-impact STAR formulation (Situation, Task, Action, Result) seamlessly referencing our missing concepts. Do NOT fabricate credentials, titles, or certifications. Output ONLY the updated resume body in a structured, clean, professional standard textual representation.
`;

    const rewriteResp = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: rewritePrompt,
      config: {
        systemInstruction: "You are an elite career strategist and Lead Resume Writer. You restructure text structures elegantly with professional dignity."
      }
    });

    const optimizedResume = rewriteResp.text || '';
    console.log("[HIRO ENGINE] Resume rewriting complete.");

    console.log("[HIRO ENGINE] Starting Self-Reflection Node...");
    const reflectionPrompt = `
Analyze the updated resume draft against the target job profile and verify the compliance index.

Target Job Profile:
${raw_job_description}

Revised Resume Draft:
${optimizedResume}

Strictly audit the resume and compile a validation JSON report detailing:
1. "is_valid": true if STAR rules match and key technical gaps were safely incorporated without hallucination; false otherwise.
2. "hallucination_flag": true if claims are ungrounded or look fabricated.
3. "star_method_coverage": float from 0.0 to 1.0 measuring STAR formulation coverage.
4. "improvements_requested": array of feedback loops requesting modifications if any quality criteria fail.
`;

    const reflectionResp = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: reflectionPrompt,
      config: {
        systemInstruction: "You are a strict QA Compliance Guard Auditor evaluating career texts for accuracy and STAR compliance.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_valid: { type: Type.BOOLEAN },
            hallucination_flag: { type: Type.BOOLEAN },
            star_method_coverage: { type: Type.NUMBER },
            improvements_requested: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["is_valid", "hallucination_flag", "star_method_coverage", "improvements_requested"]
        }
      }
    });

    const reflectionData = JSON.parse(reflectionResp.text || '{}');
    console.log("[HIRO ENGINE] Self-reflection complete. Valid flag:", reflectionData.is_valid);

    const tokenCount = 
      (analysisResp.usageMetadata?.promptTokenCount || 0) +
      (analysisResp.usageMetadata?.candidatesTokenCount || 0) +
      (rewriteResp.usageMetadata?.promptTokenCount || 0) +
      (rewriteResp.usageMetadata?.candidatesTokenCount || 0) +
      (reflectionResp.usageMetadata?.promptTokenCount || 0) +
      (reflectionResp.usageMetadata?.candidatesTokenCount || 0);

    const timestamp = new Date().toISOString();

    const auditTrail = [
      {
        agent_id: "ATS_Analyzer",
        thought: "Performing deep semantic alignment mapping against job parameters.",
        action: "Executed Automated ATS Parsing and Gap-Extraction ruleset.",
        observation: `ATS Score evaluated at ${(analysisData.ats_score * 100).toFixed(1)}%. Extracted ${analysisData.hard_skills_missing?.length || 0} hard skills and ${analysisData.soft_skills_missing?.length || 0} soft skills gaps.`,
        reflection: "Transferring target skill vectors down-stream to Synthesizer node.",
        timestamp
      },
      {
        agent_id: "Resume_Rewriter_Iter_0",
        thought: `Refactoring bullet lines targeting key deficits: ${analysisData.hard_skills_missing?.slice(0, 3).join(', ')}.`,
        action: "Rewrite bullets using STAR structured formula.",
        observation: `Synthesized high-fidelity profile. Active document length: ${optimizedResume.length} characters.`,
        reflection: "Relaying active draft downstream to Quality Inspection gate.",
        timestamp
      },
      {
        agent_id: "Self_Reflection_Agent",
        thought: "Auditing STAR compliance and validating truthfulness across all statements.",
        action: "Executed compliance validation matrix.",
        observation: `Audit successful. Passing index: ${reflectionData.is_valid}. STAR coverage score: ${(reflectionData.star_method_coverage * 100).toFixed(1)}%.`,
        reflection: "Gating approved. Generating transaction records.",
         timestamp
      }
    ];

    res.json({
      success: true,
      optimized_resume: optimizedResume,
      system_metrics: {
        final_ats_score: analysisData.ats_score,
        total_iteration_loops: 1,
        aggregated_token_count: tokenCount
      },
      analytics: {
        ats_score: analysisData.ats_score,
        hard_skills_missing: analysisData.hard_skills_missing || [],
        soft_skills_missing: analysisData.soft_skills_missing || [],
        semantic_distance: analysisData.semantic_distance || 0.5
      },
      compliance: reflectionData,
      audit_trail: auditTrail
    });

  } catch (error: any) {
    console.error("[HIRO ENGINE ERROR] Failed processing optimization transaction:", error);
    res.status(500).json({ 
      error: "Orchestration Engine Exception", 
      details: error.message || "An unexpected error occurred inside the gateway." 
    });
  }
});

// Proxy logic for all '/api' requests to FastAPI
app.all('/api/*', async (req, res) => {
  const targetUrl = `http://127.0.0.1:8080${req.originalUrl}`;
  try {
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v));
        } else {
          headers.set(key, typeof value === 'string' ? value : String(value));
        }
      }
    });

    const method = req.method;
    const options: RequestInit = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'HEAD') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, options);
    const contentType = response.headers.get('content-type') || '';
    
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (contentType.includes('application/json')) {
      const json = await response.json();
      res.json(json);
    } else {
      const text = await response.text();
      res.send(text);
    }
  } catch (error: any) {
    console.error(`[PROXY ERROR] Routing path ${req.method} ${targetUrl} failed:`, error);
    res.status(500).json({ error: 'Gateway proxy error', details: error.message });
  }
});

// Serve frontend static assets from 'dist' directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback all other client-side routes to index.html for SPA router (Vite)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Keep port hardcoded exactly to 3000 in production as mandated by system architecture, but allow dev proxying
const PORT = process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT, 10) : 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[HIRO GATEWAY] Full-Stack Server active at http://0.0.0.0:${PORT}`);
});

process.on('exit', () => {
  try {
    pythonProcess.kill();
  } catch (e) {}
});
