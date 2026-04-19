// ============================================================
//  src/App.jsx  —  Co-Lab root with React Router (White Canvas)
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import Lenis from 'lenis';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar          from './components/Navbar';
import Footer          from './components/Footer';
import PostProjectForm from './components/PostProjectForm';
import AuthModal       from './components/AuthModal';
import PageLoader      from './components/PageLoader';
import { PageWipe }    from './components/PageWipe';
import { CustomCursor } from './hooks/useCustomCursor';

import HomePage      from './pages/HomePage';
import DiscoverPage  from './pages/DiscoverPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage   from './pages/ProfilePage';

// ─── Scroll-to-top on route change ───────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true }) ||
      window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// ─── Scroll Progress Bar ─────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// ─── Inner app (needs auth context + router) ─────────────
function AppInner() {
  const { user, loginDemo } = useAuth();
  const [showForm,  setShowForm]  = useState(false);
  const [showAuth,  setShowAuth]  = useState(false);
  const [feedKey,   setFeedKey]   = useState(0);
  const [loaded,    setLoaded]    = useState(false);
  const location = useLocation();

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
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
    if (userObj) loginDemo(userObj);
    setFeedKey(k => k + 1);
  }, [loginDemo]);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      
      <AnimatePresence mode="wait">
        {!loaded && <PageLoader key="loader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <div className="min-h-screen relative z-[1]">
        <ScrollToTop />
        <Navbar onPostProject={openPostForm} onOpenAuth={openAuth} />

        {/* pt-14 = 56px navbar height */}
        <main style={{ paddingTop: '56px' }}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <>
                    <PageWipe />
                    <HomePage onPostProject={openPostForm} onNeedAuth={openAuth} />
                  </>
                }
              />
              <Route
                path="/discover"
                element={
                  <>
                    <PageWipe />
                    <DiscoverPage key={feedKey} onNeedAuth={openAuth} onPostProject={openPostForm} />
                  </>
                }
              />
              <Route 
                path="/community" 
                element={<><PageWipe /><CommunityPage /></>} 
              />
              <Route
                path="/profile"
                element={
                  <>
                    <PageWipe />
                    <ProfilePage onOpenAuth={openAuth} onPostProject={openPostForm} />
                  </>
                }
              />
              <Route 
                path="*" 
                element={<><PageWipe /><HomePage onPostProject={openPostForm} onNeedAuth={openAuth} /></>} 
              />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />

        <AnimatePresence>
          {showForm && (
            <PostProjectForm
              key="post-form"
              onClose={closeForm}
              onSuccess={onSuccess}
            />
          )}
        </AnimatePresence>

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
