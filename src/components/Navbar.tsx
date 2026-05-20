import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Menu, X, ArrowRight, User as UserIcon, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  {
    name: 'Products',
    dropdown: [
      { title: 'ATS Score Checker', desc: 'Scan your resume against job descriptions.' },
      { title: 'Resume Analyzer', desc: 'Detailed recruiter-style feedback.' },
      { title: 'Resume Rewrite Agent', desc: 'AI-driven high-impact rewrites.' },
      { title: 'LinkedIn Optimizer', desc: 'Maximize your social presence.' },
      { title: 'Interview Prep Agent', desc: 'Personalized mock interviews.' },
      { title: 'Application Verdict Engine', desc: 'Find out why you got rejected.' },
    ],
  },
  {
    name: 'Solutions',
    dropdown: [
      { title: 'Students & New Grads', desc: 'Break into the industry.' },
      { title: 'Software Engineers', desc: 'Optimize for tech giants.' },
      { title: 'Product Roles', desc: 'Stand out in PM pipelines.' },
      { title: 'Career Coaches', desc: 'Scale your coaching business.' },
      { title: 'Universities', desc: 'Empower your student body.' },
    ],
  },
  {
    name: 'Resources',
    dropdown: [
      { title: 'Blog', desc: 'Latest career insights.' },
      { title: 'Resume Templates', desc: 'Validated high-yield formats.' },
      { title: 'ATS Guide', desc: 'Beat the algorithms.' },
      { title: 'Interview Guide', desc: 'Master the soft skills.' },
      { title: 'Success Stories', desc: 'Real results from Hiro users.' },
    ],
  },
  {
    name: 'Pricing',
    dropdown: [
      { title: 'Free', desc: 'Start with 3 free scans.' },
      { title: 'Pro', desc: 'Unlimited optimizations.' },
      { title: 'Enterprise', desc: 'Custom solutions for teams.' },
    ],
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signInWithGoogle, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleGetStarted = async () => {
    if (!user) {
      await signInWithGoogle();
    }
    navigate('/upload');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold tracking-tight text-brand-primary flex items-center gap-1">
              <div className="w-6 h-6 bg-brand-primary rounded-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rotate-45" />
              </div>
              Hiro<span className="text-zinc-400">.ai</span>
            </a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative group px-3 py-2 cursor-pointer"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-brand-primary transition-colors">
                  {item.name}
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", activeDropdown === item.name && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 w-80 mt-1 bg-white border border-brand-border rounded-xl shadow-2xl p-4 overflow-hidden"
                    >
                      <div className="grid gap-4">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.title}
                            href="#"
                            className="group/item block p-3 rounded-lg hover:bg-brand-soft transition-colors"
                          >
                            <p className="text-sm font-semibold text-brand-primary group-hover/item:text-brand-primary">
                              {subItem.title}
                            </p>
                            <p className="text-xs text-zinc-500 line-clamp-1">
                              {subItem.desc}
                            </p>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <button 
                  onClick={() => signInWithGoogle()}
                  className="text-sm font-medium text-zinc-600 hover:text-brand-primary"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleGetStarted}
                  className="bg-brand-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-brand-primary text-white px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Dashboard
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-brand-soft transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white overflow-hidden">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" referrerPolicy="no-referrer" />
                      ) : (
                        <UserIcon className="w-4 h-4" />
                      )}
                    </div>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", showUserMenu && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-brand-border rounded-xl shadow-xl p-2"
                      >
                        <div className="px-3 py-2 border-b border-brand-border mb-1">
                          <p className="text-xs font-semibold text-zinc-400 uppercase">Account</p>
                          <p className="text-sm font-medium text-zinc-900 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-brand-soft rounded-lg transition-colors border-0 justify-start cursor-pointer font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-zinc-500" />
                          Edit Profile
                        </button>
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border-0 justify-start cursor-pointer font-medium"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-600"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-brand-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <div key={item.name} className="py-2">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{item.name}</p>
                  <div className="grid gap-2 pl-2">
                    {item.dropdown.map((subItem) => (
                      <a key={subItem.title} href="#" className="block py-1 text-sm font-medium text-zinc-600">
                        {subItem.title}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-brand-border mt-4 flex flex-col gap-3">
                {!user ? (
                  <>
                    <button 
                      onClick={() => { signInWithGoogle(); setMobileMenuOpen(false); }}
                      className="text-center font-medium text-zinc-600 py-2"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }}
                      className="w-full bg-brand-primary text-white py-3 rounded-xl font-medium"
                    >
                      Try Hiro Free
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { navigate('/upload'); setMobileMenuOpen(false); }}
                      className="w-full bg-brand-primary text-white py-3 rounded-xl font-medium text-center"
                    >
                      Dashboard
                    </button>
                    <div className="flex items-center justify-between gap-3 px-2 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white overflow-hidden">
                          {user.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="Profile" referrerPolicy="no-referrer" />
                          ) : (
                            <UserIcon className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-zinc-900 truncate max-w-[150px]">{user.email}</span>
                      </div>
                      <button
                        onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                        className="text-xs font-semibold text-brand-primary border border-brand-border px-2.5 py-1 rounded-full hover:bg-brand-soft transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    <button
                      onClick={() => { signOut(); setMobileMenuOpen(false); }}
                      className="w-full text-red-600 py-2 font-medium bg-red-50 rounded-xl cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
