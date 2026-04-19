// ============================================================
//  src/pages/HomePage.jsx (White Canvas Edition)
// ============================================================
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import Hero from '../components/Hero';
import { MOCK_PROJECTS } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';
import { variants, viewportConfig } from '../lib/motion';
import { useParallax } from '../hooks/useParallax';

// ─── Stat Block ─────────────────────────────────────────
function StatBlock({ value, label }) {
  return (
    <div style={{ borderTop: '3px solid var(--section-accent)', paddingTop: '1rem' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 'clamp(3.5rem, 8vw, 8rem)',
        color: 'var(--section-accent)',
        lineHeight: 0.9,
        letterSpacing: '-0.04em'
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        color: 'var(--ink-muted)',
        marginTop: '0.5rem'
      }}>
        {label}
      </div>
    </div>
  );
}

// ─── Preview Card ───────────────────────────────────────
function PreviewCard({ project, index }) {
  return (
    <motion.div
      variants={variants.fadeUp}
      className="brutal-hover cursor-pointer flex flex-col"
      style={{
        backgroundColor: 'var(--canvas)',
        border: '1.5px solid var(--rule-strong)',
        padding: '1.75rem',
        borderTop: '4px solid var(--section-accent)',
        height: '100%'
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.25em',
        color: 'var(--section-accent)',
        marginBottom: '0.75rem'
      }}>
        {project.domain}
      </div>
      
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.125rem',
        color: 'var(--ink)',
        lineHeight: 1.15,
        letterSpacing: '-0.01em',
        marginBottom: '1rem'
      }}>
        {project.title}
      </h3>
      
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8125rem',
        color: 'var(--ink-muted)',
        lineHeight: 1.85,
        flexGrow: 1,
        marginBottom: '1.5rem'
      }}>
        {project.description.slice(0, 100)}...
      </p>
      
      <div className="flex justify-between items-end mt-auto pt-4" style={{ borderTop: '1px solid var(--rule)' }}>
        <div className="flex items-center gap-1 text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
          <Users size={12} /> {project.interest_count || 0}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--ink)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          View <ArrowRight size={12} />
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage({ onPostProject, onNeedAuth }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const titleParallax = useParallax(0.35);

  const handlePost = useCallback(() => {
    if (!user) { onNeedAuth?.(); return; }
    onPostProject?.();
  }, [user, onNeedAuth, onPostProject]);

  const featured = MOCK_PROJECTS.slice(0, 3);

  return (
    <div style={{ '--section-accent': 'var(--accent-red)' }}>
      {/* Hero */}
      <Hero onPostProject={handlePost} onDiscover={() => navigate('/discover')} />

      {/* Marquee Strip */}
      <section style={{ backgroundColor: 'var(--section-accent)', borderBottom: '2px solid var(--ink)', padding: '1rem 0', overflow: 'hidden' }}>
        <motion.div
          animate={{ x: [0, '-50%'] }}
          transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
          className="flex whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: 'var(--canvas)',
            width: '200%'
          }}
        >
          {Array(10).fill('◆ OPEN INNOVATION NETWORK ◆ BUILD TOGETHER ◆ DISCOVER TALENT ').join('')}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: 'var(--section-padding-y) 0', backgroundColor: 'var(--canvas)', '--section-accent': 'var(--accent-red)' }}>
        <div className="max-w-[1340px] mx-auto px-5 sm:px-8">
          <motion.div 
            variants={variants.staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12"
          >
            <motion.div variants={variants.fadeUp}><StatBlock value="200+" label="Projects" /></motion.div>
            <motion.div variants={variants.fadeUp}><StatBlock value="1.2k" label="Students" /></motion.div>
            <motion.div variants={variants.fadeUp}><StatBlock value="48" label="Colleges" /></motion.div>
            <motion.div variants={variants.fadeUp}><StatBlock value="94%" label="Match Rate" /></motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section style={{ padding: 'var(--section-padding-y) 0', backgroundColor: 'var(--canvas-section)', '--section-accent': 'var(--accent-amber)' }}>
        <div className="max-w-[1340px] mx-auto px-5 sm:px-8">
          
          {/* Header Pattern */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportConfig}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'var(--section-accent)',
                marginBottom: '1rem'
              }}
            >
              <span style={{ color: 'var(--ink-faint)', marginRight: '0.5rem' }}>02</span>
              Latest Projects
            </motion.div>
            
            <motion.div style={{ y: titleParallax }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(3rem, 6vw, 7rem)',
                color: 'var(--ink)',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
                margin: 0
              }}>
                <div className="overflow-hidden block">
                  <motion.div variants={variants.clipReveal} initial="hidden" whileInView="show" viewport={viewportConfig}>
                    Hot
                  </motion.div>
                </div>
                <div className="overflow-hidden block">
                  <motion.div variants={variants.clipReveal} initial="hidden" whileInView="show" viewport={viewportConfig} transition={{ delay: 0.12 }}>
                    <span className="accent-highlight">Collaborations</span>
                  </motion.div>
                </div>
              </h2>
            </motion.div>
            
            <motion.div
              variants={variants.drawBorder}
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
              style={{
                borderBottom: '1px solid var(--rule)',
                margin: '2.5rem 0'
              }}
            />
          </div>

          <motion.div
            variants={variants.staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featured.map((project, i) => (
              <PreviewCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            className="mt-16 text-center"
          >
            <button
              onClick={() => navigate('/discover')}
              className="brutal-hover"
              style={{
                backgroundColor: 'var(--ink)',
                color: 'var(--canvas)',
                border: 'none',
                padding: '1.25rem 3rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                cursor: 'pointer'
              }}
            >
              Explore All Projects
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pull Quote Section */}
      <section style={{ padding: 'var(--section-padding-y) 0', backgroundColor: 'var(--canvas)', '--section-accent': 'var(--accent-red)' }}>
        <div className="max-w-[680px] mx-auto px-5 sm:px-8">
          <motion.div
            variants={variants.slideInLeft}
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            style={{
              borderLeft: '6px solid var(--section-accent)',
              paddingLeft: '2rem',
              margin: '4rem 0'
            }}
          >
            <p style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
              color: 'var(--ink)',
              lineHeight: 1.2
            }}>
              "The white background is not a retreat from brutalism — it is its purest form. Ink on white. Structure on white."
            </p>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginTop: '1rem'
            }}>
              — Design Mandate
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
