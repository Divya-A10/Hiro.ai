import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Loader2, ArrowRight, Sparkles, Briefcase } from 'lucide-react';
import { analyzeResume } from '../lib/ai';
import { supabase } from '../lib/supabase';

export default function JobDescription() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAnalyze = async () => {
    if (description.trim()) {
      setLoading(true);
      setError(null);
      try {
        const resumeText = sessionStorage.getItem("current_resume_text");
        const resumeId = sessionStorage.getItem("current_resume_id");
        
        console.log("Starting analysis for resume:", resumeId);
        if (!resumeText || !resumeId) {
          throw new Error("Resume context missing. Please upload your resume again.");
        }

        console.log("Storing job description...");
        let jdId = `local-jd-${Date.now()}`;
        try {
          const { data: jobDesc, error: jdErr } = await supabase
            .from("job_descriptions")
            .insert({
              description_text: description,
              user_id: user?.id || null,
            })
            .select()
            .single();

          if (!jdErr && jobDesc) {
            jdId = jobDesc.id;
          }
        } catch (supabaseError) {
          console.warn("Supabase job description storage skipped, proceeding locally:", supabaseError);
        }

        console.log("Calling AI Engine (this may take 5-10 seconds)...");
        const analysis = await analyzeResume(resumeText, description);
        console.log("Analysis received successfully.");

        console.log("Saving analysis to database...");
        try {
          await supabase
            .from("analyses")
            .insert({
              resume_id: resumeId,
              job_description_id: jdId,
              match_score: analysis.matchScore,
              recruiter_verdict: analysis.recruiterVerdict,
              matched_skills: analysis.matchedSkills,
              missing_skills: analysis.missingSkills,
              rewritten_bullets: analysis.rewrittenBullets,
              interview_questions: analysis.interviewQuestions,
              user_id: user?.id || null,
            });
        } catch (supabaseError) {
          console.warn("Supabase analysis log skipped, using sessionStorage:", supabaseError);
        }

        sessionStorage.setItem("current_analysis", JSON.stringify(analysis));
        console.log("Navigating to results.");
        navigate("/results");
      } catch (err: any) {
        console.error("Analysis flow error:", err);
        let errMsg = err.message || "Analysis failed. Please check your connection.";
        if (errMsg === "Failed to fetch" || err.status === 0) {
          errMsg = "Connection to API failed. If you are on Vercel, please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set. In AI Studio, ensure you are not behind a strict firewall.";
        }
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-light tracking-tighter text-white font-serif italic"
          >
            Target <span className="text-white/40 not-italic">the Role</span>
          </motion.h1>
          <p className="text-zinc-500 text-lg">Paste the job description or a link to align your profile.</p>
        </div>

        <div className="space-y-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/5 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="relative w-full h-[400px] bg-zinc-900 border border-white/10 rounded-[2rem] p-8 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 transition-all resize-none font-light leading-relaxed scrollbar-hide"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-3 bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </button>
              <button className="p-3 bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-colors">
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>

          {error && <p className="text-rose-500 text-center text-sm font-medium">{error}</p>}

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleAnalyze}
              disabled={!description.trim() || loading}
              className={`
                px-12 py-5 rounded-full text-xl font-medium transition-all flex items-center gap-4
                ${!description.trim() || loading ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:scale-[1.02]"}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Running Verdict Engine...</span>
                </>
              ) : (
                <>
                  <span>Begin Analysis</span>
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span>LLM Analysis In-Flight</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
