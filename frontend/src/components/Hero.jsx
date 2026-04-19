// ============================================================
//  src/components/Hero.jsx (White Canvas Edition)
// ============================================================
import { motion } from 'framer-motion';
import { useParallax } from '../hooks/useParallax';
import { variants } from '../lib/motion';

export default function Hero({ onPostProject, onDiscover }) {
  const headingParallax = useParallax(0.25);
  const subParallax = useParallax(0.45);
  const indexParallax = useParallax(0.12);

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center"
      style={{ 
        backgroundColor: 'var(--canvas)',
        '--section-accent': 'var(--accent-red)'
      }}
    >
      {/* Background Index Number */}
      <motion.div
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '30vw',
          color: 'var(--section-accent)',
          opacity: 0.05,
          lineHeight: 0.75,
          y: indexParallax
        }}
      >
        01
      </motion.div>

      <div className="relative px-5 sm:px-8 max-w-[1340px] mx-auto w-full" style={{ zIndex: 2 }}>
        
        {/* Top Label */}
        <motion.div
          variants={variants.fadeIn}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            color: 'var(--ink-muted)',
            borderLeft: '3px solid var(--section-accent)',
            paddingLeft: '0.75rem'
          }}>
            Creative Studio 2024
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div style={{ y: headingParallax }} className="mb-10">
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(5rem, 12vw, 13rem)',
            color: 'var(--ink)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            margin: 0
          }}>
            <div className="overflow-hidden block">
              <motion.div variants={variants.clipReveal} initial="hidden" animate="show">
                Where Great
              </motion.div>
            </div>
            <div className="overflow-hidden block">
              <motion.div variants={variants.clipReveal} initial="hidden" animate="show" transition={{ delay: 0.12 }}>
                <span className="accent-highlight">Ideas Find</span>
              </motion.div>
            </div>
            <div className="overflow-hidden block">
              <motion.div variants={variants.clipReveal} initial="hidden" animate="show" transition={{ delay: 0.24 }}>
                Their Team.
              </motion.div>
            </div>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          style={{ y: subParallax }}
          variants={variants.fadeUp}
          initial="hidden"
          animate="show"
          className="max-w-[680px] mb-12"
        >
          <span style={{
            fontFamily: 'var(--font-editorial)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
            color: 'var(--ink-muted)',
            lineHeight: 1.3
          }}>
            Co-Lab connects visionary student builders with the talent they need. 
            Post your idea, discover projects that match your skills, and ship something meaningful.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={variants.fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-start gap-6"
        >
          <button
            onClick={onPostProject}
            className="brutal-hover"
            style={{
              backgroundColor: 'var(--section-accent)',
              color: 'var(--canvas)',
              border: 'none',
              padding: '1rem 2.5rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              cursor: 'pointer'
            }}
          >
            Post Your Project
          </button>
          
          <button
            onClick={onDiscover}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--ink)',
              border: '2px solid var(--ink)',
              padding: '1rem 2.5rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--ink)';
              e.currentTarget.style.color = 'var(--canvas)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--ink)';
            }}
          >
            Explore Projects
          </button>
        </motion.div>
      </div>

      {/* Horizontal Rule Below Hero */}
      <motion.div
        variants={variants.drawBorder}
        initial="hidden"
        animate="show"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          borderBottom: '3px solid var(--ink)'
        }}
      />
    </section>
  );
}
