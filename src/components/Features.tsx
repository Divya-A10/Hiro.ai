import { motion } from 'motion/react';
import { Target, Search, FileEdit, Users, Zap, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'ATS Verdict Engine',
    description: 'We don’t just give you a score. We tell you exactly which keywords are weighted most and why you’re failing the initial filter.'
  },
  {
    icon: Search,
    title: 'Recruiter-Sourced Logic',
    description: 'Our AI is trained on actual hiring manager feedback loops, not just generic LLM prompts.'
  },
  {
    icon: FileEdit,
    title: 'Safe AI Rewrites',
    description: 'Avoid "AI-flavored" text. Hiro suggests high-impact bullet points that sound human and data-driven.'
  },
  {
    icon: Users,
    title: 'Contextual Alignment',
    description: 'Whether you’re a New Grad or a Senior Architect, Hiro adjusts its feedback based on your seniority level.'
  }
];

export default function Features() {
  return (
    <section className="py-24 sm:py-32 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Intro / Problem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">The Problem</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Generic ATS checkers <br />
              <span className="text-zinc-400">are wasting your time.</span>
            </h2>
            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl">
              Most tools just look for keyword density. Modern recruiters use AI to find impact, context, and structural relevance. Hiro is the only tool that bridges the gap between raw data and recruiter expectations.
            </p>
            <div className="flex items-center gap-2 pt-4">
              <Zap className="w-5 h-5 text-brand-primary" />
              <span className="text-sm font-semibold">Join 50,000+ candidates beating the odds.</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              {/* Block 1: The Rejection (Problem) */}
              <div className="h-48 rounded-2xl bg-white border border-rose-100 p-6 flex flex-col justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500">System Rejection</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-serif italic text-zinc-300 line-through">Impact Score: N/A</p>
                  <p className="text-sm font-medium text-zinc-400">"Insufficient keyword density for 'Agile' in 3+ sectors."</p>
                </div>
              </div>

              {/* Block 2: The Hiro Edge (Action) */}
              <div className="h-64 rounded-2xl bg-brand-primary p-6 flex flex-col justify-between text-white border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Zap className="w-12 h-12" />
                </div>
                <div className="space-y-1 relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Hiro Rewrite Agent</span>
                  <p className="text-2xl font-light leading-tight">Optimized <br />for Revenue <br />Context</p>
                </div>
                <div className="h-12 w-full bg-white/10 rounded-lg flex items-center px-4 gap-3 relative z-10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="h-1 w-24 bg-white/20 rounded" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Block 3: Context Analysis */}
              <div className="h-64 rounded-2xl bg-zinc-50 border border-brand-border p-6 flex flex-col">
                <div className="flex items-start justify-between mb-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Context Map</span>
                    <p className="text-lg font-bold">Hidden Gems</p>
                  </div>
                  <Search className="w-4 h-4 text-zinc-300" />
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Leadership Delta', val: '+42%' },
                    { label: 'Market Velocity', val: 'High' },
                    { label: 'Risk Mitigation', val: 'Top 1%' }
                  ].map(stat => (
                    <div key={stat.label} className="flex justify-between items-center border-b border-zinc-200 pb-2">
                      <span className="text-xs text-zinc-500">{stat.label}</span>
                      <span className="text-xs font-mono font-bold text-brand-primary">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Block 4: Target Alignment */}
              <div className="h-48 rounded-2xl bg-brand-soft border border-brand-border p-6 flex items-center justify-center text-center">
                <div className="space-y-4">
                  <div className="flex -space-x-2 justify-center">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200" />
                    ))}
                  </div>
                  <p className="text-xs font-medium text-zinc-500">"92% of users with this profile <br />secured an interview within 14 days."</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works / Why Hiro */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for modern hiring pipelines.</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto italic">Everything you need to go from "Applied" to "Interview Scheduled".</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-brand-border hover:border-zinc-400 transition-colors bg-brand-soft/30 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-brand-border flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trust Section */}
        <div className="py-16 px-8 rounded-[2rem] bg-brand-primary text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-bold">Why Hiro beats generic tools</h3>
            <p className="text-white/60 max-w-sm">We use proprietary models trained on 10M+ successful hiring cycles.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium">Privacy Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium">Zero-AI Bias Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium">SOC2 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
