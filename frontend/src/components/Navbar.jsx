// ============================================================
//  src/components/Navbar.jsx (White Canvas Edition)
// ============================================================
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, LogIn, LogOut, User, FolderOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Discover',   to: '/discover' },
  { label: 'Community',  to: '/community' },
];

export default function Navbar({ onPostProject, onOpenAuth }) {
  const [scrolled,  setScrolled] = useState(false);
  const [menuOpen,  setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const go = (to) => { setMenuOpen(false); navigate(to); };

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <>
      <motion.nav
        initial={{ y: -56 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height: '56px',
          backgroundColor: 'var(--canvas)',
          borderBottom: scrolled ? '2px solid var(--ink)' : '2px solid transparent',
          boxShadow: scrolled && window.scrollY < 100 ? '0 2px 0 var(--rule)' : 'none'
        }}
      >
        <div className="h-full px-5 sm:px-8 lg:px-10 flex items-center justify-between">

          {/* Logo */}
          <div 
            className="cursor-pointer flex items-baseline"
            onClick={() => go('/')}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.9375rem',
              color: 'var(--ink)',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase'
            }}>
              Co-Lab
            </span>
            <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--section-accent)', marginLeft: '4px' }} />
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center" style={{ gap: '2.5rem' }}>
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <button
                  key={label}
                  onClick={() => go(to)}
                  className={`relative cursor-pointer transition-colors ${active ? '' : 'hover-underline'}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: active ? 'var(--ink)' : 'var(--ink-muted)',
                    borderBottom: active ? '2px solid var(--section-accent)' : 'none',
                    paddingBottom: active ? '2px' : '0'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={onPostProject}
                  className="hidden sm:flex brutal-hover"
                  style={{
                    backgroundColor: 'var(--ink)',
                    color: 'var(--canvas)',
                    padding: '0.5rem 1.25rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    border: 'none',
                    transition: 'background-color 0.2s, color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--section-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--ink)';
                  }}
                >
                  Post Project
                </button>

                {/* Profile Link instead of dropdown */}
                <button
                  onClick={() => navigate('/profile')}
                  className="hidden sm:flex brutal-hover items-center justify-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--canvas)',
                    border: '1.5px solid var(--ink)',
                    color: 'var(--ink)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                  }}
                >
                  {initials}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="hidden sm:flex hover-underline cursor-pointer"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'var(--ink-muted)'
                  }}
                >
                  Log In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="hidden sm:flex brutal-hover"
                  style={{
                    backgroundColor: 'var(--ink)',
                    color: 'var(--canvas)',
                    padding: '0.5rem 1.25rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    border: 'none',
                    transition: 'background-color 0.2s, color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--section-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--ink)';
                  }}
                >
                  Get Started
                </button>
              </>
            )}

            {/* Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-8 h-8"
              onClick={() => setMenuOpen(v => !v)}
              style={{ border: 'none', background: 'none', color: 'var(--ink)' }}
            >
              {menuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu takeover */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{
              backgroundColor: 'var(--canvas)',
              borderLeft: '2px solid var(--ink)',
              paddingTop: '80px', // below navbar
              paddingLeft: '2rem',
              paddingRight: '2rem'
            }}
          >
            <div className="flex flex-col gap-6 mt-8">
              {NAV_LINKS.map(({ label, to }, i) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onClick={() => go(to)}
                  className="text-left"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '3rem',
                    color: 'var(--ink)',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    lineHeight: 1
                  }}
                >
                  {label}
                </motion.button>
              ))}
            </div>

            <div className="mt-auto mb-10 border-t-2 pt-6" style={{ borderColor: 'var(--ink)' }}>
              {user ? (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    className="text-left hover-underline"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', textTransform: 'uppercase', color: 'var(--ink)' }}
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onPostProject(); }}
                    className="text-left hover-underline"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', textTransform: 'uppercase', color: 'var(--section-accent)' }}
                  >
                    Post a Project
                  </button>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="text-left hover-underline mt-4"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', textTransform: 'uppercase', color: 'var(--ink-muted)' }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); onOpenAuth(); }}
                  className="w-full text-left flex items-center justify-between brutal-hover"
                  style={{
                    backgroundColor: 'var(--ink)',
                    color: 'var(--canvas)',
                    padding: '1rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                  }}
                >
                  Log In / Sign Up <ArrowRight size={20} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
