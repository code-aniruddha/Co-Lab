// ============================================================
//  src/pages/HomePage.jsx  —  Landing page (Hero + preview)
// ============================================================
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Globe, Zap } from 'lucide-react';
import Hero from '../components/Hero';
import { MOCK_PROJECTS, DOMAIN_COLORS } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';

// ─── Mini project card for homepage preview ───────────────
function PreviewCard({ project, index }) {
  const domain = DOMAIN_COLORS[project.domain] || DOMAIN_COLORS.Startup;
  const emoji  = project.domain === 'Startup' ? '🚀' : project.domain === 'Hackathon' ? '⚡' : '🔬';

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-3 hover:ring-1 hover:ring-sky-500/30 transition-all duration-300"
    >
      <div>
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide mb-2"
          style={{ background: domain.bg, color: domain.text, border: `1px solid ${domain.border}40` }}
        >
          {emoji} {project.domain}
        </span>
        <h3 className="text-base font-bold text-white leading-tight mb-1">{project.title}</h3>
        <p className="text-xs text-slate-500">by {project.owner_name}</p>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{project.description}</p>
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {project.skills_list?.slice(0, 3).map(skill => (
          <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 text-[11px] border border-slate-700/50">
            {skill}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-500 pt-1 border-t border-slate-800">
        <Users size={11} />
        <span>{project.interest_count || 0} interested</span>
      </div>
    </motion.div>
  );
}

// ─── Stats banner ─────────────────────────────────────────
const STATS = [
  { value: '200+', label: 'Projects Posted',  icon: Sparkles },
  { value: '1.2k', label: 'Collaborators',    icon: Users    },
  { value: '48',   label: 'Colleges Joined',  icon: Globe    },
  { value: '95%',  label: 'Match Accuracy',   icon: Zap      },
];

// ─── "How it works" steps ─────────────────────────────────
const HOW_STEPS = [
  {
    n: '01', title: 'Post Your Idea',
    desc: 'Describe your project, needed skills, and timeline. Takes 2 minutes.',
    color: 'from-sky-500 to-sky-400',
  },
  {
    n: '02', title: 'Get Smart-Matched',
    desc: 'Our algorithm surfaces your project to students whose skills align perfectly.',
    color: 'from-indigo-500 to-indigo-400',
  },
  {
    n: '03', title: 'Build Together',
    desc: 'Review interest requests, form your team, and start building.',
    color: 'from-purple-500 to-purple-400',
  },
];

// ─── HomePage ─────────────────────────────────────────────
export default function HomePage({ onPostProject, onNeedAuth }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Hero is full-screen so it needs to overlap the navbar clearance added by <main>.
  // We undo the 4rem top-padding here so Hero starts flush at top of viewport.
  const heroPageStyle = { marginTop: '-4rem' };

  const handlePost = useCallback(() => {
    if (!user) { onNeedAuth?.(); return; }
    onPostProject?.();
  }, [user, onNeedAuth, onPostProject]);

  const featured = MOCK_PROJECTS.slice(0, 3);

  return (
    <>
      {/* Hero — negative margin undoes main's pt-16 so hero spans full viewport */}
      <div style={heroPageStyle}>
        <Hero
          onPostProject={handlePost}
          onDiscover={() => navigate('/discover')}
        />
      </div>

      {/* ── Stats section ── */}
      <section className="py-16 section-glass border-y border-slate-800/40">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-1">
                  <Icon size={18} className="text-sky-400" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white">{value}</span>
                <span className="text-slate-500 text-xs uppercase tracking-wide">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured projects ── */}
      <section id="featured" className="py-20 section-glass-mid">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-2"
              >
                Latest Projects
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-extrabold text-white"
              >
                Hot Collaborations
              </motion.h2>
            </div>
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ x: 4 }}
              onClick={() => navigate('/discover')}
              className="flex items-center gap-2 text-sky-400 text-sm font-semibold hover:text-sky-300 transition-colors shrink-0"
            >
              View all projects <ArrowRight size={15} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((project, i) => (
              <PreviewCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {/* Discover CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/discover')}
              className="btn-primary px-8 py-3.5 text-base w-full sm:w-auto"
            >
              Explore All Projects <ArrowRight size={16} />
            </button>
            <button
              onClick={handlePost}
              className="btn-ghost px-8 py-3.5 text-base w-full sm:w-auto"
            >
              Post Your Project
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-20 section-glass">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-3"
            >
              How It Works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-extrabold text-white"
            >
              From Idea to Team in Minutes
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {HOW_STEPS.map(({ n, title, desc, color }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-extrabold text-lg shadow-lg`}>
                  {n}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
