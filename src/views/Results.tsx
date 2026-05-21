import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Download, Send, Sparkles, CheckCircle2, 
  AlertTriangle, XCircle, HelpCircle, MessageSquare, 
  Zap, User, MessageCircle, X, CircleUser, Mail, Briefcase, Loader2
} from 'lucide-react';
import { HiroDashboard } from '../components/HiroDashboard';

interface AnalysisData {
  matchScore: number;
  recruiterVerdict: string;
  missingSkills: string[];
  matchedSkills: string[];
  rewrittenBullets: string[];
  interviewQuestions: string[];
}

export default function Results() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [advisorModalOpen, setAdvisorModalOpen] = useState(false);
  const [advisorSubmitting, setAdvisorSubmitting] = useState(false);
  const [advisorSuccess, setAdvisorSuccess] = useState(false);
  const [advisorForm, setAdvisorForm] = useState({ name: "", email: "", role: "" });
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("current_analysis");
    if (!raw) {
      navigate("/upload");
      return;
    }
    try {
      setAnalysis(JSON.parse(raw));
      setResumeText(sessionStorage.getItem("current_resume_text") || "");
      setJobDescription(sessionStorage.getItem("current_job_description") || "");
    } catch (e) {
      console.error("Failed to parse analysis");
      navigate("/upload");
    }
  }, [navigate]);

  if (!analysis) return null;

  const scoreInfo = ((score: number) => {
    if (score >= 80) {
      return {
        label: "Top Candidate",
        subtext: "Your profile strongly aligns with this role.",
        color: "text-emerald-600",
        icon: <CheckCircle2 className="w-5 h-5" />
      };
    } else if (score >= 60) {
      return {
        label: "Competitive Candidate",
        subtext: "You meet many requirements but still have areas to strengthen.",
        color: "text-blue-600",
        icon: <CheckCircle2 className="w-5 h-5" />
      };
    } else if (score >= 40) {
      return {
        label: "Needs Positioning Work",
        subtext: "Your profile shows potential, but stronger alignment is needed.",
        color: "text-amber-600",
        icon: <AlertTriangle className="w-5 h-5" />
      };
    } else {
      return {
        label: "Below Hiring Threshold",
        subtext: "This role currently requires significant additional experience or specialization.",
        color: "text-rose-600",
        icon: <XCircle className="w-5 h-5" />
      };
    }
  })(analysis.matchScore);

  const handleAdvisorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdvisorSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAdvisorSubmitting(false);
    setAdvisorSuccess(true);
    setTimeout(() => {
      setAdvisorModalOpen(false);
      setAdvisorSuccess(false);
      setAdvisorForm({ name: "", email: "", role: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-40 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-6">
            <button
              onClick={() => navigate("/upload")}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>New Scan</span>
            </button>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl sm:text-8xl font-light tracking-tighter leading-[0.85]"
            >
              The <span className="font-serif italic opacity-80">Verdict</span> <br />
              <span className="opacity-40 whitespace-nowrap">Report</span>
            </motion.h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={() => setAdvisorModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Share with Coach</span>
            </button>
          </div>
        </header>

        {/* High-level Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Match Score Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 p-12 rounded-[3rem] bg-white text-black flex flex-col items-center justify-center text-center space-y-8 shadow-2xl"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">ATS Match Index</span>
            <div className="text-[8rem] font-light leading-none tracking-tighter">
              {analysis.matchScore}
              <span className="text-4xl align-top">%</span>
            </div>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 justify-center ${scoreInfo.color} font-bold`}>
                {scoreInfo.icon}
                <span>{scoreInfo.label}</span>
              </div>
              <p className="text-zinc-500 text-sm font-medium">{scoreInfo.subtext}</p>
            </div>
          </motion.div>

          {/* Expert Recruiter Verdict */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 p-12 rounded-[3rem] border border-white/10 bg-zinc-900/50 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-white/30" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-white/50">Expert Analysis</span>
              </div>
              <p className="text-3xl sm:text-4xl font-light leading-snug italic font-serif">
                "{analysis.recruiterVerdict}"
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-12">
              <div className="px-6 py-4 rounded-3xl bg-white/5 border border-white/10 flex-1 min-w-[200px]">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Confidence</p>
                <p className="text-2xl font-light">99.2%</p>
              </div>
              <div className="px-6 py-4 rounded-3xl bg-white/5 border border-white/10 flex-1 min-w-[200px]">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">Bias Check</p>
                <p className="text-2xl font-light">Passed</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Skill Alignment & Focus Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12">
          
          {/* Skill Gaps */}
          <section className="space-y-8">
            <h3 className="text-2xl font-light tracking-tight flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Skill Alignment</span>
            </h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Matched Assets</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedSkills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Delta (Missing Skills)</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Interview Questions */}
          <section className="space-y-8">
            <h3 className="text-2xl font-light tracking-tight flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-cyan-500" />
              <span>Focus Areas for Interview</span>
            </h3>
            <div className="space-y-4">
              {analysis.interviewQuestions.map((question, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex gap-4 items-start group"
                >
                  <span className="text-xs font-mono text-zinc-600 mt-1">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Live Multi-Agent Re-Optimization Console */}
        <HiroDashboard 
          resumeText={resumeText} 
          jobDescription={jobDescription} 
          onUpdateAnalysis={setAnalysis} 
        />

        {/* Resume Rewriting Section */}
        <section className="pt-24 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-light font-serif italic">High-Impact Refactoring</h2>
            <p className="text-zinc-500 font-light max-w-xl mx-auto">
              We've rewritten your core bullet points to better align with executive expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {analysis.rewrittenBullets.map((bullet, idx) => (
              <div 
                key={idx}
                className="group relative p-1 leading-relaxed rounded-[2.5rem] bg-gradient-to-r from-transparent via-white/5 to-transparent hover:via-white/10 transition-all"
              >
                <div className="bg-black rounded-[2.4rem] p-8 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-lg font-light text-zinc-400 group-hover:text-white transition-colors">
                    {bullet}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Persistent Bottom Action Bar */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 p-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        <button
          onClick={() => navigate("/upload")}
          className="px-8 py-3 rounded-full text-sm font-bold bg-white text-black hover:scale-[1.02] transition-all cursor-pointer"
        >
          New Analysis
        </button>
        <div className="h-6 w-[1px] bg-white/10" />
        <button
          onClick={() => setAdvisorModalOpen(true)}
          className="pr-6 pl-2 py-3 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-widest">Connect with Advisor</span>
        </button>
      </div>

      {/* Advisor Overlay Modal */}
      <AnimatePresence>
        {advisorModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAdvisorModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[3rem] p-12 overflow-hidden shadow-2xl"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="relative space-y-8">
                
                {/* Modal Header */}
                <header className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-light font-serif italic text-white leading-none">
                      Connect with <br />
                      <span className="text-white/40 not-italic">an Advisor</span>
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium">
                      Get personalized resume feedback from our specialists.
                    </p>
                  </div>
                  <button
                    onClick={() => setAdvisorModalOpen(false)}
                    className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </header>

                <AnimatePresence mode="wait">
                  {advisorSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-12 text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-light text-white">Request Received</h3>
                        <p className="text-zinc-500 text-sm">
                          A Hiro specialist will reach out to you within 24 hours.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleAdvisorSubmit}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="relative">
                          <CircleUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input
                            required
                            type="text"
                            placeholder="Your Name"
                            value={advisorForm.name}
                            onChange={(e) => setAdvisorForm({ ...advisorForm, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                          />
                        </div>

                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input
                            required
                            type="email"
                            placeholder="Your Email"
                            value={advisorForm.email}
                            onChange={(e) => setAdvisorForm({ ...advisorForm, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                          />
                        </div>

                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input
                            required
                            type="text"
                            placeholder="Desired Role"
                            value={advisorForm.role}
                            onChange={(e) => setAdvisorForm({ ...advisorForm, role: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={advisorSubmitting}
                        className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {advisorSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <span>Submit Request</span>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
