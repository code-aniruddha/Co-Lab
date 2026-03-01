// ============================================================
//  src/components/Hero.jsx
//  Hero content only � the 3-D canvas lives in Background3D.jsx
//  which is rendered fixed behind the whole app in App.jsx
// ============================================================
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Users, Globe, Zap, Network, Rocket } from 'lucide-react';

const STATS = [
  { value: '200+', label: 'Projects',   icon: Network },
  { value: '1.2k', label: 'Students',   icon: Users   },
  { value: '48',   label: 'Colleges',   icon: Globe   },
  { value: '94%',  label: 'Match Rate', icon: Zap     },
];

export default function Hero({ onPostProject, onDiscover }) {
  const scrollDown = useCallback(() => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Radial vignette so text stays readable against the global BG */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 0%, rgba(8,15,30,0.72) 70%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative text-center px-5 sm:px-6 max-w-5xl mx-auto pt-28" style={{ zIndex: 2 }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/25 bg-sky-500/8 text-sky-400 text-[11px] font-bold uppercase tracking-widest mb-7 animated-border"
        >
          <Sparkles size={11} className="pulse-glow" />
          Open Innovation Network
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6"
        >
          <span className="text-white">Where Great</span>
          <br />
          <span className="gradient-text text-glow-sky">Ideas Find</span>
          <br />
          <span className="text-white">Their Team.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Co-Lab connects visionary student builders with the talent they need.
          Post your idea, discover projects that match your skills, and ship
          something meaningful � together.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(56,189,248,0.55)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onPostProject}
            className="btn-primary px-9 py-4 text-base w-full sm:w-auto"
          >
            <Rocket size={16} /> Post Your Project
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, borderColor: 'rgba(56,189,248,0.6)' }}
            whileTap={{ scale: 0.96 }}
            onClick={onDiscover}
            className="btn-ghost px-9 py-4 text-base w-full sm:w-auto"
          >
            Explore Projects
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mb-20"
        >
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88 + i * 0.1 }}
              whileHover={{ scale: 1.08 }}
              className="text-center cursor-default"
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Icon size={13} className="text-sky-400" />
                <span className="text-2xl font-extrabold text-white">{value}</span>
              </div>
              <p className="text-slate-500 text-[11px] uppercase tracking-widest">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        whileHover={{ scale: 1.1 }}
        style={{ zIndex: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-500 hover:text-sky-400 transition-colors group"
      >
        <span className="text-[10px] tracking-widest uppercase font-medium">Discover</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-slate-700/70 flex items-center justify-center group-hover:border-sky-500/50 transition-colors"
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.button>
    </section>
  );
}
