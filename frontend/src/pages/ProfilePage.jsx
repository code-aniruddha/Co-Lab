// ============================================================
//  src/pages/ProfilePage.jsx (White Canvas Edition)
// ============================================================
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Briefcase, Edit3, Check, X, Plus, Trash2, ToggleLeft, ToggleRight, Code2, GraduationCap, BookOpen, Sparkles, AlertTriangle, FolderOpen, ChevronRight, LogOut, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_PROJECTS, DOMAIN_COLORS } from '../lib/mockData';

const LS_PROFILE = 'colab_profile';
const LS_PROJECTS = 'colab_projects';

function loadProfile(userId) { try { return JSON.parse(localStorage.getItem(`${LS_PROFILE}_${userId}`) || '{}'); } catch { return {}; } }
function saveProfile(userId, data) { localStorage.setItem(`${LS_PROFILE}_${userId}`, JSON.stringify(data)); }
function loadProjects(userId) { try { const stored = localStorage.getItem(`${LS_PROJECTS}_${userId}`); if (stored) return JSON.parse(stored); return MOCK_PROJECTS.filter(p => p.owner_id === userId); } catch { return []; } }
function saveProjects(userId, projects) { localStorage.setItem(`${LS_PROJECTS}_${userId}`, JSON.stringify(projects)); }
function loadInterests(projectId) { try { return JSON.parse(localStorage.getItem(`colab_interests_${projectId}`) || '[]'); } catch { return []; } }

function SkillTag({ label, onRemove }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--ink)', color: 'var(--canvas)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
      {label}
      {onRemove && <button onClick={() => onRemove(label)} style={{ background: 'none', border: 'none', color: 'var(--canvas)', cursor: 'pointer' }}><X size={12} /></button>}
    </span>
  );
}

function ProjectCard({ project, onToggleStatus, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const applicants = loadInterests(project.id);

  return (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="brutal-hover flex flex-col" style={{ backgroundColor: 'var(--canvas)', border: '1.5px solid var(--ink)', padding: '1.5rem', borderLeft: '6px solid var(--ink)' }}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span style={{ padding: '0.15rem 0.4rem', border: '1px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', textTransform: 'uppercase', color: 'var(--ink)', display: 'inline-block', marginBottom: '0.5rem' }}>{project.domain}</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--ink)', lineHeight: 1.1 }}>{project.title}</h3>
        </div>
        <span style={{ padding: '0.25rem 0.5rem', backgroundColor: project.status === 'open' ? 'var(--section-accent)' : 'var(--ink-disabled)', color: project.status === 'open' ? 'var(--canvas)' : 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', fontWeight: 700, textTransform: 'uppercase' }}>
          {project.status}
        </span>
      </div>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)', marginBottom: '1rem', flexGrow: 1 }}>{project.description}</p>

      {project.skills_list?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills_list.slice(0, 4).map(s => <span key={s} style={{ padding: '0.15rem 0.4rem', border: '1px solid var(--rule)', fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', textTransform: 'uppercase' }}>{s}</span>)}
          {project.skills_list.length > 4 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--ink-muted)' }}>+{project.skills_list.length - 4}</span>}
        </div>
      )}

      <button onClick={() => setShowApplicants(v => !v)} className="brutal-hover" disabled={applicants.length === 0} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: applicants.length > 0 ? 'var(--canvas-warm)' : 'transparent', border: applicants.length > 0 ? '2px solid var(--ink)' : '2px dashed var(--rule)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 700, cursor: applicants.length > 0 ? 'pointer' : 'default', marginBottom: '1rem' }}>
        <span className="flex items-center gap-2"><Users size={14} /> {applicants.length === 0 ? 'No interest yet' : `${applicants.length} Interested`}</span>
        {applicants.length > 0 && <ChevronRight size={14} style={{ transform: showApplicants ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />}
      </button>

      <AnimatePresence>
        {showApplicants && applicants.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
            <div className="space-y-2">
              {applicants.map((a, i) => (
                <div key={i} style={{ padding: '1rem', border: '1.5px solid var(--ink)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--ink)', color: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>
                    {(a.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--ink)' }}>{a.name}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>{a.role || 'Member'}</p>
                  </div>
                  {a.email && <a href={`mailto:${a.email}`} style={{ marginLeft: 'auto', color: 'var(--ink)' }}><Mail size={16} /></a>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: '2px solid var(--ink)' }}>
        <button onClick={() => onToggleStatus(project.id)} className="brutal-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '2px solid var(--ink)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>
          {project.status === 'open' ? <><ToggleLeft size={14} /> Close</> : <><ToggleRight size={14} /> Reopen</>}
        </button>

        <div>
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <button onClick={() => onDelete(project.id)} className="brutal-hover" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--accent-red)', border: '2px solid var(--ink)', color: 'var(--canvas)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="brutal-hover" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--canvas)', border: '2px solid var(--ink)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>No</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="brutal-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--canvas)', border: '2px solid var(--accent-red)', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProfilePage({ onOpenAuth, onPostProject }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const base = {
    full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student',
    email: user?.email || '',
    college: user?.user_metadata?.college || user?.college || '',
    role: user?.user_metadata?.role || user?.role || '',
    bio: user?.user_metadata?.bio || '',
    skills: user?.skills || user?.user_metadata?.skills || [],
  };
  const saved = user ? loadProfile(user.id) : {};
  const merged = { ...base, ...saved };

  const [profile, setProfile] = useState(merged);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(merged);
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState('');
  const [projects, setProjects] = useState(() => user ? loadProjects(user.id) : []);
  const [activeTab, setActiveTab] = useState('profile');

  const initials = (profile.full_name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const startEdit = () => { setDraft({ ...profile }); setEditMode(true); };
  const cancelEdit = () => { setEditMode(false); setSkillError(''); };
  const saveEdit = () => { setProfile(draft); if (user) saveProfile(user.id, draft); setEditMode(false); setSkillError(''); };

  const addSkillDraft = useCallback((e) => {
    e.preventDefault(); const s = newSkill.trim(); if (!s) return;
    if (draft.skills.includes(s)) { setSkillError('Already in list'); return; }
    if (s.length > 30) { setSkillError('Too long'); return; }
    setDraft(d => ({ ...d, skills: [...d.skills, s] })); setNewSkill(''); setSkillError('');
  }, [newSkill, draft.skills]);

  const removeSkillDraft = (skill) => setDraft(d => ({ ...d, skills: d.skills.filter(s => s !== skill) }));

  const toggleStatus = useCallback((id) => {
    const updated = projects.map(p => p.id === id ? { ...p, status: p.status === 'open' ? 'closed' : 'open' } : p);
    setProjects(updated); if (user) saveProjects(user.id, updated);
  }, [projects, user]);

  const deleteProject = useCallback((id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated); if (user) saveProjects(user.id, updated);
  }, [projects, user]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-5" style={{ backgroundColor: 'var(--canvas)', '--section-accent': 'var(--accent-green)' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '3rem', border: '3px solid var(--ink)', backgroundColor: 'var(--canvas)', textAlign: 'center', boxShadow: '12px 12px 0 var(--ink)' }}>
          <User size={48} color="var(--ink)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '1rem' }}>Sign In Required</h2>
          <button onClick={onOpenAuth} className="brutal-hover" style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--section-accent)', color: 'var(--canvas)', border: '2px solid var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)', padding: 'var(--section-padding-y) 0', '--section-accent': 'var(--accent-green)' }}>
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">

        {/* Profile Header */}
        <div style={{ padding: '3rem', border: '3px solid var(--ink)', backgroundColor: 'var(--canvas)', marginBottom: '2rem', boxShadow: '12px 12px 0 var(--ink)' }}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div style={{ width: '120px', height: '120px', backgroundColor: 'var(--ink)', color: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '3rem', flexShrink: 0 }}>
              {initials}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ink)', textTransform: 'uppercase', lineHeight: 1, marginBottom: '0.5rem' }}>{profile.full_name}</h1>
              {profile.role && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--section-accent)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1rem' }}>{profile.role}</p>}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                {profile.email && <span className="flex items-center gap-2"><Mail size={14} /> {profile.email}</span>}
                {profile.college && <span className="flex items-center gap-2"><GraduationCap size={14} /> {profile.college}</span>}
              </div>
            </div>
            {!editMode && (
              <button onClick={startEdit} className="brutal-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '2px solid var(--ink)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer' }}>
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <AnimatePresence>
          {editMode && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: '2rem' }}>
              <div style={{ padding: '2rem', border: '3px solid var(--section-accent)', backgroundColor: 'var(--canvas-warm)' }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--ink)', textTransform: 'uppercase' }}>Edit Profile</h2>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="brutal-hover" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--section-accent)', border: '2px solid var(--ink)', color: 'var(--canvas)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer' }}><Check size={16} /> Save</button>
                    <button onClick={cancelEdit} className="brutal-hover" style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '2px solid var(--ink)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer' }}><X size={16} /> Cancel</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="floating-group">
                    <div className="relative">
                      <input value={draft.full_name} onChange={e => setDraft(d => ({ ...d, full_name: e.target.value }))} placeholder=" " className="floating-input" />
                      <label className="floating-label">Full Name</label>
                      <div className="floating-border-anim" />
                    </div>
                  </div>
                  <div className="floating-group">
                    <div className="relative">
                      <input value={draft.role} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))} placeholder=" " className="floating-input" />
                      <label className="floating-label">Role / Title</label>
                      <div className="floating-border-anim" />
                    </div>
                  </div>
                  <div className="floating-group">
                    <div className="relative">
                      <input value={draft.college} onChange={e => setDraft(d => ({ ...d, college: e.target.value }))} placeholder=" " className="floating-input" />
                      <label className="floating-label">College</label>
                      <div className="floating-border-anim" />
                    </div>
                  </div>
                  <div className="floating-group">
                    <div className="relative">
                      <input value={draft.email} readOnly placeholder=" " className="floating-input" style={{ borderStyle: 'dashed', color: 'var(--ink-muted)' }} />
                      <label className="floating-label">Email (Read-only)</label>
                    </div>
                  </div>
                  <div className="md:col-span-2 floating-group" style={{ paddingTop: '2rem' }}>
                    <div className="relative">
                      <textarea value={draft.bio} onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))} rows={3} placeholder=" " className="floating-input" style={{ resize: 'none' }} />
                      <label className="floating-label" style={{ top: '1rem' }}>Bio</label>
                      <div className="floating-border-anim" />
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: '2rem', borderTop: '2px solid var(--ink)' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)', display: 'block', mb: '1rem' }}>Skills</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {draft.skills.map(s => <SkillTag key={s} label={s} onRemove={removeSkillDraft} />)}
                  </div>
                  <form onSubmit={addSkillDraft} className="floating-group max-w-sm">
                    <div className="relative flex gap-2">
                      <input value={newSkill} onChange={e => { setNewSkill(e.target.value); setSkillError(''); }} placeholder=" " className="floating-input" style={{ flex: 1 }} />
                      <label className="floating-label">Add skill...</label>
                      <div className="floating-border-anim" style={{ width: 'calc(100% - 4rem)' }} />
                      <button type="submit" className="brutal-hover" style={{ padding: '0 1rem', backgroundColor: 'var(--ink)', color: 'var(--canvas)', border: '2px solid var(--ink)', cursor: 'pointer' }}><Plus size={20} /></button>
                    </div>
                  </form>
                  {skillError && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--accent-red)', marginTop: '0.5rem', fontWeight: 700 }}>{skillError}</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b-4" style={{ borderColor: 'var(--ink)' }}>
          {[{ id: 'profile', label: 'Profile' }, { id: 'projects', label: 'My Projects' }].map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{ padding: '1rem 2rem', backgroundColor: activeTab === id ? 'var(--ink)' : 'transparent', color: activeTab === id ? 'var(--canvas)' : 'var(--ink)', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', textTransform: 'uppercase', cursor: 'pointer', outline: 'none' }}>
              {label} {id === 'projects' && `(${projects.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {profile.bio && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink)', marginBottom: '1rem' }}>Bio</h3>
                <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--ink)', lineHeight: 1.6, paddingLeft: '1.5rem', borderLeft: '4px solid var(--section-accent)' }}>
                  "{profile.bio}"
                </p>
              </div>
            )}
            <div>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink)', marginBottom: '1rem' }}>Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.length > 0 ? profile.skills.map(s => <SkillTag key={s} label={s} />) : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>No skills added.</span>}
              </div>
            </div>
            <div style={{ paddingTop: '3rem', borderTop: '2px solid var(--ink)' }}>
              <button onClick={() => { signOut(); navigate('/'); }} className="brutal-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', backgroundColor: 'transparent', border: '2px solid var(--accent-red)', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', cursor: 'pointer' }}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-end mb-6">
              <button onClick={onPostProject} className="brutal-hover" style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--section-accent)', color: 'var(--canvas)', border: '2px solid var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer' }}>
                + Post New Project
              </button>
            </div>
            {projects.length === 0 ? (
              <div style={{ padding: '4rem', border: '2px dashed var(--ink)', textAlign: 'center' }}>
                <FolderOpen size={48} color="var(--ink-muted)" style={{ margin: '0 auto 1rem' }} />
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>No Projects Yet</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--ink-muted)' }}>Post your first idea to find collaborators.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(p => <ProjectCard key={p.id} project={p} onToggleStatus={toggleStatus} onDelete={deleteProject} />)}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
