import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Hiro correctly identified why my AWS experience wasn't showing up for ATS filters. Secured 3 FAANG interviews in two weeks.",
    author: "Sarah Jenkins",
    role: "Senior Backend Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
  },
  {
    quote: "The recruiter verdict feature is scary accurate. It felt like I had a coach looking over my shoulder during the whole application.",
    author: "Marcus Chen",
    role: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
  },
  {
    quote: "As a new grad, I didn't know how to word my internships. Hiro's rewrite agent gave me the language I needed without sounding like a bot.",
    author: "Elena Rodriguez",
    role: "Software Engineering Intern",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-brand-soft border-y border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold tracking-tight text-brand-primary">
            Loved by candidates at world-class companies.
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-brand-primary text-brand-primary" />
            ))}
            <span className="ml-2 text-sm font-semibold text-zinc-700 font-sans tracking-tight">4.9/5 from 2,000+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="p-10 rounded-2xl bg-white border border-brand-border shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between h-full hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="text-5xl font-serif text-zinc-200/70 select-none leading-none -mb-2">“</div>
                <p className="text-zinc-600 font-sans text-base leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-brand-border">
                <img 
                  src={item.avatar} 
                  alt={item.author} 
                  className="w-10 h-10 rounded-full object-cover transition-transform duration-300 hover:scale-105" 
                />
                <div>
                  <h4 className="text-sm font-bold text-brand-primary leading-tight">{item.author}</h4>
                  <p className="text-xs text-zinc-500 font-medium tracking-wide mt-0.5">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
