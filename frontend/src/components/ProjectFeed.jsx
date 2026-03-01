// ============================================================
//  src/components/ProjectFeed.jsx
//  Discovery engine with Smart Match, live filtering, realtime
// ============================================================
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Zap, Users, Send, CheckCircle2, AlertCircle,
  Sparkles, Network, LogIn,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { MOCK_PROJECTS, USER_PROFILE, DOMAIN_COLORS } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';

// ─── Compatibility Score (AI-simulated) ──────────────────
function calcCompatScore(project, userSkills) {
  if (!project.skills_list?.length) return 40;
  const matches = project.skills_list.filter(s =>
    userSkills.some(u => u.toLowerCase() === s.toLowerCase())
  ).length;
  const raw = Math.round((matches / project.skills_list.length) * 100);
  return Math.min(100, raw + 20); // +20 base enthusiasm
}

// ─── Score Ring ───────────────────────────────────────────
function ScoreRing({ score }) {
  const r = 18, c = 2 * Math.PI * r;
  const filled = (score / 100) * c;
  const color  = score >= 70 ? '#38bdf8' : score >= 40 ? '#818cf8' : '#64748b';
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg width="48" height="48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#1e293b" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${filled} ${c - filled}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-white">{score}%</span>
    </div>
  );
}

// ─── localStorage interest helpers ──────────────────────
export function saveInterest(projectId, applicant) {
  try {
    const key  = `colab_interests_${projectId}`;
    const prev = JSON.parse(localStorage.getItem(key) || '[]');
    if (prev.some(a => a.email === applicant.email)) return;
    prev.unshift({ ...applicant, timestamp: Date.now() });
    localStorage.setItem(key, JSON.stringify(prev));
  } catch (_) {}
}
export function loadInterests(projectId) {
  try { return JSON.parse(localStorage.getItem(`colab_interests_${projectId}`) || '[]'); }
  catch { return []; }
}

// ─── Interest Button ──────────────────────────────────────
function InterestButton({ projectId, initialCount, onSuccess, onNeedAuth }) {
  const { user } = useAuth();
  const [count,   setCount]   = useState(initialCount || 0);
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (clicked) return;
    if (!user) { onNeedAuth?.(); return; }
    setLoading(true);
    const applicant = {
      name:   user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
      email:  user.email || '',
      skills: user.skills || user.user_metadata?.skills || USER_PROFILE.skills,
      role:   user.user_metadata?.role || user.role || '',
    };
    try {
      await supabase.from('applications').insert([{
        project_id:       projectId,
        applicant_name:   applicant.name,
        applicant_skills: applicant.skills,
        message: 'Interested in collaborating!',
      }]);
      await supabase.from('projects')
        .update({ interest_count: count + 1 })
        .eq('id', projectId);
    } catch (_) { /* offline / demo */ }
    saveInterest(projectId, applicant);
    setCount(c => c + 1);
    setClicked(true);
    setLoading(false);
    onSuccess?.();
  };

  if (!user) return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onNeedAuth?.()}
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:border-sky-500/40 hover:text-sky-400 transition-all"
    >
      <LogIn size={13} /> Log in to Join
    </motion.button>
  );

  return (
    <motion.button
      whileHover={!clicked ? { scale: 1.04, boxShadow: '0 0 18px rgba(56,189,248,0.4)' } : {}}
      whileTap={!clicked ? { scale: 0.96 } : {}}
      onClick={handleClick}
      disabled={loading || clicked}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
        clicked
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 cursor-default'
          : 'bg-sky-500/12 text-sky-400 border border-sky-500/30 hover:bg-sky-500/22'
      }`}
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
      ) : clicked ? (
        <><CheckCircle2 size={13} /> Interested</>
      ) : (
        <><Send size={13} /> Express Interest</>
      )}
    </motion.button>
  );
}

// ─── Project Card ─────────────────────────────────────────
function ProjectCard({ project, userSkills, index, onInterestSuccess, onNeedAuth }) {
  const score   = useMemo(() => calcCompatScore(project, userSkills), [project, userSkills]);
  const isMatch = score >= 60;
  const domain  = DOMAIN_COLORS[project.domain] || DOMAIN_COLORS.Startup;
  const filled  = project.status === 'filled';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{   opacity: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.25), duration: 0.25 }}
      className={`glass-card rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300 ${
        isMatch ? 'ring-1 ring-sky-500/30 shadow-lg shadow-sky-500/10' : ''
      } ${filled ? 'opacity-70' : ''}`}
    >
      {/* Smart Match badge */}
      {isMatch && !filled && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.07 + 0.3, type: 'spring', stiffness: 300 }}
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold uppercase tracking-wide"
        >
          <Zap size={9} className="pulse-glow" /> Smart Match
        </motion.div>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide mb-2"
            style={{ background: domain.bg, color: domain.text, border: `1px solid ${domain.border}40` }}
          >
            {project.domain === 'Startup' ? '🚀' : project.domain === 'Hackathon' ? '⚡' : '🔬'} {project.domain}
          </span>
          <h3 className="text-base font-bold text-white leading-tight">{project.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">by {project.owner_name}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{project.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {project.skills_list?.map(skill => {
          const matched = userSkills.some(u => u.toLowerCase() === skill.toLowerCase());
          return (
            <span
              key={skill}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all ${
                matched
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700/60'
              }`}
            >
              {matched && <span className="mr-1">✓</span>}{skill}
            </span>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-700/40">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <ScoreRing score={score} />
          <div>
            <p className="font-semibold text-slate-300">Compatibility</p>
            <p className="text-[10px]">
              {score >= 70 ? '🔥 Excellent fit' : score >= 40 ? '✨ Good match' : 'Partial match'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Users size={11} />
            <span>{project.interest_count || 0} interested</span>
          </div>
          {filled ? (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-700/50 text-slate-400 text-xs font-medium border border-slate-600/40">
              <CheckCircle2 size={11} /> Team Filled
            </span>
          ) : (
            <InterestButton
              projectId={project.id}
              initialCount={project.interest_count}
              onSuccess={onInterestSuccess}
              onNeedAuth={onNeedAuth}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── ProjectFeed ──────────────────────────────────────────
export default function ProjectFeed({ onNeedAuth, hideHeader = false }) {
  const [projects,      setProjects]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [domainFilter,  setDomainFilter]  = useState('All');
  const [matchOnly,     setMatchOnly]     = useState(false);
  const [notification,  setNotification]  = useState(null);

  // ── Load data ───────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error || !data?.length) throw error;
      setProjects(data);
    } catch {
      // Use mock data if Supabase not configured
      setProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  // ── Realtime subscription ────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('projects-realtime')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProjects(p => [payload.new, ...p]);
          } else if (payload.eventType === 'UPDATE') {
            setProjects(p => p.map(pr => pr.id === payload.new.id ? payload.new : pr));
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // ── Filter logic ─────────────────────────────────────────
  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (domainFilter !== 'All' && p.domain !== domainFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch  = p.description?.toLowerCase().includes(q);
        const skillMatch = p.skills_list?.some(s => s.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !skillMatch) return false;
      }
      if (matchOnly) {
        const score = calcCompatScore(p, USER_PROFILE.skills);
        if (score < 60) return false;
      }
      return true;
    });
  }, [projects, domainFilter, search, matchOnly]);

  const showNotification = useCallback((msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const DOMAINS = ['All', 'Startup', 'Hackathon', 'Research'];

  return (
    <section id="projects" className="py-10 section-glass">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

      {/* Section Header — hidden when used inside DiscoverPage */}
      {!hideHeader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles size={11} /> Discovery Engine
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Find Your Next <span className="gradient-text">Collaboration</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Browse active projects. Skills highlighted in
            <span className="text-sky-400 font-semibold"> blue </span>
            match your profile. The
            <span className="text-sky-400 font-semibold"> Smart Match </span>
            badge shows your best-fit projects.
          </p>

          {/* User Profile Pill */}
          <div className="inline-flex flex-wrap items-center gap-2 mt-4 px-4 py-2 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-xs text-white font-bold">Y</div>
            <span className="text-xs text-slate-400">Your skills:</span>
            {USER_PROFILE.skills.map(s => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-[11px] border border-sky-500/25">{s}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filter Bar */}
      <div className="space-y-3 mb-8">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, skill, keyword…"
            className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700 focus:border-sky-500 text-white placeholder-slate-500 rounded-xl text-sm outline-none transition-colors"
          />
        </div>

        {/* Domain Filters + Smart Match — scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {DOMAINS.map(d => (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                domainFilter === d
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                  : 'text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              {d === 'Startup' ? '🚀 ' : d === 'Hackathon' ? '⚡ ' : d === 'Research' ? '🔬 ' : ''}
              {d}
            </button>
          ))}

          {/* Smart Match toggle */}
          <button
            onClick={() => setMatchOnly(v => !v)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border whitespace-nowrap ${
              matchOnly
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 glow-sky'
                : 'text-slate-400 border-slate-700 hover:border-sky-500/40 hover:text-sky-400'
            }`}
          >
            <Zap size={14} className={matchOnly ? 'pulse-glow' : ''} />
            Smart Match
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">
          Showing <span className="text-slate-300 font-semibold">{filtered.length}</span> project{filtered.length !== 1 ? 's' : ''}
          {matchOnly && <span className="text-sky-400 ml-1">· filtered for your skills</span>}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
          Live · Realtime
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-2xl p-5 space-y-3"
            >
              <div className="skeleton h-4 w-20 rounded-full" />
              <div className="skeleton h-6 w-3/4 rounded-lg" />
              <div className="skeleton h-3.5 w-full rounded" />
              <div className="skeleton h-3.5 w-5/6 rounded" />
              <div className="skeleton h-3.5 w-4/6 rounded" />
              <div className="flex gap-2 mt-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="skeleton h-6 w-16 rounded-lg" />
                ))}
              </div>
              <div className="skeleton h-px w-full rounded mt-2" />
              <div className="flex justify-between items-center">
                <div className="skeleton w-12 h-12 rounded-full" />
                <div className="skeleton h-8 w-28 rounded-xl" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Grid */}
      {!loading && (
        <AnimatePresence mode="sync">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  userSkills={USER_PROFILE.skills}
                  index={i}
                  onInterestSuccess={() => showNotification(`🎉 Interest sent for "${project.title}"!`)}
                  onNeedAuth={onNeedAuth}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <AlertCircle size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No projects found</p>
              <p className="text-slate-600 text-sm mt-1">Try adjusting your filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Live Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 40, x: '-50%' }}
            animate={{ opacity: 1, y: 0,  x: '-50%' }}
            exit={{   opacity: 0, y: 20,  x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-2xl bg-slate-800 border border-sky-500/40 text-white text-sm font-medium shadow-2xl glow-sky whitespace-nowrap"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </section>
  );
}
