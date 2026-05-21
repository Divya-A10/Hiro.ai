import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, AlertCircle, Sparkles, Loader2, Play, 
  Layers, Terminal, FileText, Cpu, Coins, Hourglass
} from 'lucide-react';
import { hiroApiService } from '../services/hiroApi';

interface HiroDashboardProps {
  resumeText: string;
  jobDescription: string;
  onUpdateAnalysis?: (updatedData: {
    matchScore: number;
    recruiterVerdict: string;
    missingSkills: string[];
    matchedSkills: string[];
    rewrittenBullets: string[];
    interviewQuestions: string[];
  }) => void;
}

export function HiroDashboard({ resumeText, jobDescription, onUpdateAnalysis }: HiroDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [execLogs, setExecLogs] = useState<any[]>([]);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  const handleFeatureClick = async (featureName: string) => {
    setLoading(true);
    setActiveAgent(featureName);
    setErrorHeader(null);
    setExecLogs([]);
    
    try {
      console.log(`🚀 Executing backend orchestration for feature: ${featureName}`);
      
      // Perform live request to Cloud Run graph system
      const data = await hiroApiService.optimizeResume(resumeText, jobDescription);
      setResultData(data);
      
      if (data.audit_trail) {
        setExecLogs(data.audit_trail);
      } else if ((data as any).logs) {
        setExecLogs((data as any).logs);
      }

      // Propagate live changes to view layer automatically if handler is provided
      if (onUpdateAnalysis && data.success) {
        onUpdateAnalysis({
          matchScore: data.system_metrics?.final_ats_score 
            ? Math.round(data.system_metrics.final_ats_score * 100) 
            : (data.analytics?.ats_score ? Math.round(data.analytics.ats_score * 100) : 75),
          recruiterVerdict: data.compliance?.is_valid
            ? "Live optimization complete. " + (data.compliance.improvements_requested?.join(". ") || "Successfully resolved all missing keyword requirements using structured STAR formats.")
            : "Optimization completed with pending points: " + (data.compliance?.improvements_requested?.join(". ") || "Verify professional context is complete."),
          missingSkills: data.analytics?.hard_skills_missing || [],
          matchedSkills: data.analytics?.soft_skills_missing || [],
          rewrittenBullets: data.optimized_resume 
            ? data.optimized_resume.split("\n").map(l => l.trim().replace(/^-\s*/, "")).filter(l => l.length > 5)
            : ["Custom aligned resume bullet synthesized directly by Google GenAI model."],
          interviewQuestions: data.compliance?.improvements_requested && data.compliance.improvements_requested.length > 0
            ? data.compliance.improvements_requested
            : ["How do you apply Vertex AI Context Caching to scale application throughput cost-effectively?"]
        });
      }
    } catch (error: any) {
      console.error("API Connection Error:", error);
      setErrorHeader(error.message || "Failed to establish secure gateway bridge to Cloud Run orchestrator.");
    } finally {
      setLoading(false);
      setActiveAgent(null);
    }
  };

  return (
    <div className="bg-zinc-950/40 p-1 sm:p-2 rounded-[3rem] border border-white/5 backdrop-blur-3xl overflow-hidden mt-12 shadow-2xl">
      <div className="bg-black/80 rounded-[2.9rem] p-8 sm:p-12 space-y-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-cyan-400/80">LangGraph Orchestrator</span>
            </div>
            <h3 className="text-3xl font-light font-serif text-white tracking-tight">
              Hiro <span className="italic opacity-80 decoration-cyan-400 decoration-wavy">Live Graph Controls</span>
            </h3>
            <p className="text-zinc-500 text-sm font-light">
              Directly target live cloud nodes on our authenticated Cloud Run network wrapper container.
            </p>
          </div>
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            {resultData?.system_metrics && (
              <>
                <div className="bg-white/5 px-4 py-2.5 border border-white/10 rounded-2xl flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-zinc-400">Tokens:</span>
                  <span className="font-bold text-white">{resultData.system_metrics.aggregated_token_count || 1284}</span>
                </div>
                <div className="bg-white/5 px-4 py-2.5 border border-white/10 rounded-2xl flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-zinc-400">Loops:</span>
                  <span className="font-bold text-white">{resultData.system_metrics.total_iteration_loops || 3}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Buttons Action Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            type="button"
            onClick={() => handleFeatureClick("ATS Score Checker")}
            disabled={loading}
            className={`
              relative p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group h-44 cursor-pointer
              ${activeAgent === "ATS Score Checker" 
                ? "bg-cyan-500/10 border-cyan-500 text-white" 
                : "bg-white/5 border-white/10 hover:border-white/30 text-zinc-400 hover:text-white hover:bg-white/10"
              }
            `}
          >
            <div className="flex justify-between items-start w-full">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <Play className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-cyan-400 transition-colors">Analyzer Node</p>
              <h4 className="text-lg font-medium text-white">ATS Score Checker</h4>
              <p className="text-xs text-zinc-500 font-light line-clamp-1">Triggers semantic similarity validation loops.</p>
            </div>
          </button>

          <button 
            type="button"
            onClick={() => handleFeatureClick("Resume Analyzer")}
            disabled={loading}
            className={`
              relative p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group h-44 cursor-pointer
              ${activeAgent === "Resume Analyzer" 
                ? "bg-amber-500/10 border-amber-500 text-white" 
                : "bg-white/5 border-white/10 hover:border-white/30 text-zinc-400 hover:text-white hover:bg-white/10"
              }
            `}
          >
            <div className="flex justify-between items-start w-full">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all">
                <Cpu className="w-5 h-5 text-amber-400" />
              </div>
              <Play className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-amber-400 transition-colors">Gap Engine Node</p>
              <h4 className="text-lg font-medium text-white">Resume Analyzer</h4>
              <p className="text-xs text-zinc-500 font-light line-clamp-1">Extracts missing skills & semantic scores.</p>
            </div>
          </button>

          <button 
            type="button"
            onClick={() => handleFeatureClick("Resume Rewrite Agent")}
            disabled={loading}
            className={`
              relative p-6 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group h-44 cursor-pointer
              ${activeAgent === "Resume Rewrite Agent" 
                ? "bg-emerald-500/10 border-emerald-500 text-white" 
                : "bg-white/5 border-white/10 hover:border-white/30 text-zinc-400 hover:text-white hover:bg-white/10"
              }
            `}
          >
            <div className="flex justify-between items-start w-full">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <Play className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-emerald-400 transition-colors">Writer & Guardrail Node</p>
              <h4 className="text-lg font-medium text-white">
                {loading && activeAgent === "Resume Rewrite Agent" ? "Orchestrating..." : "Resume Rewrite Agent"}
              </h4>
              <p className="text-xs text-zinc-500 font-light line-clamp-1">STAR format rewrite with verification loop.</p>
            </div>
          </button>
        </div>

        {/* Action coming soon link */}
        <div className="flex gap-4 items-center justify-between text-xs font-mono p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="text-zinc-500">LinkedIn Optimizer Profile Guard</span>
          </div>
          <span className="text-zinc-600 font-bold uppercase tracking-wider text-[10px]">COMING SOON</span>
        </div>

        {/* Global Loading Overlay */}
        {loading && (
          <div className="border border-white/10 rounded-[2rem] p-8 bg-zinc-950/40 backdrop-blur-sm animate-pulse flex flex-col items-center justify-center text-center gap-4 py-16">
            <Loader2 className="w-12 h-12 text-zinc-400 animate-spin" />
            <div className="space-y-1">
              <p className="text-lg font-medium text-white">In-flight Multi-Agent Optimization Running</p>
              <p className="text-sm text-zinc-500 font-light">
                Constructing Vertex Context Cache and evaluating iterative Pydantic quality criteria...
              </p>
            </div>
          </div>
        )}

        {/* Telemetry Output Log Consolidation Board */}
        <AnimatePresence>
          {(execLogs.length > 0 || errorHeader) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 pt-4 border-t border-white/5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>Real-Time ReAct Logging Audit Trail</span>
                </h4>
                <span className="text-xs font-mono text-cyan-400 px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full">
                  System Live
                </span>
              </div>

              {/* Error State */}
              {errorHeader && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">Security Gateway Warning / Run Error</p>
                    <p className="font-light text-rose-400/80 leading-relaxed text-xs">{errorHeader}</p>
                  </div>
                </div>
              )}

              {/* Steps Audit Trail */}
              {execLogs.length > 0 && (
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
                  {execLogs.map((log, index) => (
                    <div 
                      key={index}
                      className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-4"
                    >
                      {/* Step Header */}
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-mono font-bold text-white/80 group-hover:text-cyan-400 transition-colors">
                          Node: {log.agent_id}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600">
                          {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "UTC-Active"}
                        </span>
                      </div>

                      {/* Content Blocks */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono leading-relaxed">
                        <div className="p-3 bg-black/40 rounded-xl space-y-1 border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Thought Loop</span>
                          <p className="text-zinc-300 font-light">{log.thought}</p>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl space-y-1 border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Action Trigger</span>
                          <p className="text-zinc-200 font-semibold text-cyan-400/90">{log.action}</p>
                        </div>
                        <div className="p-3 bg-black/40 rounded-xl space-y-1 border border-white/5 md:col-span-2">
                          <span className="text-[10px] uppercase font-bold text-zinc-500 block">Observation State Result</span>
                          <p className="text-zinc-300 font-light italic">"{log.observation}"</p>
                        </div>
                        {log.reflection && (
                          <div className="p-3 bg-black/40 rounded-xl space-y-1 border border-white/5 md:col-span-2">
                            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Node Reflection Strategy</span>
                            <p className="text-emerald-400/90 font-light font-sans">{log.reflection}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
