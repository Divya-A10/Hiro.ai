import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, ArrowRight, CheckCircle2, Sparkles, Target, Zap, TrendingUp, Users, Award, Rocket, Download } from 'lucide-react';
import pptxgen from 'pptxgenjs';
import { cn } from '../lib/utils';

interface SlideProps {
  headline: string;
  bullets: string[];
  visual?: React.ReactNode;
  subtitle?: string;
  accent?: string;
}

const Slide = ({ headline, bullets, visual, subtitle, accent }: SlideProps) => (
  <div className="h-full w-full flex flex-col md:flex-row items-center justify-center p-8 md:p-24 gap-12">
    <div className="flex-1 space-y-8 max-w-2xl">
      {accent && (
        <span className="inline-block px-3 py-1 bg-brand-soft border border-brand-border rounded-full text-xs font-medium tracking-widest uppercase">
          {accent}
        </span>
      )}
      <div className="space-y-4">
        <h2 className="text-5xl md:text-7xl font-serif font-medium leading-tight text-brand-primary">
          {headline}
        </h2>
        {subtitle && (
          <p className="text-xl text-zinc-500 font-sans italic">
            {subtitle}
          </p>
        )}
      </div>
      <ul className="space-y-6">
        {bullets.map((bullet, i) => (
          <motion.li 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-start gap-4 text-xl text-zinc-700 leading-relaxed"
          >
            <div className="mt-1.5 p-1 rounded-full bg-brand-primary text-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            {bullet}
          </motion.li>
        ))}
      </ul>
    </div>
    <div className="flex-1 w-full flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md aspect-square bg-brand-soft rounded-3xl border border-brand-border shadow-2xl flex items-center justify-center overflow-hidden relative"
      >
        {visual}
      </motion.div>
    </div>
  </div>
);

const slides = [
  {
    type: 'cover',
    headline: 'Hiro',
    subtitle: '"AI recruiter before your actual recruiter."',
    bullets: [
      'Empowering job seekers with AI agents.',
      'Optimizing every stage of the hiring funnel.',
      'Beating the ATS algorithms, one resume at a time.'
    ],
    accent: 'Pitch Deck 2026',
    visual: (
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-brand-primary p-12 text-center text-white">
        <Sparkles className="w-16 h-16 mb-6 text-white/50" />
        <h1 className="text-6xl font-serif mb-4">Hiro</h1>
        <p className="text-white/60 tracking-widest text-sm uppercase">The Future of Career Search</p>
      </div>
    )
  },
  {
    type: 'problem',
    headline: 'The ATS Black Hole',
    subtitle: '75% of resumes are rejected before a human sees them.',
    bullets: [
      'Resumes are optimized for humans, not algorithms.',
      'Qualified candidates are rejected without knowing why.',
      'The "Easy Apply" era has led to massive noise for recruiters.'
    ],
    accent: 'The Problem',
    visual: (
      <div className="p-12 space-y-6 w-full">
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
    type: 'solution',
    headline: 'Your AI Career Copilot',
    subtitle: 'Agents that work for you, not the corporation.',
    bullets: [
      'Analyze compatibility against any Job Description.',
      'Recruiter-style feedback in seconds.',
      'AI-driven custom resume rewriting.',
      'LinkedIn and interview optimization.'
    ],
    accent: 'The Solution',
    visual: (
      <div className="grid grid-cols-2 gap-4 p-8 w-full">
        {[Zap, Target, Award, Rocket].map((Icon, idx) => (
          <div key={idx} className="p-4 bg-white border border-brand-border rounded-2xl flex flex-col items-center justify-center text-center">
            <Icon className="w-8 h-8 mb-2 text-brand-primary" />
            <p className="text-[10px] font-bold uppercase tracking-tighter">Active Agent</p>
          </div>
        ))}
      </div>
    )
  },
  {
    type: 'product',
    headline: 'Specialized Agents',
    subtitle: 'A full-suite ecosystem of hiring intelligence.',
    bullets: [
      'ATS Score Checker: Keyword gap analysis.',
      'Resume Analyzer: Qualitative recruiter feedback.',
      'Resume Rewrite: Context-aware customization.',
      'Interview Prep: Personalized mock interviews.'
    ],
    accent: 'Product Workflow',
    visual: (
      <div className="p-6 w-full space-y-4">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-brand-border shadow-sm">
          <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center font-bold">88%</div>
          <div className="flex-1 space-y-1">
            <div className="h-2 w-full bg-zinc-100 rounded">
              <div className="h-full w-[88%] bg-green-500 rounded" />
            </div>
            <p className="text-[10px] text-zinc-500 font-medium">Matching Score: Strong Candidate</p>
          </div>
        </div>
        <div className="p-4 bg-brand-primary text-white rounded-xl">
          <p className="text-[10px] opacity-70 mb-2 font-mono">HIRO REWRITE ENGINE // ACTIVE</p>
          <p className="text-xs italic">"Rephrased project description to emphasize Scalability & Cloud Infrastructure..."</p>
        </div>
      </div>
    )
  },
  {
    type: 'business',
    headline: 'SaaS for Search',
    subtitle: 'Scalable freemium model for global job seekers.',
    bullets: [
      'Free: Basic ATS scores and keyword matching.',
      'Premium ($4.99/mo): Unlimited rewrites & interview prep.',
      'Zero-friction entry point for students & professionals.'
    ],
    accent: 'Business Model',
    visual: (
      <div className="p-12 text-center">
        <p className="text-xs font-bold text-zinc-400 uppercase mb-2">Premium Plan</p>
        <p className="text-6xl font-serif mb-4">$4.99</p>
        <p className="text-sm text-zinc-600 mb-8">per month / billed monthly</p>
        <div className="py-3 px-6 bg-brand-primary text-white rounded-full text-sm font-medium">Subscribe Now</div>
      </div>
    )
  },
  {
    type: 'market',
    headline: 'Market Timing',
    subtitle: 'Hiring is becoming increasingly automated.',
    bullets: [
      'AI hiring filters are growing faster than candidate awareness.',
      'Global recruitment market expected to reach $40B+ by 2030.',
      'A new generation of job seekers demands better tools.'
    ],
    accent: 'Market Opportunity',
    visual: (
      <div className="p-12 flex flex-col items-center justify-center">
        <TrendingUp className="w-16 h-16 text-brand-primary mb-6" />
        <p className="text-4xl font-serif italic font-bold">40% CAGR</p>
        <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">AI Career Tech Growth</p>
      </div>
    )
  },
  {
    type: 'team',
    headline: 'Built by Builders',
    subtitle: 'Full-stack experience with AI/ML depth.',
    bullets: [
      'Solo founder with multiple AI product launches.',
      'Open-source contributor & tech community lead.',
      'Experience with major clouds (AWS/GCP/IBM/Oracle).'
    ],
    accent: 'Founder',
    visual: (
      <div className="p-12 flex flex-col items-center text-center">
        <div className="w-32 h-32 rounded-full bg-brand-primary flex items-center justify-center text-white mb-6">
          <Users className="w-12 h-12" />
        </div>
        <p className="font-serif text-2xl">Engineering Focus</p>
        <p className="text-sm text-zinc-500 mt-2">Pragmatic AI implementation</p>
      </div>
    )
  },
  {
    type: 'closing',
    headline: 'Join the Hiro Journey',
    subtitle: 'Building the smartest career copilot for the AI age.',
    bullets: [
      'Seeking Pre-Seed funding for scaling & R&D.',
      'Expanding agent capabilities for HR-side matching.',
      'Let\'s build the future of hiring together.'
    ],
    accent: 'Vision',
    visual: (
      <div className="p-12 w-full h-full flex flex-col items-center justify-center bg-brand-soft border-4 border-white">
        <div className="p-6 bg-white rounded-full shadow-lg mb-8">
          <Rocket className="w-12 h-12 text-brand-primary" />
        </div>
        <p className="font-serif text-3xl">Take Off 2026</p>
      </div>
    )
  }
];

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const exportToPptx = async () => {
    setIsExporting(true);
    try {
      const pres = new pptxgen();
      pres.layout = 'LAYOUT_16x9';
      pres.defineLayout({ name: 'HIRO_LAYOUT', width: 13.33, height: 7.5 });
      pres.layout = 'HIRO_LAYOUT';

      const COLORS = {
        primary: '#18181b', // brand-primary (zinc-900 equivalent or custom)
        accent: '#2563eb', // brand-blue
        soft: '#f4f4f5',
        text: '#3f3f46'
      };

      slides.forEach((slideData) => {
        const slide = pres.addSlide();
        slide.background = { fill: '#ffffff' };

        // Accent tag
        if (slideData.accent) {
          slide.addText(slideData.accent.toUpperCase(), {
            x: 0.5,
            y: 0.5,
            w: 3,
            h: 0.4,
            fontSize: 10,
            bold: true,
            color: COLORS.accent,
            fontFace: 'Arial'
          });
        }

        // Headline
        slide.addText(slideData.headline, {
          x: 0.5,
          y: 1.2,
          w: 6,
          h: 1,
          fontSize: 44,
          bold: true,
          color: COLORS.primary,
          fontFace: 'Georgia' // Serif look
        });

        // Subtitle
        if (slideData.subtitle) {
          slide.addText(slideData.subtitle, {
            x: 0.5,
            y: 2.2,
            w: 6,
            h: 0.5,
            fontSize: 18,
            italic: true,
            color: COLORS.text,
            fontFace: 'Arial'
          });
        }

        // Bullets
        slideData.bullets.forEach((bullet, idx) => {
          slide.addText(bullet, {
            x: 0.7,
            y: 3.2 + (idx * 0.6),
            w: 5.5,
            h: 0.5,
            fontSize: 16,
            color: COLORS.text,
            bullet: { type: 'bullet' },
            fontFace: 'Arial'
          });
        });

        // Visual Placeholder (Box)
        slide.addShape(pres.ShapeType.rect, {
          x: 7.5,
          y: 1.5,
          w: 5,
          h: 4.5,
          fill: { color: COLORS.soft },
          line: { color: '#e4e4e7', width: 1 }
        });

        slide.addText('[ Visual Content Reference ]', {
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
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden">
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 flex bg-zinc-100 z-50">
        <motion.div 
          className="h-full bg-brand-primary"
          initial={false}
          animate={{ width: `${((current + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 z-50">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full hover:bg-zinc-100 transition-colors border border-zinc-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-mono font-medium text-zinc-400">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-brand-primary text-white hover:opacity-90 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Slide Container */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Slide {...slides[current]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-8 right-8 flex items-center gap-4 z-50">
        <button 
          onClick={exportToPptx}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-brand-soft border border-brand-border rounded-full text-xs font-bold uppercase tracking-widest text-zinc-600 hover:bg-brand-border transition-colors disabled:opacity-50"
        >
          {isExporting ? 'Exporting...' : (
            <>
              <Download className="w-3 h-3" />
              Download PPTX
            </>
          )}
        </button>
        <button 
          onClick={() => window.history.back()}
          className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-brand-primary transition-colors"
        >
          Exit Deck
        </button>
      </div>
    </div>
  );
}
