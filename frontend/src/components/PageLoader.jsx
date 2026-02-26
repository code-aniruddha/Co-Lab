// ============================================================
//  src/components/PageLoader.jsx  —  Full-screen boot animation
// ============================================================
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function PageLoader({ onDone }) {
  const [phase, setPhase] = useState(0); // 0 = logo in, 1 = text, 2 = exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1900);
    const t3 = setTimeout(() => onDone?.(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a1628]"
        >
          {/* Background radial */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(56,189,248,0.07) 0%, transparent 70%)',
            }}
          />

          {/* Orbital ring */}
          <svg
            className="absolute w-72 h-72 spin-slow opacity-20"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="100" cy="100" r="90" stroke="url(#orb)" strokeWidth="0.8" strokeDasharray="6 3" />
            <defs>
              <linearGradient id="orb" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          >
            <Logo size={64} showText={false} />
          </motion.div>

          {/* Wordmark */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-5 text-center"
              >
                <p className="text-3xl font-extrabold gradient-text tracking-tight">Co-Lab</p>
                <p className="text-slate-500 text-sm mt-1.5 tracking-widest uppercase text-xs">
                  Student Collaboration Hub
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
