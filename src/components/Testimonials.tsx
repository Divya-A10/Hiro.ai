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
    <section className="py-24 bg-brand-soft/50 border-y border-brand-border/50">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Loved by candidates at world-class companies.</h2>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-brand-primary text-brand-primary" />
            ))}
            <span className="ml-2 text-sm font-semibold">4.9/5 from 2,000+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-white border border-brand-border shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-zinc-100" />
                <p className="text-zinc-600 italic leading-relaxed">"{item.quote}"</p>
              </div>
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-brand-border">
                <img src={item.avatar} alt={item.author} className="w-10 h-10 rounded-full grayscale grayscale-hover transition-all" />
                <div>
                  <h4 className="text-sm font-bold">{item.author}</h4>
                  <p className="text-xs text-zinc-400 font-medium">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
