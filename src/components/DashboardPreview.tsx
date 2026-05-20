import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, XCircle, FileText, Search, Zap } from 'lucide-react';

export default function DashboardPreview() {
  const missingSkills = ['TensorFlow', 'System Design', 'Kubernetes'];
  const matchedSkills = ['Python', 'React', 'AWS', 'Docker', 'GraphQL'];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-4 mb-12 text-left">
        <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-4 tracking-tight">
          The Interface of Insight
        </h2>
        <p className="text-zinc-400 text-sm md:text-base font-light max-w-xl leading-relaxed">
          A dashboard designed for clarity, not complexity. See exactly what the algorithm sees.
        </p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto p-2 sm:p-4 rounded-3xl bg-zinc-800/10 border border-white/5 backdrop-blur-xl">
      <div className="rounded-[1.25rem] bg-white border border-brand-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] overflow-hidden min-h-[600px] flex flex-col sm:flex-row">
        
        {/* Sidebar */}
        <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-brand-border p-4 sm:p-6 space-y-8 bg-zinc-50/50">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-zinc-200 rounded" />
            <nav className="space-y-2">
              {[FileText, Search, Zap].map((Icon, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white border border-brand-border/50 shadow-sm">
                  <Icon className="w-4 h-4 text-zinc-400" />
                  <div className="h-2 w-20 bg-zinc-100 rounded" />
                </div>
              ))}
            </nav>
          </div>

          <div className="space-y-3 pt-8 border-t border-brand-border">
            <div className="h-2 w-16 bg-zinc-200 rounded" />
            <div className="h-8 w-full bg-brand-primary rounded-lg flex items-center justify-center">
              <div className="h-1.5 w-12 bg-white/20 rounded" />
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 bg-white p-4 sm:p-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-brand-primary">John_Doe_Resume.pdf</h3>
              <p className="text-sm text-zinc-500">Senior Software Engineer — applied to <span className="text-brand-primary font-medium">Hiro.ai</span></p>
            </div>
            <div className="px-4 py-2 bg-zinc-100 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">Scan Complete</span>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ATS Score Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-brand-border bg-brand-soft flex flex-col items-center justify-center text-center space-y-4"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">ATS Match Score</span>
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-zinc-200"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={377}
                    initial={{ strokeDashoffset: 377 }}
                    animate={{ strokeDashoffset: 377 * (1 - 0.74) }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="text-brand-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold tracking-tighter text-brand-primary">74%</span>
                </div>
              </div>
              <p className="text-sm text-zinc-600 px-4">Your resume matches <span className="font-bold">24 out of 32</span> core requirements.</p>
            </motion.div>

            {/* Verdict Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl border border-brand-border space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Recruiter Verdict</span>
              </div>
              <p className="text-lg font-medium leading-snug text-brand-primary">
                "Solid technical background, but your <span className="italic underline decoration-amber-300">impact metrics</span> are buried. Move your AWS accomplishments to the top."
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-zinc-900 text-white text-xs font-bold py-3 rounded-lg hover:bg-zinc-800 transition-colors">
                  AI REWRITE SUGGESTION
                </button>
              </div>
            </motion.div>

            {/* Skills Breakdown */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Matched Skills</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Missing Skills</span>
                  <XCircle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-medium border border-rose-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating UI Elements for extra "premium" feel */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-12 -right-8 p-4 rounded-2xl bg-white border border-brand-border shadow-xl hidden md:block"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase">Impact Score</p>
            <p className="text-sm font-bold text-brand-primary">+12% Optimized</p>
          </div>
        </div>
      </motion.div>
    </div>
    </section>
  );
}
