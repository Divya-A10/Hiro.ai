import { Github, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const footerLinks = [
    {
      title: 'Products',
      links: ['ATS Score Checker', 'Resume Analyzer', 'Resume Rewrite', 'Interview Prep']
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service']
    },
    {
      title: 'Resources',
      links: ['Blog', 'ATS Guide', 'Success Stories', 'Affiliate']
    }
  ];

  return (
    <footer className="bg-brand-primary text-white pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-6">
            <a href="/" className="text-2xl font-bold tracking-tight flex items-center gap-1">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rotate-45" />
              </div>
              Hiro.ai
            </a>
            <p className="text-zinc-400 max-w-xs text-sm leading-relaxed">
              Your AI recruiter before the real recruiter. We help high-impact candidates break through the noise using advanced LLM-sourced feedback.
            </p>
            <div className="flex items-center gap-4">
              <Twitter className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              <Github className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((column) => (
            <div key={column.title} className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="group text-sm text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
                      {link}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter / CTA */}
          <div className="col-span-2 lg:col-span-1 space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Stay Updated</h4>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-zinc-700"
              />
              <button className="w-full bg-white text-black text-sm font-bold py-2 rounded-lg hover:bg-zinc-200 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs text-zinc-500">© 2026 Hiro AI, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-zinc-500 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest">System Status: All Green</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
