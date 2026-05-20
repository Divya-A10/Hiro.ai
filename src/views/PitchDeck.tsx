import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import pptxgen from 'pptxgenjs';
import { 
  ArrowLeft, Download, Sparkles, Check, ChevronLeft, ChevronRight, 
  Brain, FileText, Target, TrendingUp, AlertCircle, Play, 
  BarChart, Laptop, Award, Cpu, Rocket
} from 'lucide-react';

interface SlideProps {
  headline: string;
  bullets: string[];
  visual: React.ReactNode;
  subtitle?: string;
  accent?: string;
}

const SlideComponent: React.FC<SlideProps> = ({ headline, bullets, visual, subtitle, accent }) => {
  return (
    <div className="h-full w-full flex flex-col md:flex-row items-center justify-center p-8 md:p-24 gap-12 bg-white text-black">
      <div className="flex-1 space-y-8 max-w-2xl">
        {accent && (
          <span className="inline-block px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-full text-xs font-medium tracking-widest uppercase text-zinc-600">
            {accent}
          </span>
        )}
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-serif font-medium leading-tight text-zinc-950">
            {headline}
          </h2>
          {subtitle && (
            <p className="text-xl text-zinc-500 font-sans italic">
              {subtitle}
            </p>
          )}
        </div>
        <ul className="space-y-6">
          {bullets.map((bullet, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="flex items-start gap-4 text-xl text-zinc-700 leading-relaxed font-light"
            >
              <div className="mt-1.5 p-1 rounded-full bg-zinc-950 text-white">
                <Check className="w-4 h-4" />
              </div>
              <span>{bullet}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="flex-1 w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md aspect-square bg-[#F8F8F7] rounded-3xl border border-[#E5E5E3] shadow-2xl flex items-center justify-center overflow-hidden relative"
        >
          {visual}
        </motion.div>
      </div>
    </div>
  );
};

export default function PitchDeck() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [exporting, setExporting] = useState(false);

  const nextSlide = () => setCurrentSlideIndex((prev) => (prev + 1) % slidesData.length);
  const prevSlide = () => setCurrentSlideIndex((prev) => (prev - 1 + slidesData.length) % slidesData.length);

  const slidesData = [
    {
      type: "cover",
      headline: "Hiro",
      subtitle: '"AI recruiter before your actual recruiter."',
      bullets: [
        "Empowering job seekers with AI agents.",
        "Optimizing every stage of the hiring funnel.",
        "Beating the ATS algorithms, one resume at a time."
      ],
      accent: "Pitch Deck 2026",
      visual: (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-12 text-center text-white">
          <Sparkles className="w-16 h-16 mb-6 text-zinc-400" />
          <h1 className="text-6xl font-serif mb-4">Hiro</h1>
          <p className="text-zinc-500 tracking-widest text-sm uppercase">The Future of Career Search</p>
        </div>
      )
    },
    {
      type: "problem",
      headline: "The ATS Black Hole",
      subtitle: "75% of resumes are rejected before a human sees them.",
      bullets: [
        "Resumes are optimized for humans, not algorithms.",
        "Qualified candidates are rejected without knowing why.",
        'The "Easy Apply" era has led to massive noise for recruiters.'
      ],
      accent: "The Problem",
      visual: (
        <div className="p-12 space-y-6 w-full text-left">
          <div className="h-4 w-3/4 bg-zinc-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-zinc-200 rounded animate-pulse" />
          <div className="mt-12 p-6 border-2 border-dashed border-red-200 bg-red-50 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold italic text-xl">X</div>
            <div>
              <p className="font-bold text-red-900">REJECTED</p>
              <p className="text-xs text-red-700">Reason: Keyword Mismatch (Rank: #84)</p>
            </div>
          </div>
        </div>
      )
    },
    {
      type: "solution",
      headline: "Your AI Career Copilot",
      subtitle: "Agents that work for you, not the corporation.",
      bullets: [
        "Analyze compatibility against any Job Description.",
        "Recruiter-style feedback in seconds.",
        "AI-driven custom resume rewriting.",
        "LinkedIn and interview optimization."
      ],
      accent: "The Solution",
      visual: (
        <div className="grid grid-cols-2 gap-4 p-8 w-full">
          {[Brain, Sparkles, FileText, Target].map((Icon, idx) => (
            <div key={idx} className="p-4 bg-white border border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-center">
              <Icon className="w-8 h-8 mb-2 text-zinc-850" />
              <p className="text-[10px] font-bold uppercase tracking-tighter text-zinc-950">Active Agent</p>
            </div>
          ))}
        </div>
      )
    },
    {
      type: "product",
      headline: "Specialized Agents",
      subtitle: "A full-suite ecosystem of hiring intelligence.",
      bullets: [
        "ATS Score Checker: Keyword gap analysis.",
        "Resume Analyzer: Qualitative recruiter feedback.",
        "Resume Rewrite: Context-aware customization.",
        "Interview Prep: Personalized mock interviews."
      ],
      accent: "Product Workflow",
      visual: (
        <div className="p-6 w-full space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-zinc-200 shadow-sm text-left">
            <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center font-bold">88%</div>
            <div className="flex-1 space-y-1">
              <div className="h-2 w-full bg-zinc-100 rounded">
                <div className="h-full w-[88%] bg-green-500 rounded" />
              </div>
              <p className="text-[10px] text-zinc-500 font-medium font-sans">Matching Score: Strong Candidate</p>
            </div>
          </div>
          <div className="p-4 bg-zinc-950 text-white rounded-xl text-left">
            <p className="text-[10px] opacity-70 mb-2 font-mono uppercase">Hiro Rewrite Engine // Active</p>
            <p className="text-xs italic text-zinc-300 font-serif">"Rephrased project description to emphasize Scalability & Cloud Infrastructure..."</p>
          </div>
        </div>
      )
    },
    {
      type: "business",
      headline: "SaaS for Search",
      subtitle: "Scalable freemium model for global job seekers.",
      bullets: [
        "Free: Basic ATS scores and keyword matching.",
        "Premium ($4.99/mo): Unlimited rewrites & interview prep.",
        "Zero-friction entry point for students & professionals."
      ],
      accent: "Business Model",
      visual: (
        <div className="p-12 text-center text-black">
          <p className="text-xs font-bold text-zinc-400 uppercase mb-2 font-sans">Premium Plan</p>
          <p className="text-6xl font-serif mb-4 font-light">$4.99</p>
          <p className="text-sm text-zinc-600 mb-8 font-sans">per month / billed monthly</p>
          <div className="py-3 px-6 bg-zinc-950 text-white rounded-full text-sm font-medium font-sans">Subscribe Now</div>
        </div>
      )
    },
    {
      type: "market",
      headline: "Market Timing",
      subtitle: "Hiring is becoming increasingly automated.",
      bullets: [
        "AI hiring filters are growing faster than candidate awareness.",
        "Global recruitment market expected to reach $40B+ by 2030.",
        "A new generation of job seekers demands better tools."
      ],
      accent: "Market Opportunity",
      visual: (
        <div className="p-12 flex flex-col items-center justify-center text-black">
          <TrendingUp className="w-16 h-16 text-zinc-950 mb-6" />
          <p className="text-4xl font-serif italic font-bold">40% CAGR</p>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide font-sans">AI Career Tech Growth</p>
        </div>
      )
    },
    {
      type: "competition",
      headline: "Competitive Landscape",
      subtitle: "Hiro is well positioned to win in this market.",
      bullets: [
        "AI-Native depth vs Legacy static tools.",
        "Highly specialized copilot vs generic job boards.",
        "End-to-end optimization at every funnel stage.",
        "Focus on candidate empowerment, not just company matching."
      ],
      accent: "Competition",
      visual: (
        <div className="w-full h-full relative flex items-center justify-center p-8 bg-zinc-50 text-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-zinc-200" />
            <div className="h-full w-[1px] bg-zinc-200" />
          </div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border border-zinc-200 text-[10px] font-bold uppercase tracking-widest shadow-sm font-sans">AI-Native Intelligence</div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border border-zinc-200 text-[10px] font-bold uppercase tracking-widest shadow-sm font-sans">Static / Legacy Tools</div>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 bg-white px-4 py-1.5 rounded-full border border-zinc-200 text-[10px] font-bold uppercase tracking-widest shadow-sm font-sans">Generic Platforms</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 bg-white px-4 py-1.5 rounded-full border border-zinc-200 text-[10px] font-bold uppercase tracking-widest shadow-sm font-sans">Specialized Copilots</div>
          
          <div className="absolute left-[15%] bottom-[15%] flex flex-col items-center gap-1 opacity-40">
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold font-mono">LNKD</div>
            <span className="text-[8px] font-medium text-zinc-400">Networking</span>
          </div>
          <div className="absolute right-[20%] bottom-[20%] flex flex-col items-center gap-1 opacity-40">
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold font-mono">CNVA</div>
            <span className="text-[8px] font-medium text-zinc-400">Templates</span>
          </div>
          <div className="absolute right-[15%] top-[40%] flex flex-col items-center gap-1 opacity-60">
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-[8px] font-bold font-mono">TEAL</div>
            <span className="text-[8px] font-medium text-zinc-400">Tracking</span>
          </div>
          <div className="absolute right-[10%] top-[10%] flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-zinc-950 border-4 border-white shadow-xl flex items-center justify-center text-white ring-4 ring-zinc-950/5">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-bold text-zinc-950 uppercase tracking-tighter">HIRO.AI</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <div className="flex gap-2">
              <div className="bg-black text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider font-sans">HIRO.AI</div>
              <div className="bg-white border border-zinc-200 px-3 py-1 rounded-full text-[8px] font-medium uppercase tracking-wider text-zinc-500 shadow-sm font-sans">CONFIDENTIAL</div>
            </div>
          </div>
        </div>
      )
    },
    {
      type: "team",
      headline: "Built by Builders",
      subtitle: "Full-stack experience with AI/ML depth.",
      bullets: [
        "Solo founder with multiple AI product launches.",
        "Open-source contributor & tech community lead.",
        "Experience with major clouds (AWS/GCP/IBM/Oracle)."
      ],
      accent: "Founder",
      visual: (
        <div className="p-12 flex flex-col items-center text-center text-black">
          <div className="w-32 h-32 rounded-full bg-zinc-950 flex items-center justify-center text-white mb-6">
            <Cpu className="w-12 h-12" />
          </div>
          <p className="font-serif text-2xl">Engineering Focus</p>
          <p className="text-sm text-zinc-500 mt-2 font-sans">Pragmatic AI implementation</p>
        </div>
      )
    },
    {
      type: "closing",
      headline: "Join the Hiro Journey",
      subtitle: "Building the smartest career copilot for the AI age.",
      bullets: [
        "Seeking Pre-Seed funding for scaling & R&D.",
        "Expanding agent capabilities for HR-side matching.",
        "Let's build the future of hiring together."
      ],
      accent: "Vision",
      visual: (
        <div className="p-12 w-full h-full flex flex-col items-center justify-center bg-[#F8F8F7] border-4 border-white text-black">
          <div className="p-6 bg-white rounded-full shadow-lg mb-8">
            <Rocket className="w-12 h-12 text-zinc-950" />
          </div>
          <p className="font-serif text-3xl">Take Off 2026</p>
        </div>
      )
    }
  ];

  const handleExport = async () => {
    setExporting(true);
    try {
      const pres = new pptxgen();
      
      // Setup Custom Layout
      pres.defineLayout({ name: 'HIRO_LAYOUT', width: 13.33, height: 7.5 });
      pres.layout = 'HIRO_LAYOUT';

      const colors = {
        primary: '#18181b',
        accent: '#2563eb',
        soft: '#f4f4f5',
        text: '#3f3f46'
      };

      slidesData.forEach((slide) => {
        const ppslide = pres.addSlide();
        
        // Background color
        ppslide.background = { fill: '#ffffff' };

        // Accent / Kicker
        if (slide.accent) {
          ppslide.addText(slide.accent.toUpperCase(), {
            x: 0.5,
            y: 0.5,
            w: 3,
            h: 0.4,
            fontSize: 10,
            bold: true,
            color: colors.accent,
            fontFace: 'Arial'
          });
        }

        // Headline
        ppslide.addText(slide.headline, {
          x: 0.5,
          y: 1.2,
          w: 6,
          h: 1,
          fontSize: 44,
          bold: true,
          color: colors.primary,
          fontFace: 'Georgia'
        });

        // Subtitle
        if (slide.subtitle) {
          ppslide.addText(slide.subtitle, {
            x: 0.5,
            y: 2.2,
            w: 6,
            h: 0.5,
            fontSize: 18,
            italic: true,
            color: colors.text,
            fontFace: 'Arial'
          });
        }

        // Bullet Points
        slide.bullets.forEach((bullet, bIdx) => {
          ppslide.addText(bullet, {
            x: 0.7,
            y: 3.2 + bIdx * 0.6,
            w: 5.5,
            h: 0.5,
            fontSize: 16,
            color: colors.text,
            bullet: { type: 'bullet' },
            fontFace: 'Arial'
          });
        });

        // Visual Placeholder in PPTX
        ppslide.addShape(pres.ShapeType.rect, {
          x: 7.5,
          y: 1.5,
          w: 5,
          h: 4.5,
          fill: { color: colors.soft },
          line: { color: '#e4e4e7', width: 1 }
        });

        ppslide.addText("[ Visual Content Reference ]", {
          x: 7.5,
          y: 3.5,
          w: 5,
          h: 0.5,
          fontSize: 14,
          align: 'center',
          color: '#a1a1aa'
        });
      });

      await pres.writeFile({ fileName: 'Hiro_Pitch_Deck_2026.pptx' });
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden">
      
      {/* Slide Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 flex bg-zinc-100 z-50">
        <motion.div
          className="h-full bg-zinc-950"
          initial={false}
          animate={{ width: `${((currentSlideIndex + 1) / slidesData.length) * 100}%` }}
        />
      </div>

      {/* Persistent Bottom Slides Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 z-50">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full hover:bg-zinc-100 transition-colors border border-zinc-200 cursor-pointer text-zinc-950"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-mono font-medium text-zinc-400">
          {String(currentSlideIndex + 1).padStart(2, "0")} / {String(slidesData.length).padStart(2, "0")}
        </span>
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-zinc-950 text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Main Slide Screen Container */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <SlideComponent {...slidesData[currentSlideIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top Header Actions */}
      <div className="absolute top-8 right-8 flex items-center gap-4 z-50">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 border border-zinc-200 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {exporting ? "Exporting..." : (
            <>
              <Download className="w-3 h-3" />
              <span>Download PPTX</span>
            </>
          )}
        </button>
        <button
          onClick={() => window.history.back()}
          className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
        >
          Exit Deck
        </button>
      </div>

    </div>
  );
}
