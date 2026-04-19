// ============================================================
//  src/components/ProjectFeed.jsx (White Canvas Edition)
// ============================================================
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Users, Send, CheckCircle2, AlertCircle, Sparkles, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { MOCK_PROJECTS, USER_PROFILE } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';
import { variants, viewportConfig } from '../lib/motion';

function calcCompatScore(project, userSkills) {
  if (!project.skills_list?.length) return 40;
  const matches = project.skills_list.filter(s =>
    userSkills.some(u => u.toLowerCase() === s.toLowerCase())
  ).length;
  const raw = Math.round((matches / project.skills_list.length) * 100);
  return Math.min(100, raw + 20);
}

export function saveInterest(projectId, applicant) {
  try {
    const key  = `colab_interests_${projectId}`;
    const prev = JSON.parse(localStorage.getItem(key) || '[]');
    if (prev.some(a => a.email === applicant.email)) return;
    prev.unshift({ ...applicant, timestamp: Date.now() });
    localStorage.setItem(key, JSON.stringify(prev));
  } catch (_) {}
}

function InterestButton({ projectId, initialCount, onSuccess, onNeedAuth }) {
  const { user } = useAuth();
  const [count, setCount] = useState(initialCount || 0);
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (clicked) return;
    if (!user) { onNeedAuth?.(); return; }
    setLoading(true);
    const applicant = {
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student',
      email: user.email || '',
      skills: user.skills || user.user_metadata?.skills || USER_PROFILE.skills,
      role: user.user_metadata?.role || user.role || '',
    };
    try {
      await supabase.from('applications').insert([{
        project_id: projectId,
        applicant_name: applicant.name,
        applicant_skills: applicant.skills,
        message: 'Interested in collaborating!',
      }]);
      await supabase.from('projects').update({ interest_count: count + 1 }).eq('id', projectId);
    } catch (_) {}
    saveInterest(projectId, applicant);
    setCount(c => c + 1);
    setClicked(true);
    setLoading(false);
    onSuccess?.();
  };

  if (!user) return (
    <button
      onClick={() => onNeedAuth?.()}
      className="brutal-hover"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        border: '2px solid var(--ink)',
        color: 'var(--ink)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: '0.6875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        cursor: 'pointer'
      }}
    >
      <LogIn size={14} /> Log in to Join
    </button>
  );

  return (
    <button
      onClick={handleClick}
      disabled={loading || clicked}
      className={!clicked ? "brutal-hover" : ""}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: clicked ? 'var(--canvas)' : 'var(--section-accent)',
        border: clicked ? '2px solid var(--ink)' : '2px solid var(--section-accent)',
        color: clicked ? 'var(--ink)' : 'var(--canvas)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: '0.6875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        cursor: clicked ? 'default' : 'pointer'
      }}
    >
      {loading ? (
        <span>Loading...</span>
      ) : clicked ? (
        <><CheckCircle2 size={14} /> Interested</>
      ) : (
        <><Send size={14} /> Express Interest</>
      )}
    </button>
  );
}

function ProjectCard({ project, userSkills, index, onInterestSuccess, onNeedAuth }) {
  const score = useMemo(() => calcCompatScore(project, userSkills), [project, userSkills]);
  const isMatch = score >= 60;
  const filled = project.status === 'filled';

  return (
    <motion.div
      variants={variants.fadeUp}
      className={`flex flex-col relative ${!filled ? 'brutal-hover' : ''}`}
      style={{
        backgroundColor: 'var(--canvas)',
        border: '1.5px solid var(--rule-strong)',
        padding: '1.75rem',
        borderTop: isMatch && !filled ? '6px solid var(--section-accent)' : '4px solid var(--ink)',
        opacity: filled ? 0.6 : 1,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
      }}
    >
      {isMatch && !filled && (
        <div style={{
          position: 'absolute',
          top: '-14px',
          right: '1rem',
          backgroundColor: 'var(--canvas)',
          border: '1.5px solid var(--ink)',
          padding: '0.25rem 0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--section-accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          boxShadow: '3px 3px 0 var(--ink)'
        }}>
          <Zap size={10} /> Smart Match
        </div>
      )}

      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.25em',
        color: isMatch ? 'var(--section-accent)' : 'var(--ink-muted)',
        marginBottom: '0.75rem'
      }}>
        {project.domain}
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.25rem',
        color: 'var(--ink)',
        lineHeight: 1.15,
        letterSpacing: '-0.01em',
        marginBottom: '0.5rem'
      }}>
        {project.title}
      </h3>
      
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)', marginBottom: '1rem' }}>
        by {project.owner_name}
      </p>

      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8125rem',
        color: 'var(--ink)',
        lineHeight: 1.85,
        marginBottom: '1.5rem',
        flexGrow: 1
      }}>
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.skills_list?.map(skill => {
          const matched = userSkills.some(u => u.toLowerCase() === skill.toLowerCase());
          return (
            <span
              key={skill}
              style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: matched ? 'var(--ink)' : 'transparent',
                border: matched ? '1px solid var(--ink)' : '1px solid var(--rule)',
                color: matched ? 'var(--canvas)' : 'var(--ink-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              {skill}
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4" style={{ borderTop: '2px solid var(--ink)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={14} color="var(--ink)" /> {project.interest_count || 0} interested
        </div>
        
        {filled ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 700 }}>
            Team Filled
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
    </motion.div>
  );
}

export default function ProjectFeed({ onNeedAuth, hideHeader = false }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [matchOnly, setMatchOnly] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error || !data?.length) throw error;
      setProjects(data);
    } catch {
      setProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (domainFilter !== 'All' && p.domain !== domainFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
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
    <section id="projects" style={{ padding: 'var(--section-padding-y) 0', backgroundColor: 'var(--canvas)', '--section-accent': 'var(--accent-blue)' }}>
      <div className="max-w-[1340px] mx-auto px-5 sm:px-8">

        {!hideHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            className="mb-16"
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--section-accent)', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--ink-faint)', marginRight: '0.5rem' }}>02</span>
              Discovery Engine
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(3rem, 6vw, 7rem)', color: 'var(--ink)', lineHeight: 0.92, letterSpacing: '-0.03em', margin: 0 }}>
              Find Your Next <br/><span className="accent-highlight">Collaboration</span>
            </h2>
            <div style={{ borderBottom: '1px solid var(--rule)', margin: '2.5rem 0' }} />
          </motion.div>
        )}

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          {/* Search */}
          <div className="relative flex-grow">
            <Search size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, skill, keyword…"
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                backgroundColor: 'var(--canvas)',
                border: '2px solid var(--ink)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--section-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--ink)'}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {DOMAINS.map(d => (
              <button
                key={d}
                onClick={() => setDomainFilter(d)}
                className="brutal-hover"
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: domainFilter === d ? 'var(--ink)' : 'var(--canvas)',
                  border: '2px solid var(--ink)',
                  color: domainFilter === d ? 'var(--canvas)' : 'var(--ink)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  whiteSpace: 'nowrap'
                }}
              >
                {d}
              </button>
            ))}

            <button
              onClick={() => setMatchOnly(v => !v)}
              className="brutal-hover"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 1.5rem',
                backgroundColor: matchOnly ? 'var(--section-accent)' : 'var(--canvas)',
                border: matchOnly ? '2px solid var(--section-accent)' : '2px solid var(--ink)',
                color: matchOnly ? 'var(--canvas)' : 'var(--ink)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                whiteSpace: 'nowrap'
              }}
            >
              <Zap size={14} /> Smart Match
            </button>
          </div>
        </div>

        <div className="mb-6" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          {matchOnly && <span style={{ color: 'var(--section-accent)', marginLeft: '0.5rem' }}>· filtered for your skills</span>}
        </div>

        {!loading && (
          <AnimatePresence mode="sync">
            {filtered.length > 0 ? (
              <motion.div
                variants={variants.staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={viewportConfig}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    userSkills={USER_PROFILE.skills}
                    index={i}
                    onInterestSuccess={() => showNotification(`Interest sent for "${project.title}"!`)}
                    onNeedAuth={onNeedAuth}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <AlertCircle size={40} color="var(--ink)" className="mx-auto mb-4" />
                <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  No projects found
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Try adjusting your filters.
                </p>
              </div>
            )}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.35 }}
              className="brutal-toast"
            >
              {notification}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3.5, ease: 'linear' }}
                className="toast-progress"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
