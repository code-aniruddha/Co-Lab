// ============================================================
//  src/components/PostProjectForm.jsx (White Canvas Edition)
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Plus, Check, Rocket, Tag, FileText, Layers } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const DOMAINS = ['Startup', 'Hackathon', 'Research'];
const ALL_SKILLS = ['React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'Python', 'FastAPI', 'Django', 'TensorFlow', 'PyTorch', 'LangChain', 'OpenAI', 'Solidity', 'Ethereum', 'IPFS', 'Web3.js', 'PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Docker', 'AWS', 'GCP', 'React Native', 'Flutter', 'D3.js', 'Three.js', 'Socket.io', 'GraphQL'];

const STEPS = [{ label: 'Basics', icon: FileText }, { label: 'Domain', icon: Layers }, { label: 'Skills', icon: Tag }, { label: 'Review', icon: Check }];
const EMPTY_FORM = { title: '', description: '', domain: '', skills_list: [], owner_name: '', owner_id: `user_${Date.now()}` };

export default function PostProjectForm({ onClose, onSuccess }) {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ...EMPTY_FORM, owner_name: displayName, owner_id: user?.id || `user_${Date.now()}` });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !form.skills_list.includes(s)) update('skills_list', [...form.skills_list, s]);
    setSkillInput('');
  };
  const removeSkill = (s) => update('skills_list', form.skills_list.filter(x => x !== s));

  const canNext = () => {
    if (step === 0) return form.title.trim().length > 3 && form.owner_name.trim().length > 1;
    if (step === 1) return !!form.domain;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const { error: sbErr } = await supabase.from('projects').insert([{
        title: form.title.trim(), description: form.description.trim(), domain: form.domain,
        skills_list: form.skills_list, owner_id: form.owner_id, owner_name: form.owner_name.trim()
      }]);
      if (sbErr) {
        const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error('Server error');
      }
      setSubmitted(true);
      setTimeout(() => { onSuccess?.(); onClose(); }, 2200);
    } catch (e) { setError('Could not post project. Check connection.'); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 60, backgroundColor: 'rgba(250, 250, 248, 0.9)' }}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        style={{ width: '100%', maxWidth: '640px', backgroundColor: 'var(--canvas)', border: '3px solid var(--ink)', boxShadow: '16px 16px 0 var(--ink)', maxHeight: '90vh', overflowY: 'auto', position: 'relative', '--section-accent': 'var(--accent-blue)' }}
      >
        <button onClick={onClose} className="brutal-hover" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--canvas)', border: '2px solid var(--ink)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
          <X size={20} color="var(--ink)" />
        </button>

        <div style={{ padding: '2.5rem' }}>
          <div className="mb-8">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              Post a <br/><span className="accent-highlight">Project</span>
            </h2>
          </div>

          {!submitted && (
            <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar pb-2">
              {STEPS.map(({ label, icon: Icon }, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                    backgroundColor: i === step ? 'var(--ink)' : i < step ? 'var(--canvas)' : 'var(--canvas-warm)',
                    border: '2px solid var(--ink)',
                    color: i === step ? 'var(--canvas)' : 'var(--ink)',
                    fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.6875rem', textTransform: 'uppercase'
                  }}>
                    {i < step ? <Check size={14} /> : <Icon size={14} />}
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div style={{ height: '2px', width: '20px', backgroundColor: 'var(--ink)' }} />}
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div style={{ width: '80px', height: '80px', margin: '0 auto 1.5rem', backgroundColor: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--ink)' }}>
                  <Check size={40} color="var(--canvas)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--ink)', textTransform: 'uppercase' }}>Project Posted</h3>
              </motion.div>
            ) : (
              <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
                
                {step === 0 && (
                  <>
                    <div className="floating-group">
                      <div className="relative">
                        <input value={form.owner_name} onChange={e => update('owner_name', e.target.value)} placeholder=" " className="floating-input" />
                        <label className="floating-label">Your Name *</label>
                        <div className="floating-border-anim" />
                      </div>
                    </div>
                    <div className="floating-group">
                      <div className="relative">
                        <input value={form.title} onChange={e => update('title', e.target.value)} placeholder=" " className="floating-input" />
                        <label className="floating-label">Project Title *</label>
                        <div className="floating-border-anim" />
                      </div>
                    </div>
                    <div className="floating-group" style={{ paddingTop: '2rem' }}>
                      <div className="relative">
                        <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} placeholder=" " className="floating-input" style={{ resize: 'none' }} />
                        <label className="floating-label" style={{ top: '1rem' }}>Brief Description</label>
                        <div className="floating-border-anim" />
                      </div>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink)' }}>Select Domain *</label>
                    <div className="grid grid-cols-1 gap-4">
                      {DOMAINS.map(d => (
                        <button key={d} onClick={() => update('domain', d)} className="brutal-hover" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: form.domain === d ? 'var(--ink)' : 'var(--canvas)', border: '2px solid var(--ink)', cursor: 'pointer', textAlign: 'left' }}>
                          <div style={{ width: '48px', height: '48px', backgroundColor: form.domain === d ? 'var(--canvas)' : 'var(--ink)', color: form.domain === d ? 'var(--ink)' : 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                            {d === 'Startup' ? '🚀' : d === 'Hackathon' ? '⚡' : '🔬'}
                          </div>
                          <div>
                            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: form.domain === d ? 'var(--canvas)' : 'var(--ink)' }}>{d}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="floating-group">
                      <div className="relative flex gap-2">
                        <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill(skillInput)} placeholder=" " className="floating-input" style={{ flex: 1 }} />
                        <label className="floating-label">Type a skill + Enter</label>
                        <div className="floating-border-anim" style={{ width: 'calc(100% - 4rem)' }} />
                        <button onClick={() => addSkill(skillInput)} className="brutal-hover" style={{ padding: '0 1.5rem', backgroundColor: 'var(--ink)', color: 'var(--canvas)', border: '2px solid var(--ink)', cursor: 'pointer' }}><Plus size={20} /></button>
                      </div>
                    </div>
                    {form.skills_list.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-4" style={{ backgroundColor: 'var(--canvas-warm)', border: '2px solid var(--ink)' }}>
                        {form.skills_list.map(s => (
                          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--ink)', color: 'var(--canvas)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>
                            {s} <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: 'var(--canvas)', cursor: 'pointer' }}>×</button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pt-2">
                      {ALL_SKILLS.filter(s => !form.skills_list.includes(s)).map(s => (
                        <button key={s} onClick={() => addSkill(s)} className="brutal-hover" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'transparent', border: '1px solid var(--ink)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', cursor: 'pointer' }}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div style={{ padding: '2rem', backgroundColor: 'var(--canvas-warm)', border: '2px solid var(--ink)' }}>
                      <div className="mb-4">
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Title</p>
                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--ink)' }}>{form.title}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Domain</p>
                          <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink)' }}>{form.domain}</p>
                        </div>
                        <div>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Posted By</p>
                          <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--ink)' }}>{form.owner_name}</p>
                        </div>
                      </div>
                      {form.description && (
                        <div className="mb-4">
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Description</p>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--ink)' }}>{form.description}</p>
                        </div>
                      )}
                      {form.skills_list.length > 0 && (
                        <div>
                          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Skills Needed</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {form.skills_list.map(s => <span key={s} style={{ padding: '0.25rem 0.5rem', border: '1px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>{s}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                    {error && <div style={{ padding: '1rem', backgroundColor: 'var(--accent-red)', color: 'var(--canvas)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>{error}</div>}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!submitted && (
            <div className="flex items-center justify-between mt-10 pt-6" style={{ borderTop: '2px solid var(--ink)' }}>
              <button onClick={() => setStep(s => s - 1)} disabled={step === 0} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: 'none', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.3 : 1 }}>
                Back
              </button>

              {step < STEPS.length - 1 ? (
                <button onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()} className="brutal-hover" style={{ padding: '1rem 2rem', backgroundColor: 'var(--ink)', color: 'var(--canvas)', border: '2px solid var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', cursor: canNext() ? 'pointer' : 'not-allowed', opacity: canNext() ? 1 : 0.5 }}>
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="brutal-hover" style={{ padding: '1rem 2rem', backgroundColor: 'var(--section-accent)', color: 'var(--canvas)', border: '2px solid var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer' }}>
                  {loading ? 'Publishing...' : 'Publish Project'}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
