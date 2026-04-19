// ============================================================
//  src/components/AuthModal.jsx (White Canvas Edition)
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { DEMO_USERS } from '../lib/mockData';
import Logo from './Logo';

function FormField({ label, type = 'text', value, onChange, icon: Icon, error }) {
  const [show, setShow] = useState(false);
  const inputType = type === 'password' ? (show ? 'text' : 'password') : type;

  return (
    <div className={`floating-group ${error ? 'animate-shake' : ''}`}>
      <div className="relative">
        {Icon && <Icon size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder=" "
          className="floating-input"
          style={{
            paddingLeft: Icon ? '2rem' : '0',
            borderColor: error ? 'var(--accent-red)' : undefined
          }}
        />
        <label
          className="floating-label"
          style={{ left: Icon ? '2rem' : '0', color: error ? 'var(--accent-red)' : undefined }}
        >
          {label}
        </label>
        {!error && <div className="floating-border-anim" />}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-muted)', cursor: 'pointer', zIndex: 1 }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--canvas)', backgroundColor: 'var(--accent-red)', padding: '0.25rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', overflow: 'hidden' }}
          >
            <AlertCircle size={12} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [loading, setLoad] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [globalErr, setGlobal] = useState('');

  const reset = () => { setErrors({}); setGlobal(''); setSuccess(''); };

  const validate = () => {
    const errs = {};
    if (mode === 'signup' && name.trim().length < 2) errs.name = 'Enter your full name';
    if (!email.includes('@')) errs.email = 'Valid email required';
    if (mode !== 'forgot' && password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    reset();
    if (!validate()) return;
    setLoad(true);
    try {
      if (mode === 'login') {
        const demoMatch = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (demoMatch) {
          await new Promise(r => setTimeout(r, 600));
          onSuccess?.({ id: demoMatch.id, email: demoMatch.email, user_metadata: { full_name: demoMatch.full_name, avatar: demoMatch.avatar, skills: demoMatch.skills } });
          onClose();
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess?.();
        onClose();
      } else if (mode === 'signup') {
        const { data: signUpData, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
        if (error) throw error;
        if (signUpData?.session) {
          onSuccess?.(signUpData.user);
          onClose();
        } else {
          setSuccess('Account created! Check your email to confirm.');
          setTimeout(() => { setMode('login'); setSuccess(''); }, 3500);
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset` });
        if (error) throw error;
        setSuccess('Password reset link sent! Check your inbox.');
      }
    } catch (err) {
      if (err?.message?.includes('fetch') || err?.message?.includes('Failed')) {
        if (mode === 'login') {
          onSuccess?.({ id: 'demo_user', email, user_metadata: { full_name: name || 'Demo User' } });
          onClose();
        } else if (mode === 'signup') {
          onSuccess?.({ id: `demo_${Date.now()}`, email, user_metadata: { full_name: name || email.split('@')[0] } });
          onClose();
        } else {
          setSuccess('Demo mode: reset link simulated!');
        }
      } else {
        setGlobal(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoad(false);
    }
  };

  const TITLE = { login: 'Welcome back', signup: 'Create account', forgot: 'Reset password' };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(250, 250, 248, 0.9)' }}>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--canvas)',
          border: '3px solid var(--ink)',
          boxShadow: '12px 12px 0 var(--ink)',
          position: 'relative',
          '--section-accent': 'var(--accent-red)'
        }}
      >
        <div style={{ padding: '2rem' }}>
          <button onClick={onClose} className="brutal-hover" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--canvas)', border: '2px solid var(--ink)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={20} color="var(--ink)" />
          </button>

          <div className="mb-8">
            <Logo size={40} showText className="mb-6" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              {TITLE[mode]}
            </h2>
          </div>

          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '1rem', backgroundColor: 'var(--ink)', color: 'var(--canvas)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1.5rem', border: '2px solid var(--ink)' }}>
                <CheckCircle2 size={16} /> <span>{success}</span>
              </motion.div>
            )}
            {globalErr && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '1rem', backgroundColor: 'var(--accent-red)', color: 'var(--canvas)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1.5rem', border: '2px solid var(--ink)' }}>
                <AlertCircle size={16} /> <span>{globalErr}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div key="name-field" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <FormField label="Full Name" value={name} onChange={e => setName(e.target.value)} icon={User} error={errors.name} />
                </motion.div>
              )}
            </AnimatePresence>

            <FormField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={Mail} error={errors.email} />

            <AnimatePresence mode="popLayout">
              {mode !== 'forgot' && (
                <motion.div key="pass-field" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <FormField label="Password" type="password" value={password} onChange={e => setPass(e.target.value)} icon={Lock} error={errors.password} />
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'login' && (
              <div className="flex justify-end -mt-2">
                <button type="button" onClick={() => { setMode('forgot'); reset(); }} style={{ background: 'none', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--section-accent)', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700 }}>
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="brutal-hover" disabled={loading} style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--section-accent)', color: 'var(--canvas)', border: '2px solid var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              {loading ? 'Processing...' : mode === 'login' ? <><ArrowRight size={16} /> Sign In</> : mode === 'signup' ? <><Sparkles size={16} /> Create Account</> : <><Mail size={16} /> Reset Password</>}
            </button>
          </form>

          {mode === 'login' && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ borderTop: '2px solid var(--ink)', position: 'relative', margin: '1.5rem 0' }}>
                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--canvas)', padding: '0 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Demo Accounts</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {DEMO_USERS.map(u => (
                  <button key={u.id} type="button" onClick={() => { setEmail(u.email); setPass(u.password); reset(); }} className="brutal-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--canvas)', border: '2px solid var(--ink)', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--ink)', color: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>
                      {u.avatar}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{u.full_name.split(' ')[0]}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--ink-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{u.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid var(--ink)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink)' }}>
              {mode === 'login' ? 'No account? ' : 'Already have an account? '}
              <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); reset(); }} style={{ background: 'none', border: 'none', color: 'var(--section-accent)', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>
                {mode === 'login' ? 'Sign up free' : 'Log in'}
              </button>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
