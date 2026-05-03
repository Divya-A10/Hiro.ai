import Navbar from '@/src/components/Navbar';
import DashboardPreview from '@/src/components/DashboardPreview';
import Features from '@/src/components/Features';
import Testimonials from '@/src/components/Testimonials';
import Footer from '@/src/components/Footer';
import SophisticatedHero from '@/src/components/SophisticatedHero';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <SophisticatedHero />
        
        <div className="bg-black py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center lg:text-left space-y-4">
              <h2 className="text-white text-4xl sm:text-5xl font-light tracking-tight font-serif italic">The Interface of Insight</h2>
              <p className="text-white/40 text-lg max-w-xl">A dashboard designed for clarity, not complexity. See exactly what the algorithm sees.</p>
            </div>
            <DashboardPreview />
          </div>
        </div>

        <Features />
        <Testimonials />

        {/* Final CTA Section */}
        <section className="py-24 sm:py-40 px-4 bg-white border-t border-brand-border">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-5xl sm:text-8xl font-light tracking-tighter leading-[0.9]">
                Ready to <br />
                <span className="font-serif italic text-zinc-400">Transform</span> Your <br />
                Trajectory?
              </h2>
              <p className="text-xl text-zinc-500 max-w-xl mx-auto font-light leading-relaxed">
                Join the exclusive circle of high-impact candidates who refuse to be filtered by obsolete systems.
              </p>
              <div className="pt-8 flex flex-col items-center gap-6">
                <button 
                  onClick={() => navigate('/upload')}
                  className="bg-brand-primary text-white px-12 py-5 rounded-full text-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-4"
                >
                  Request Access
                  <ArrowRight className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <span>No Credit Card</span>
                  <span>Set Up in 60s</span>
                  <span>Privacy First</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
