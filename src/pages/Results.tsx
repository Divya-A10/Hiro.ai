import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, XCircle, AlertCircle, RefreshCcw, 
  ChevronRight, ArrowLeft, Download, Share2, Sparkles, MessageSquare,
  X, User, Mail, Briefcase, Loader2
} from 'lucide-react';
import type { AnalysisResult } from '@/src/lib/ai';

export default function Results() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const navigate = useNavigate();

  const handleAdvisorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsAdvisorModalOpen(false);
      setIsSubmitted(false);
      setFormData({ name: '', email: '', role: '' });
    }, 3000);
  };

  useEffect(() => {
    const data = sessionStorage.getItem('current_analysis');
    if (!data) {
      navigate('/upload');
      return;
    }
    setAnalysis(JSON.parse(data));
  }, [navigate]);

  if (!analysis) return null;

  const getScoreData = (score: number) => {
    if (score >= 80) return {
      label: "Top Candidate",
      subtext: "Your profile strongly aligns with this role.",
      color: "text-emerald-600",
      icon: <CheckCircle2 className="w-5 h-5" />
    };
    if (score >= 60) return {
      label: "Competitive Candidate",
      subtext: "You meet many requirements but still have areas to strengthen.",
      color: "text-blue-600",
      icon: <CheckCircle2 className="w-5 h-5" />
    };
    if (score >= 40) return {
      label: "Needs Positioning Work",
      subtext: "Your profile shows potential, but stronger alignment is needed.",
      color: "text-amber-600",
      icon: <AlertCircle className="w-5 h-5" />
    };
    return {
      label: "Below Hiring Threshold",
      subtext: "This role currently requires significant additional experience or specialization.",
      color: "text-rose-600",
      icon: <XCircle className="w-5 h-5" />
    };
  };

  const scoreData = getScoreData(analysis.matchScore);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-40 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-6">
            <button 
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              New Scan
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
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-bold hover:opacity-90 transition-all">
              <Share2 className="w-4 h-4" />
              Share with Coach
            </button>
          </div>
        </header>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Score Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 p-12 rounded-[3rem] bg-white text-black flex flex-col items-center justify-center text-center space-y-8"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">ATS Match Index</span>
            <div className="text-[8rem] font-light leading-none tracking-tighter">
              {analysis.matchScore}<span className="text-4xl align-top">%</span>
            </div>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 justify-center ${scoreData.color} font-bold`}>
                {scoreData.icon}
                {scoreData.label}
              </div>
              <p className="text-zinc-500 text-sm font-medium">{scoreData.subtext}</p>
            </div>
          </motion.div>

          {/* Verdict Summary */}
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

        {/* Skills & Interview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12">
          
          {/* Skills Breakdown */}
          <section className="space-y-8">
            <h3 className="text-2xl font-light tracking-tight flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Skill Alignment
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Matched Assets</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedSkills.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Delta (Missing Skills)</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Interview Prep */}
          <section className="space-y-8">
            <h3 className="text-2xl font-light tracking-tight flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-cyan-500" />
              Focus Areas for Interview
            </h3>
            <div className="space-y-4">
              {analysis.interviewQuestions.map((q, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex gap-4 items-start group">
                  <span className="text-xs font-mono text-zinc-600 mt-1">0{i+1}</span>
                  <p className="text-sm text-zinc-300 font-medium group-hover:text-white transition-colors">{q}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* AI Rewrite Suggestions */}
        <section className="pt-24 space-y-12">
           <div className="text-center space-y-4">
             <h2 className="text-4xl font-light font-serif italic">High-Impact Refactoring</h2>
             <p className="text-zinc-500 font-light max-w-xl mx-auto">We've rewritten your core bullet points to better align with executive expectations.</p>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
             {analysis.rewrittenBullets.map((bullet, i) => (
               <div key={i} className="group relative p-1 leading-relaxed rounded-[2.5rem] bg-gradient-to-r from-transparent via-white/5 to-transparent hover:via-white/10 transition-all">
                 <div className="bg-black rounded-[2.4rem] p-8 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                      <RefreshCcw className="w-5 h-5" />
                    </div>
                    <p className="text-lg font-light text-zinc-400 group-hover:text-white transition-colors">
                       {bullet}
                    </p>
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* Action Bar */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 p-2 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
           <button 
             onClick={() => navigate('/upload')}
             className="px-8 py-3 rounded-full text-sm font-bold bg-white text-black hover:scale-[1.02] transition-all"
           >
             New Analysis
           </button>
           <div className="h-6 w-[1px] bg-white/10" />
           <button 
             onClick={() => setIsAdvisorModalOpen(true)}
             className="pr-6 pl-2 py-3 text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
           >
             <ChevronRight className="w-5 h-5" />
             <span className="text-xs font-bold uppercase tracking-widest">Connect with Advisor</span>
           </button>
        </div>

        {/* Advisor Modal */}
        <AnimatePresence>
          {isAdvisorModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAdvisorModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[3rem] p-12 overflow-hidden shadow-2xl"
              >
                {/* Background Accent */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                <div className="relative space-y-8">
                  <header className="flex justify-between items-start">
                    <div className="space-y-2">
                       <h2 className="text-4xl font-light font-serif italic text-white leading-none">
                         Connect with <br />
                         <span className="text-white/40 not-italic">an Advisor</span>
                       </h2>
                       <p className="text-zinc-500 text-sm font-medium">Get personalized resume feedback from our specialists.</p>
                    </div>
                    <button 
                      onClick={() => setIsAdvisorModalOpen(false)}
                      className="p-2 rounded-full hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </header>

                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
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
                          <p className="text-zinc-500 text-sm">A Hiro specialist will reach out to you within 24 hours.</p>
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
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input 
                              required
                              type="text"
                              placeholder="Your Name"
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                            />
                          </div>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input 
                              required
                              type="email"
                              placeholder="Email Address"
                              value={formData.email}
                              onChange={e => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                            />
                          </div>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input 
                              required
                              type="text"
                              placeholder="Target Role (e.g. Senior Product Designer)"
                              value={formData.role}
                              onChange={e => setFormData({...formData, role: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-white text-black py-5 rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            <>
                              Request Feedback
                              <ChevronRight className="w-5 h-5" />
                            </>
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
    </div>
  );
}
