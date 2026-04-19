// ============================================================
//  src/pages/DiscoverPage.jsx (White Canvas Edition)
// ============================================================
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import ProjectFeed from '../components/ProjectFeed';
import { variants, viewportConfig } from '../lib/motion';

export default function DiscoverPage({ onNeedAuth, onPostProject }) {
  return (
    <div style={{ '--section-accent': 'var(--accent-blue)', minHeight: '100vh', backgroundColor: 'var(--canvas)' }}>
      {/* Page header */}
      <div style={{ borderBottom: '2px solid var(--ink)', backgroundColor: 'var(--canvas-warm)' }}>
        <div className="max-w-[1340px] mx-auto px-5 sm:px-8 pt-12 pb-10">
          <motion.div
            initial="hidden"
            animate="show"
            variants={variants.staggerFast}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          >
            <div>
              <motion.div variants={variants.fadeIn} className="flex items-center gap-2 mb-4" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--section-accent)'
              }}>
                <Compass size={14} /> Discover
              </motion.div>
              
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(3rem, 5vw, 6rem)', color: 'var(--ink)', lineHeight: 0.9, letterSpacing: '-0.03em', margin: 0 }}>
                <div className="overflow-hidden block">
                  <motion.div variants={variants.clipReveal}>Find Your Next</motion.div>
                </div>
                <div className="overflow-hidden block">
                  <motion.div variants={variants.clipReveal}><span className="accent-highlight">Collaboration</span></motion.div>
                </div>
              </h1>
              
              <motion.p variants={variants.fadeUp} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--ink-muted)', marginTop: '1.5rem', maxWidth: '600px', lineHeight: 1.85 }}>
                Browse active projects. Skills highlighted in <span style={{ color: 'var(--ink)', fontWeight: 700 }}>black</span> match your profile. 
                The <span style={{ color: 'var(--section-accent)', fontWeight: 700 }}>Smart Match</span> badge shows your best-fit projects.
              </motion.p>
            </div>

            <motion.button
              variants={variants.fadeUp}
              onClick={onPostProject}
              className="brutal-hover"
              style={{
                backgroundColor: 'var(--section-accent)',
                color: 'var(--canvas)',
                border: 'none',
                padding: '1rem 2rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              Post a Project
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Full feed */}
      <ProjectFeed onNeedAuth={onNeedAuth} hideHeader />
    </div>
  );
}
