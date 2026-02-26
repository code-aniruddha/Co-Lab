// ============================================================
//  src/App.jsx  —  Co-Lab root with React Router
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar          from './components/Navbar';
import Footer          from './components/Footer';
import PostProjectForm from './components/PostProjectForm';
import AuthModal       from './components/AuthModal';
import PageLoader      from './components/PageLoader';

import HomePage      from './pages/HomePage';
import DiscoverPage  from './pages/DiscoverPage';
import CommunityPage from './pages/CommunityPage';

// ─── Scroll-to-top on route change ───────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true }) ||
      window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// ─── Inner app (needs auth context + router) ─────────────
function AppInner() {
  const { user, loginDemo } = useAuth();
  const [showForm,  setShowForm]  = useState(false);
  const [showAuth,  setShowAuth]  = useState(false);
  const [feedKey,   setFeedKey]   = useState(0);
  const [loaded,    setLoaded]    = useState(false);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    window.__lenis = lenis;
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);

  const openPostForm = useCallback(() => {
    if (!user) { setShowAuth(true); return; }
    setShowForm(true);
  }, [user]);

  const closeForm = useCallback(() => setShowForm(false), []);
  const openAuth  = useCallback(() => setShowAuth(true),  []);
  const closeAuth = useCallback(() => setShowAuth(false), []);
  const onSuccess = useCallback((userObj) => {
    if (userObj) loginDemo(userObj); // demo / offline user
    setFeedKey(k => k + 1);
  }, [loginDemo]);

  return (
    <>
      {/* Boot loader */}
      <AnimatePresence>
        {!loaded && <PageLoader key="loader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <div className="min-h-screen bg-[#0a1628] text-slate-100">
        <ScrollToTop />

        <Navbar onPostProject={openPostForm} onOpenAuth={openAuth} />

        {/* pt-16 = 64px — clears the fixed navbar for all non-hero pages */}
        <main style={{ paddingTop: '4rem' }}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onPostProject={openPostForm}
                  onNeedAuth={openAuth}
                />
              }
            />
            <Route
              path="/discover"
              element={
                <DiscoverPage
                  key={feedKey}
                  onNeedAuth={openAuth}
                  onPostProject={openPostForm}
                />
              }
            />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="*" element={<HomePage onPostProject={openPostForm} onNeedAuth={openAuth} />} />
          </Routes>
        </main>

        <Footer />

        {/* Post Project Modal */}
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
              onSuccess={(userObj) => { onSuccess(userObj); closeAuth(); }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}
