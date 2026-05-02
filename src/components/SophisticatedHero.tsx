import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

export default function SophisticatedHero() {
  return (
    <section className="bg-black text-white min-h-[90vh] flex flex-col justify-center px-4 relative overflow-hidden">
      {/* Background Atmosphere - Inspired by Recipe 7 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-zinc-800 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-zinc-700 rounded-full blur-[100px] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          
          <div className="lg:col-span-8 space-y-12">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-8xl lg:text-[11rem] font-light tracking-tighter leading-[0.82]"
            >
              The New <br />
              <span className="font-serif italic opacity-80">Standard</span> <br />
              <span className="opacity-40">of Hiring</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="max-w-md text-zinc-400 text-lg sm:text-xl font-light leading-relaxed"
            >
              Hiro redefined the application process using proprietary models that mirror executive-level hiring instincts.
            </motion.p>
          </div>

          <div className="lg:col-span-4 lg:pb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="aspect-square rounded-full border border-white/10 p-1 flex items-center justify-center relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 ease-out" />
              <div className="text-center space-y-2 relative z-10">
                <p className="text-xs uppercase tracking-widest text-white/40">Secure Access</p>
                <p className="text-4xl font-light">Join Tribe</p>
                <ArrowUpRight className="w-8 h-8 mx-auto mt-4 text-white/60 group-hover:text-white transition-colors" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Horizontal Line - Recipe 4 pattern */}
        <div className="h-[1px] w-full bg-white/10 mt-24 mb-12" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Latency', value: '42ms' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Security', value: 'SOC2' },
            { label: 'Accuracy', value: '99.2%' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + (i * 0.1) }}
              className="space-y-1"
            >
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</p>
              <p className="text-2xl font-light font-mono">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
