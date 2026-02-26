// ============================================================
//  src/pages/DiscoverPage.jsx  —  Full project discovery
// ============================================================
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import ProjectFeed from '../components/ProjectFeed';

export default function DiscoverPage({ onNeedAuth, onPostProject }) {
  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-10 pb-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Compass size={13} /> Discover
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Find Your Next{' '}
              <span className="gradient-text">Collaboration</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Browse active projects. Skills highlighted in{' '}
              <span className="text-sky-400 font-semibold">blue</span> match your profile. The{' '}
              <span className="text-sky-400 font-semibold">Smart Match</span> badge shows your best-fit projects.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 22px rgba(56,189,248,0.4)' }}
            whileTap={{ scale: 0.96 }}
            onClick={onPostProject}
            className="btn-primary px-6 py-3 text-sm shrink-0 self-start sm:self-center"
          >
            + Post a Project
          </motion.button>
        </motion.div>
      </div>

      {/* Full feed */}
      <ProjectFeed onNeedAuth={onNeedAuth} hideHeader />
    </div>
  );
}
