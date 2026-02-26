// ============================================================
//  src/App.jsx  —  Co-Lab root component
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar          from './components/Navbar';
import Hero            from './components/Hero';
import ProjectFeed     from './components/ProjectFeed';
import PostProjectForm from './components/PostProjectForm';
import Footer          from './components/Footer';
import AuthModal       from './components/AuthModal';
import PageLoader      from './components/PageLoader';

// ─── Inner app (needs auth context) ──────────────────────
function AppInner() {
  const { user } = useAuth();
  const [showForm,  setShowForm]  = useState(false);
  const [showAuth,  setShowAuth]  = useState(false);
  const [feedKey,   setFeedKey]   = useState(0);

  // Lenis smooth scroll init
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);

    // Expose globally so nav scroll buttons also benefit
    window.__lenis = lenis;

    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);

  const openPostForm = useCallback(() => {
    if (!user) { setShowAuth(true); return; }
    setShowForm(true);
  }, [user]);

  const closeForm  = useCallback(() => setShowForm(false), []);
  const openAuth   = useCallback(() => setShowAuth(true),  []);
  const closeAuth  = useCallback(() => setShowAuth(false), []);
  const onSuccess  = useCallback(() => setFeedKey(k => k + 1), []);

  const handleScrollTo = useCallback((href) => {
    const el = document.querySelector(href);
    if (!el) return;
    window.__lenis?.scrollTo(el, { duration: 1.4, offset: -70 }) ||
      el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-100">
      <Navbar
        onPostProject={openPostForm}
        onOpenAuth={openAuth}
      />

      <main>
        <Hero
          onPostProject={openPostForm}
          onDiscover={() => handleScrollTo('#projects')}
        />
        <ProjectFeed
          key={feedKey}
          onNeedAuth={openAuth}
        />
      </main>

      <Footer />

      {/* Post Project Modal (auth-gated) */}
      <AnimatePresence>
        {showForm && (
          <PostProjectForm
            key="post-form"
            onClose={closeForm}
            onSuccess={onSuccess}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <AuthModal
            key="auth-modal"
            onClose={closeAuth}
            onSuccess={(demoUser) => {
              closeAuth();
              // After login, open post form if that was the intent
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Root with providers ──────────────────────────────────
export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <AuthProvider>
      <AnimatePresence>
        {!loaded && <PageLoader key="loader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && <AppInner />}
    </AuthProvider>
  );
}
