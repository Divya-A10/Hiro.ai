export interface OptimizeResponse {
  success: boolean;
  optimized_resume: string;
  logs?: any[];
  audit_trail?: any[];
  metrics?: {
    total_iterations: number;
    aggregated_token_count?: number;
  };
  system_metrics?: {
    final_ats_score: number;
    total_iteration_loops: number;
    aggregated_token_count?: number;
  };
  analytics?: {
    ats_score: number;
    hard_skills_missing: string[];
    soft_skills_missing: string[];
    semantic_distance: number;
  };
  compliance?: {
    is_valid: boolean;
    hallucination_flag: boolean;
    star_method_coverage: number;
    improvements_requested: string[];
  };
}

// Support resolving API Url via Vite and meta-context
const API_BASE_URL = typeof import.meta !== 'undefined' && import.meta.env
  ? (import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || '')
  : '';

function getCleanApiUrl(endpoint: string): string {
  let base = API_BASE_URL;
  if (typeof window !== 'undefined') {
    // If we are in the cloud preview or real domain, and localhost is specified, strip base to use relative proxy routing
    if (base.includes('localhost') && !window.location.hostname.includes('localhost')) {
      base = '';
    }
  }
  // If base is empty, default to absolute or relative prefix
  return `${base || ''}${endpoint}`;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  try {
    // Pull the live cryptographic JWT from Clerk's window session object if available
    const clerk = (window as any).Clerk;
    if (clerk?.session) {
      const token = await clerk.session.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch (e) {
    console.warn("[SECURITY HANDLER] Clerk authentication token resolution deferred:", e);
  }
  
  return headers;
}

export const hiroApiService = {
  async optimizeResume(resumeText: string, jobDescription: string): Promise<OptimizeResponse> {
    const headers = await getAuthHeaders();
    
    // Resolve endpoint fallback gracefully
    const url = getCleanApiUrl("/api/v1/optimize");
    console.log(`[HIRO CORE] Inbound transaction dispatch destination: ${url}`);
    
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        raw_text_resume: resumeText,
        raw_job_description: jobDescription,
        preferences: {
          target_role: "Software Engineer",
          target_location: "Remote",
          strict_ats_matching: true
        }
      })
    });
    
    if (!response.ok) {
      const errTxt = await response.text();
      if (response.status === 404) {
        throw new Error(
          `Optimization endpoint not found at ${url}. Check that the backend is running and that the API base URL points to a service exposing /api/v1/optimize.`
          + (errTxt ? ` Server response: ${errTxt}` : '')
        );
      }
      throw new Error(`Backend optimization failure: ${errTxt || response.statusText}`);
    }
    
    return await response.json();
  }
};
