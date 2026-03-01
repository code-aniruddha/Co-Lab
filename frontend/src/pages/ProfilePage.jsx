// ============================================================
//  src/pages/ProfilePage.jsx  —  User profile + project manager
// ============================================================
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, MapPin, Briefcase, Edit3, Check, X, Plus,
  Trash2, ToggleLeft, ToggleRight, Code2, GraduationCap,
  BookOpen, Sparkles, AlertTriangle, FolderOpen, ChevronDown,
  LogOut, Users, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_PROJECTS, DOMAIN_COLORS } from '../lib/mockData';

// ─── localStorage helpers ─────────────────────────────────
const LS_PROFILE  = 'colab_profile';
const LS_PROJECTS = 'colab_projects';

function loadProfile(userId) {
  try { return JSON.parse(localStorage.getItem(`${LS_PROFILE}_${userId}`) || '{}'); }
  catch { return {}; }
}
function saveProfile(userId, data) {
  localStorage.setItem(`${LS_PROFILE}_${userId}`, JSON.stringify(data));
}
function loadProjects(userId) {
  try {
    const stored = localStorage.getItem(`${LS_PROJECTS}_${userId}`);
    if (stored) return JSON.parse(stored);
    return MOCK_PROJECTS.filter(p => p.owner_id === userId);
  } catch { return []; }
}
function saveProjects(userId, projects) {
  localStorage.setItem(`${LS_PROJECTS}_${userId}`, JSON.stringify(projects));
}

// ─── Interest helpers (mirrors ProjectFeed) ───────────────
function loadInterests(projectId) {
  try { return JSON.parse(localStorage.getItem(`colab_interests_${projectId}`) || '[]'); }
  catch { return []; }
}

// ─── Skill Tag ────────────────────────────────────────────
function SkillTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/25 text-sky-300 text-xs font-semibold">
      {label}
      {onRemove && (
        <button
          onClick={() => onRemove(label)}
          className="text-sky-500 hover:text-red-400 transition-colors ml-0.5"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
}

// ─── Project Management Card ──────────────────────────────
function ProjectCard({ project, onToggleStatus, onDelete }) {
  const domain = DOMAIN_COLORS[project.domain] || DOMAIN_COLORS.Startup;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const applicants = loadInterests(project.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide mb-1.5"
            style={{ background: domain.bg, color: domain.text, border: `1px solid ${domain.border}40` }}
          >
            {project.domain}
          </span>
          <h3 className="text-sm font-bold text-white leading-tight truncate">{project.title}</h3>
        </div>

        {/* Status badge */}
        <span
          className={`shrink-0 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
            project.status === 'open'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-slate-700/40 border-slate-600/40 text-slate-500'
          }`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{project.description}</p>

      {/* Skills */}
      {project.skills_list?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.skills_list.slice(0, 4).map(s => (
            <span key={s} className="px-2 py-0.5 rounded-md bg-slate-800/70 text-slate-400 text-[10px] border border-slate-700/40">
              {s}
            </span>
          ))}
          {project.skills_list.length > 4 && (
            <span className="text-slate-600 text-[10px] px-1">+{project.skills_list.length - 4}</span>
          )}
        </div>
      )}

      {/* Interested applicants ────────────────────────── */}
      <button
        onClick={() => setShowApplicants(v => !v)}
        className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
          applicants.length > 0
            ? 'bg-sky-500/8 border-sky-500/25 text-sky-300 hover:bg-sky-500/14'
            : 'bg-slate-800/40 border-slate-700/40 text-slate-600 cursor-default'
        }`}
        disabled={applicants.length === 0}
      >
        <span className="flex items-center gap-1.5">
          <Users size={11} />
          {applicants.length === 0
            ? 'No interest yet'
            : `${applicants.length} interested applicant${applicants.length !== 1 ? 's' : ''}`
          }
        </span>
        {applicants.length > 0 && (
          <ChevronRight
            size={12}
            className={`transition-transform ${showApplicants ? 'rotate-90' : ''}`}
          />
        )}
      </button>

      <AnimatePresence>
        {showApplicants && applicants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-1">
              {applicants.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900/50 border border-slate-800/60"
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {(a.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{a.name}</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {Array.isArray(a.skills) && a.skills.slice(0, 3).map(s => (
                        <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">{s}</span>
                      ))}
                      {a.role && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{a.role}</span>
                      )}
                    </div>
                  </div>
                  {a.email && (
                    <a
                      href={`mailto:${a.email}`}
                      className="text-[9px] text-slate-600 hover:text-sky-400 transition-colors shrink-0"
                      title={a.email}
                    >
                      <Mail size={11} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onToggleStatus(project.id)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            project.status === 'open'
              ? 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:border-amber-500/40 hover:text-amber-400'
              : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:border-emerald-400/40'
          }`}
        >
          {project.status === 'open' ? <ToggleLeft size={13} /> : <ToggleRight size={13} />}
          {project.status === 'open' ? 'Close Project' : 'Reopen Project'}
        </motion.button>

        <div className="ml-auto">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-red-400 font-medium">Confirm?</span>
              <button
                onClick={() => onDelete(project.id)}
                className="text-xs px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all font-semibold"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-500/20 text-red-500/70 hover:border-red-500/40 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={11} /> Delete
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ProfilePage ─────────────────────────────────────
export default function ProfilePage({ onOpenAuth, onPostProject }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // ── Build initial profile from user + localStorage ──────
  const base = {
    full_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student',
    email:     user?.email || '',
    college:   user?.user_metadata?.college  || user?.college  || '',
    role:      user?.user_metadata?.role     || user?.role     || '',
    bio:       user?.user_metadata?.bio      || '',
    skills:    user?.skills || user?.user_metadata?.skills || [],
  };
  const saved = user ? loadProfile(user.id) : {};
  const merged = { ...base, ...saved };

  const [profile,  setProfile]  = useState(merged);
  const [editMode, setEditMode] = useState(false);
  const [draft,    setDraft]    = useState(merged);
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState('');
  const [projects, setProjects] = useState(() => user ? loadProjects(user.id) : []);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'projects'

  const initials = (profile.full_name || 'U')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  // ── Edit handlers ────────────────────────────────────────
  const startEdit  = () => { setDraft({ ...profile }); setEditMode(true); };
  const cancelEdit = () => { setEditMode(false); setSkillError(''); };
  const saveEdit   = () => {
    const updated = { ...draft };
    setProfile(updated);
    if (user) saveProfile(user.id, updated);
    setEditMode(false);
    setSkillError('');
  };

  // ── Skills (draft mode) ──────────────────────────────────
  const addSkillDraft = useCallback((e) => {
    e.preventDefault();
    const s = newSkill.trim();
    if (!s) return;
    if (draft.skills.includes(s)) { setSkillError('Already in list'); return; }
    if (s.length > 30) { setSkillError('Too long (max 30 chars)'); return; }
    setDraft(d => ({ ...d, skills: [...d.skills, s] }));
    setNewSkill('');
    setSkillError('');
  }, [newSkill, draft.skills]);

  const removeSkillDraft = (skill) =>
    setDraft(d => ({ ...d, skills: d.skills.filter(s => s !== skill) }));

  // ── Projects ─────────────────────────────────────────────
  const toggleStatus = useCallback((id) => {
    const updated = projects.map(p =>
      p.id === id ? { ...p, status: p.status === 'open' ? 'closed' : 'open' } : p
    );
    setProjects(updated);
    if (user) saveProjects(user.id, updated);
  }, [projects, user]);

  const deleteProject = useCallback((id) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    if (user) saveProjects(user.id, updated);
  }, [projects, user]);

  // ── Not logged in ────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-10 max-w-sm w-full text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto mb-5">
            <User size={28} className="text-sky-400" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Sign In Required</h2>
          <p className="text-slate-400 text-sm mb-6">
            Create an account or sign in to view and manage your profile.
          </p>
          <button
            onClick={onOpenAuth}
            className="btn-primary w-full justify-center py-3"
          >
            Sign In / Sign Up
          </button>
        </motion.div>
      </div>
    );
  }

  const TABS = [
    { id: 'profile',  label: 'Profile',       icon: User        },
    { id: 'projects', label: 'My Projects',   icon: FolderOpen  },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10">

        {/* ── Profile Hero Card ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-7 mb-6 relative overflow-hidden"
          style={{ border: '1px solid rgba(56,189,248,0.18)' }}
        >
          {/* Gradient blob */}
          <div className="absolute top-0 right-0 w-64 h-40 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative">
            {/* Avatar */}
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-sky-500/20 shrink-0"
                 style={{ width: '72px', height: '72px' }}>
              {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold text-white truncate">{profile.full_name}</h1>
              {profile.role && (
                <p className="text-sky-400 text-sm font-medium mt-0.5">{profile.role}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {profile.email && (
                  <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Mail size={11} /> {profile.email}
                  </span>
                )}
                {profile.college && (
                  <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <GraduationCap size={11} /> {profile.college}
                  </span>
                )}
              </div>
              {profile.bio && (
                <p className="text-slate-400 text-sm mt-2 line-clamp-2">{profile.bio}</p>
              )}
            </div>

            {/* Edit btn */}
            {!editMode && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sky-500/25 bg-sky-500/8 text-sky-400 text-xs font-semibold hover:border-sky-400/40 hover:bg-sky-500/15 transition-all shrink-0"
              >
                <Edit3 size={13} /> Edit Profile
              </motion.button>
            )}
          </div>

          {/* Skills (read mode) */}
          {!editMode && profile.skills?.length > 0 && (
            <div className="mt-5 pt-5 border-t border-slate-800/60">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-3">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(s => (
                  <SkillTag key={s} label={s} />
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Edit Form ─────────────────────────────────── */}
        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass-card rounded-3xl p-7" style={{ border: '1px solid rgba(56,189,248,0.2)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-lg">Edit Profile</h2>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={saveEdit}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold hover:bg-sky-500/25 transition-all"
                    >
                      <Check size={13} /> Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={cancelEdit}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 text-xs font-bold hover:text-white transition-all"
                    >
                      <X size={13} /> Cancel
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                      <User size={11} /> Full Name
                    </label>
                    <input
                      type="text"
                      value={draft.full_name}
                      onChange={e => setDraft(d => ({ ...d, full_name: e.target.value }))}
                      className="w-full bg-slate-900/70 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25 transition-all"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Role */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                      <Briefcase size={11} /> Role / Title
                    </label>
                    <input
                      type="text"
                      value={draft.role}
                      onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}
                      className="w-full bg-slate-900/70 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25 transition-all"
                      placeholder="e.g. Full-Stack Developer"
                    />
                  </div>

                  {/* College */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                      <GraduationCap size={11} /> College / University
                    </label>
                    <input
                      type="text"
                      value={draft.college}
                      onChange={e => setDraft(d => ({ ...d, college: e.target.value }))}
                      className="w-full bg-slate-900/70 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25 transition-all"
                      placeholder="e.g. IIT Bombay"
                    />
                  </div>

                  {/* Email (readonly) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                      <Mail size={11} /> Email <span className="text-slate-700 font-normal normal-case tracking-normal ml-1">(read-only)</span>
                    </label>
                    <input
                      type="email"
                      value={draft.email}
                      readOnly
                      className="w-full bg-slate-900/40 border border-slate-800/60 rounded-xl px-4 py-2.5 text-slate-600 text-sm cursor-not-allowed"
                    />
                  </div>

                  {/* Bio — full width */}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
                      <BookOpen size={11} /> Bio
                    </label>
                    <textarea
                      value={draft.bio}
                      onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                      rows={3}
                      className="w-full bg-slate-900/70 border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25 transition-all resize-none"
                      placeholder="Tell others about yourself…"
                    />
                  </div>
                </div>

                {/* Skills editor */}
                <div className="mt-6 pt-5 border-t border-slate-800/60">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Code2 size={11} /> Skills
                  </p>

                  {/* Current tags */}
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]">
                    <AnimatePresence>
                      {draft.skills.map(s => (
                        <motion.div
                          key={s}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                        >
                          <SkillTag label={s} onRemove={removeSkillDraft} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {draft.skills.length === 0 && (
                      <span className="text-slate-600 text-xs italic">No skills added yet</span>
                    )}
                  </div>

                  {/* Add skill input */}
                  <form onSubmit={addSkillDraft} className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={e => { setNewSkill(e.target.value); setSkillError(''); }}
                      className="flex-1 bg-slate-900/70 border border-slate-700/60 rounded-xl px-4 py-2 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/25 transition-all"
                      placeholder="e.g. React, Python…"
                      maxLength={30}
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-sm font-semibold hover:bg-sky-500/25 transition-all shrink-0"
                    >
                      <Plus size={13} /> Add
                    </motion.button>
                  </form>
                  {skillError && (
                    <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertTriangle size={11} /> {skillError}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tabs ──────────────────────────────────────── */}
        <div className="flex gap-1 p-1 glass-card rounded-2xl mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === id
                  ? 'bg-sky-500/15 border border-sky-500/30 text-sky-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={14} /> {label}
              {id === 'projects' && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === id
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {projects.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Profile Tab ───────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Info Grid */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-white font-bold mb-5 flex items-center gap-2">
                  <Sparkles size={15} className="text-sky-400" /> About Me
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: User,           label: 'Name',     value: profile.full_name },
                    { icon: Briefcase,      label: 'Role',     value: profile.role      },
                    { icon: GraduationCap,  label: 'College',  value: profile.college   },
                    { icon: Mail,           label: 'Email',    value: profile.email     },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={13} className="text-sky-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-500 text-[10px] uppercase tracking-wide font-semibold">{label}</p>
                        <p className="text-white text-sm font-medium truncate">{value || <span className="text-slate-600 italic">Not set</span>}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {profile.bio && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wide font-semibold mb-1.5 flex items-center gap-1.5">
                      <BookOpen size={10} /> Bio
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </div>

              {/* Skills read-only (with quick remove) */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Code2 size={15} className="text-sky-400" /> Skills
                    <span className="text-xs text-slate-600 font-normal">({profile.skills?.length || 0})</span>
                  </h3>
                  <button
                    onClick={startEdit}
                    className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                  >
                    <Edit3 size={11} /> Edit
                  </button>
                </div>

                {profile.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(s => <SkillTag key={s} label={s} />)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Code2 size={28} className="text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-600 text-sm">No skills added yet.</p>
                    <button onClick={startEdit} className="text-sky-400 text-xs mt-1 hover:text-sky-300 transition-colors">
                      + Add skills
                    </button>
                  </div>
                )}
              </div>

              {/* Danger zone */}
              <div className="glass-card rounded-2xl p-6 border border-red-500/10">
                <h3 className="text-red-400/80 font-bold text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle size={14} /> Account
                </h3>
                <button
                  onClick={() => { signOut(); navigate('/'); }}
                  className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border border-red-500/25 text-red-400 bg-red-500/5 hover:bg-red-500/15 hover:border-red-400/40 transition-all font-medium"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Projects Tab ──────────────────────────────── */}
          {activeTab === 'projects' && (
            <motion.div
              key="projects-tab"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              {projects.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <FolderOpen size={36} className="text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 font-semibold mb-1">No projects yet</p>
                  <p className="text-slate-600 text-sm mb-5">Post your first project and it'll appear here.</p>
                  <button
                    onClick={onPostProject}
                    className="btn-primary px-6 py-2.5 text-sm"
                  >
                    + Post a Project
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-500 text-sm">
                      <span className="text-white font-semibold">{projects.filter(p => p.status === 'open').length}</span> open ·{' '}
                      <span className="text-slate-400 font-semibold">{projects.filter(p => p.status !== 'open').length}</span> closed
                    </p>
                    <button
                      onClick={onPostProject}
                      className="btn-primary px-4 py-2 text-xs"
                    >
                      + New Project
                    </button>
                  </div>

                  <AnimatePresence>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projects.map(project => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onToggleStatus={toggleStatus}
                          onDelete={deleteProject}
                        />
                      ))}
                    </div>
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
