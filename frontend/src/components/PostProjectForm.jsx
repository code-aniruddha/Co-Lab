// ============================================================
//  src/components/PostProjectForm.jsx
//  Multi-step modal for posting a new project idea
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Plus, Check, Rocket, Tag, FileText, Layers } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const DOMAINS    = ['Startup', 'Hackathon', 'Research'];
const ALL_SKILLS = [
  'React', 'Vue', 'Angular', 'Next.js', 'TypeScript',
  'Node.js', 'Express', 'Python', 'FastAPI', 'Django',
  'TensorFlow', 'PyTorch', 'LangChain', 'OpenAI',
  'Solidity', 'Ethereum', 'IPFS', 'Web3.js',
  'PostgreSQL', 'MongoDB', 'Redis', 'Supabase',
  'Docker', 'AWS', 'GCP', 'React Native', 'Flutter',
  'D3.js', 'Three.js', 'Socket.io', 'GraphQL',
];

const STEPS = [
  { label: 'Basics',     icon: FileText },
  { label: 'Domain',     icon: Layers   },
  { label: 'Skills',     icon: Tag      },
  { label: 'Review',     icon: Check    },
];

const EMPTY_FORM = {
  title: '', description: '', domain: '', skills_list: [],
  owner_name: '', owner_id: `user_${Date.now()}`,
};

export default function PostProjectForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  const [step,       setStep]       = useState(0);
  const [form,       setForm]       = useState({
    ...EMPTY_FORM,
    owner_name: displayName,
    owner_id:   user?.id || `user_${Date.now()}`,
  });
  const [skillInput, setSkillInput] = useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [submitted,  setSubmitted]  = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Skill tag management
  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !form.skills_list.includes(s)) {
      update('skills_list', [...form.skills_list, s]);
    }
    setSkillInput('');
  };
  const removeSkill = (s) => update('skills_list', form.skills_list.filter(x => x !== s));

  const canNext = () => {
    if (step === 0) return form.title.trim().length > 3 && form.owner_name.trim().length > 1;
    if (step === 1) return !!form.domain;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Try Supabase first
      const { error: sbErr } = await supabase
        .from('projects')
        .insert([{
          title:       form.title.trim(),
          description: form.description.trim(),
          domain:      form.domain,
          skills_list: form.skills_list,
          owner_id:    form.owner_id,
          owner_name:  form.owner_name.trim(),
        }]);

      if (sbErr) {
        // Fallback to Express API
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Server error');
      }

      setSubmitted(true);
      setTimeout(() => { onSuccess?.(); onClose(); }, 2200);
    } catch (e) {
      setError('Could not post project. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      style={{ zIndex: 60 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1,   opacity: 1, y: 0  }}
        exit={{   scale: 0.9, opacity: 0, y: 20  }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Rocket size={18} className="text-sky-400" />
            <h2 className="text-xl font-bold text-white">Post a Project</h2>
          </div>
          <p className="text-slate-400 text-sm">Share your idea and build your dream team.</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map(({ label, icon: Icon }, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                i === step
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/50'
                  : i < step
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'text-slate-600 border border-slate-700/60'
              }`}>
                {i < step ? <Check size={11} /> : <Icon size={11} />}
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-4 ${i < step ? 'bg-sky-500' : 'bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Success State */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center glow-sky mb-4">
                <Check size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Project Posted! 🎉</h3>
              <p className="text-slate-400 text-sm">Your idea is now live. Collaborators can discover and join it.</p>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0  }}
              exit={{   opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="space-y-5"
            >
              {/* STEP 0 — Basics */}
              {step === 0 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Your Name *</label>
                    <input
                      value={form.owner_name}
                      onChange={e => update('owner_name', e.target.value)}
                      placeholder="e.g. Aryan Mehta"
                      className="w-full bg-slate-800/60 border border-slate-700 focus:border-sky-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Project Title *</label>
                    <input
                      value={form.title}
                      onChange={e => update('title', e.target.value)}
                      placeholder="e.g. AI-Powered Study Buddy"
                      className="w-full bg-slate-800/60 border border-slate-700 focus:border-sky-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Brief Description</label>
                    <textarea
                      value={form.description}
                      onChange={e => update('description', e.target.value)}
                      placeholder="What problem does this solve? What will you build?"
                      rows={3}
                      className="w-full bg-slate-800/60 border border-slate-700 focus:border-sky-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none resize-none transition-colors"
                    />
                  </div>
                </>
              )}

              {/* STEP 1 — Domain */}
              {step === 1 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Select Domain *</label>
                  <div className="grid grid-cols-1 gap-3">
                    {DOMAINS.map(d => {
                      const colors = { Startup: 'sky', Hackathon: 'indigo', Research: 'purple' };
                      const c = colors[d];
                      const selected = form.domain === d;
                      return (
                        <motion.button
                          key={d}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => update('domain', d)}
                          className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                            selected
                              ? `border-${c}-500 bg-${c}-500/15`
                              : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                            selected ? `bg-${c}-500/25` : 'bg-slate-700/60'
                          }`}>
                            {d === 'Startup' ? '🚀' : d === 'Hackathon' ? '⚡' : '🔬'}
                          </div>
                          <div>
                            <p className={`font-semibold ${selected ? 'text-white' : 'text-slate-300'}`}>{d}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {d === 'Startup' && 'Solve real-world problems and build a product'}
                              {d === 'Hackathon' && 'Sprint, prototype, and win competitions'}
                              {d === 'Research' && 'Deep dive into problems and publish findings'}
                            </p>
                          </div>
                          {selected && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <Check size={16} className="text-sky-400" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2 — Skills */}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Required Skills</label>
                  <p className="text-xs text-slate-500 mb-3">Click to add from suggestions or type a custom skill.</p>

                  {/* Tag input */}
                  <div className="flex gap-2 mb-3">
                    <input
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)}
                      placeholder="Type a skill + Enter"
                      className="flex-1 bg-slate-800/60 border border-slate-700 focus:border-sky-500 text-white placeholder-slate-500 rounded-xl px-3 py-2 text-sm outline-none transition-colors"
                    />
                    <button
                      onClick={() => addSkill(skillInput)}
                      className="px-3 py-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 hover:bg-sky-500/30 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Selected tags */}
                  {form.skills_list.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                      {form.skills_list.map(s => (
                        <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-400 text-xs font-medium border border-sky-500/30">
                          {s}
                          <button onClick={() => removeSkill(s)} className="hover:text-red-400 transition-colors ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {ALL_SKILLS.filter(s => !form.skills_list.includes(s)).map(s => (
                      <button
                        key={s}
                        onClick={() => addSkill(s)}
                        className="px-2.5 py-1 rounded-lg border border-slate-700 text-slate-400 text-xs hover:border-sky-500/50 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3 — Review */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm mb-2">Review your project before publishing.</p>
                  <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-700/60 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Title</p>
                      <p className="text-white font-semibold">{form.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Posted By</p>
                      <p className="text-slate-300">{form.owner_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Domain</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        form.domain === 'Startup'   ? 'bg-sky-500/20 text-sky-400' :
                        form.domain === 'Hackathon' ? 'bg-indigo-500/20 text-indigo-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>{form.domain}</span>
                    </div>
                    {form.description && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Description</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{form.description}</p>
                      </div>
                    )}
                    {form.skills_list.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Skills Needed</p>
                        <div className="flex flex-wrap gap-1.5">
                          {form.skills_list.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-sky-500/15 text-sky-400 text-xs border border-sky-500/25">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p>}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {!submitted && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-700/50">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <motion.button
                whileHover={{ scale: canNext() ? 1.04 : 1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => canNext() && setStep(s => s + 1)}
                disabled={!canNext()}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                Next <ChevronRight size={16} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(56,189,248,0.4)' }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold text-sm disabled:opacity-60 glow-sky"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing...</>
                ) : (
                  <><Rocket size={15} /> Publish Project</>
                )}
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
