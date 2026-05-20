import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function CTA() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const handleRequestAccess = async () => {
    if (!user) {
      await signInWithGoogle();
    }
    navigate('/upload');
  };

  return (
    <section className="py-32 bg-white text-neutral-900 border-t border-brand-border/30">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-light tracking-tight text-[#141414] leading-[1.05]">
            Ready to <br />
            <span className="font-serif italic text-zinc-400 mr-2">Transform</span> Your <br />
            Trajectory?
          </h2>
          
          <p className="text-zinc-500 text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed pt-2">
            Join the exclusive circle of high-impact candidates who refuse to be filtered by obsolete systems.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-12"
        >
          <div className="flex justify-center">
            <button 
              onClick={handleRequestAccess}
              className="bg-[#141414] hover:bg-zinc-800 text-white font-medium px-8 py-5 rounded-full flex items-center justify-center gap-3 transition-all hover:gap-4 shadow-lg group text-base md:text-lg"
            >
              <span>Request Access</span>
              <ArrowRight className="w-5 h-5 text-white/80 group-hover:text-white" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 pt-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            <span>No credit card</span>
            <span>Set up in 60s</span>
            <span>Privacy first</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
