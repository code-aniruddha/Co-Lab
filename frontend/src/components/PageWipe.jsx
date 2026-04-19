import { motion } from 'framer-motion';

export function PageWipe() {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{ backgroundColor: 'var(--ink)' }}
        initial={{ x: '100%' }}
        animate={{ x: '100%' }}
        exit={{ x: '-100%', transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } }}
      />
      <motion.div
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{ backgroundColor: 'var(--ink)' }}
        initial={{ x: '100%' }}
        animate={{ x: '-100%', transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] } }}
      />
    </>
  );
}
