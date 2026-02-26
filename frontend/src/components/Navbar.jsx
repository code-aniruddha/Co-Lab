// ============================================================
//  src/components/Navbar.jsx
// ============================================================
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Compass, Users, Rocket, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'Discover',   to: '/discover',   icon: Compass },
  { label: 'Community',  to: '/community',  icon: Users   },
];

export default function Navbar({ onPostProject, onOpenAuth }) {
  const [scrolled,  setScrolled] = useState(false);
  const [menuOpen,  setMenuOpen] = useState(false);
  const [userMenu,  setUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close menus on route change
  useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location.pathname]);

  const go = (to) => { setMenuOpen(false); navigate(to); };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#080f1e]/92 backdrop-blur-xl border-b border-sky-500/15 shadow-xl shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-[64px]">

            {/* Logo â†’ home */}
            <motion.div whileHover={{ scale: 1.03 }} className="cursor-pointer" onClick={() => go('/')}>
              <Logo size={32} showText />
            </motion.div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, to, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <button
                    key={label}
                    onClick={() => go(to)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'text-sky-400 bg-sky-500/10'
                        : 'text-slate-400 hover:text-sky-400 hover:bg-sky-500/8'
                    }`}
                  >
                    <Icon size={13} />{label}
                  </button>
                );
              })}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2.5">
              {user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 22px rgba(56,189,248,0.45)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onPostProject}
                    className="hidden sm:flex btn-primary py-2 px-4 text-sm"
                  >
                    <Rocket size={13} /> Post Project
                  </motion.button>

                  {/* Avatar dropdown */}
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setUserMenu(v => !v)}
                      className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl border border-slate-700/60 hover:border-sky-500/40 bg-slate-800/50 transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                        {initials}
                      </div>
                      <ChevronDown size={12} className={`text-slate-400 transition-transform ${userMenu ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {userMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -6 }}
                          animate={{ opacity: 1, scale: 1,    y: 0  }}
                          exit={{   opacity: 0, scale: 0.95, y: -6  }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-2xl border border-slate-700/60 p-1.5 shadow-xl"
                        >
                          <div className="px-3 py-2.5 border-b border-slate-700/50 mb-1">
                            <p className="text-white text-sm font-semibold truncate">
                              {user.user_metadata?.full_name || 'Student'}
                            </p>
                            <p className="text-slate-500 text-xs truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={() => { signOut(); setUserMenu(false); }}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-medium"
                          >
                            <LogOut size={14} /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onOpenAuth}
                    className="hidden sm:flex btn-ghost py-2 px-4 text-sm"
                  >
                    <LogIn size={13} /> Log In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 0 22px rgba(56,189,248,0.4)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onOpenAuth}
                    className="hidden sm:flex btn-primary py-2 px-4 text-sm"
                  >
                    Get Started
                  </motion.button>
                </>
              )}

              {/* Hamburger */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="md:hidden w-9 h-9 rounded-xl border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-sky-500/40 transition-all"
                onClick={() => setMenuOpen(v => !v)}
              >
                {menuOpen ? <X size={17} /> : <Menu size={17} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0  }}
            exit={{   opacity: 0, y: -8  }}
            transition={{ duration: 0.2 }}
            className="fixed top-[64px] left-0 right-0 z-40 bg-[#080f1e]/96 backdrop-blur-xl border-b border-sky-500/15 px-5 py-4 space-y-1"
          >
            {NAV_LINKS.map(({ label, to, icon: Icon }) => (
              <button
                key={label}
                onClick={() => go(to)}
                className="flex items-center gap-2.5 text-slate-300 hover:text-sky-400 transition-colors w-full text-left py-3 px-3 rounded-xl hover:bg-sky-500/8 text-sm"
              >
                <Icon size={15} />{label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => { setMenuOpen(false); onPostProject(); }}
                    className="btn-primary w-full justify-center py-3 text-sm"
                  >
                    <Rocket size={14} /> Post a Project
                  </button>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="w-full justify-center py-3 text-sm text-red-400 flex items-center gap-2 rounded-xl border border-red-500/30 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); onOpenAuth(); }}
                  className="btn-primary w-full justify-center py-3 text-sm"
                >
                  <LogIn size={14} /> Log In / Sign Up
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
