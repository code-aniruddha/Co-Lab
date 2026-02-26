// ============================================================
//  src/components/AuthModal.jsx  —  Login / Signup modal
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Sparkles, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { DEMO_USERS } from '../lib/mockData';
import Logo from './Logo';

// ─── Floating label input ─────────────────────────────
function FormField({ label, type = 'text', value, onChange, icon: Icon, error }) {
  const [show, setShow] = useState(false);
  const inputType = type === 'password' ? (show ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        )}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          className={`input-field ${Icon ? 'pl-10' : 'pl-4'} ${type === 'password' ? 'pr-10' : 'pr-4'} ${
            error ? 'border-red-500/60 focus:border-red-500' : ''
          }`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1 mt-0.5">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}

// ─── Social divider ───────────────────────────────────
function Divider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-700/70" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="px-3 bg-[#0d1829] text-slate-500">or continue with email</span>
      </div>
    </div>
  );
}

// ─── AuthModal ────────────────────────────────────────
export default function AuthModal({ onClose, onSuccess }) {
  const [mode,     setMode]   = useState('login'); // 'login' | 'signup' | 'forgot'
  const [name,     setName]   = useState('');
  const [email,    setEmail]  = useState('');
  const [password, setPass]   = useState('');
  const [loading,  setLoad]   = useState(false);
  const [errors,   setErrors] = useState({});
  const [success,  setSuccess] = useState('');
  const [globalErr, setGlobal] = useState('');

  const reset = () => { setErrors({}); setGlobal(''); setSuccess(''); };

  const validate = () => {
    const errs = {};
    if (mode === 'signup' && name.trim().length < 2) errs.name = 'Enter your full name';
    if (!email.includes('@'))                       errs.email = 'Valid email required';
    if (mode !== 'forgot' && password.length < 6)  errs.password = 'Min 6 characters';
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
        // ── Demo-user offline bypass ──────────────────────────
        const demoMatch = DEMO_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (demoMatch) {
          await new Promise(r => setTimeout(r, 600)); // feel like a real request
          onSuccess?.({
            id: demoMatch.id,
            email: demoMatch.email,
            user_metadata: { full_name: demoMatch.full_name, avatar: demoMatch.avatar, skills: demoMatch.skills },
          });
          onClose();
          return;
        }
        // ── Real Supabase auth ────────────────────────────────
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess?.();
        onClose();

      } else if (mode === 'signup') {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        // If Supabase returns a session the user is immediately active (email confirm disabled)
        if (signUpData?.session) {
          onSuccess?.(signUpData.user);
          onClose();
        } else {
          // Email confirmation required
          setSuccess('Account created! Check your email to confirm your address, then log back in.');
          setTimeout(() => { setMode('login'); setSuccess(''); }, 3500);
        }

      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset`,
        });
        if (error) throw error;
        setSuccess('Password reset link sent! Check your inbox.');
      }
    } catch (err) {
      // Graceful fallback for demo (no Supabase configured)
      if (err?.message?.includes('fetch') || err?.message?.includes('Failed')) {
        if (mode === 'login') {
          // Demo mode: simulate login
          onSuccess?.({ id: 'demo_user', email, user_metadata: { full_name: name || 'Demo User' } });
          onClose();
        } else if (mode === 'signup') {
          // Demo mode: simulate successful signup + auto-login
          onSuccess?.({
            id: `demo_${Date.now()}`,
            email,
            user_metadata: { full_name: name || email.split('@')[0] },
          });
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

  const TITLE = {
    login: 'Welcome back',
    signup: 'Create your account',
    forgot: 'Reset your password',
  };
  const SUBTITLE = {
    login: 'Sign in to post projects and express interest.',
    signup: 'Join the platform and start collaborating.',
    forgot: 'We\'ll send a reset link to your email.',
  };

  return (
    <motion.div
      key="auth-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{   scale: 0.92, opacity: 0, y: 24  }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        className="w-full max-w-md glass-dark rounded-3xl overflow-hidden relative"
        style={{ border: '1px solid rgba(56,189,248,0.18)' }}
      >
        {/* ── Top gradient bar ── */}
        <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />

        {/* ── Ambient glow ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="px-7 pt-7 pb-8 relative">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-700/60 transition-all"
          >
            <X size={16} />
          </button>

          {/* Logo + heading */}
          <div className="mb-7">
            <Logo size={34} showText className="mb-4" />
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{   opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <h2 className="text-2xl font-extrabold text-white">{TITLE[mode]}</h2>
                <p className="text-slate-400 text-sm mt-1">{SUBTITLE[mode]}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Success state ── */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/12 border border-emerald-500/30 text-emerald-400 text-sm mb-5"
              >
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Error state ── */}
          <AnimatePresence>
            {globalErr && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm mb-5"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{globalErr}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <AnimatePresence mode="popLayout">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{   height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <FormField
                    label="Full Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    icon={User}
                    error={errors.name}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <FormField
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={Mail}
              error={errors.email}
            />

            <AnimatePresence mode="popLayout">
              {mode !== 'forgot' && (
                <motion.div
                  key="pass-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{   height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <FormField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={e => setPass(e.target.value)}
                    icon={Lock}
                    error={errors.password}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'login' && (
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); reset(); }}
                  className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 28px rgba(56,189,248,0.4)' } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              disabled={loading}
              className="btn-primary w-full justify-center mt-1"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : (
                <>
                  {mode === 'login'  && <><ArrowRight size={15} /> Sign In</>}
                  {mode === 'signup' && <><Sparkles size={15} /> Create Account</>}
                  {mode === 'forgot' && <><Mail size={15} /> Send Reset Link</>}
                </>
              )}
            </motion.button>
          </form>

          {/* ── Demo credentials (login mode only) ── */}
          <AnimatePresence>
            {mode === 'login' && (
              <motion.div
                key="demo-creds"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{   opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
                className="mt-5"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700/70" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-[#0d1829] text-slate-500 font-medium">Try a demo account</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {DEMO_USERS.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => { setEmail(u.email); setPass(u.password); reset(); }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-sky-500/40 hover:bg-slate-800/90 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white shrink-0 group-hover:scale-105 transition-transform">
                        {u.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold leading-snug truncate">{u.full_name.split(' ')[0]}</p>
                        <p className="text-slate-500 text-[10px] truncate">{u.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-center text-[10px] text-slate-600 mt-2">Click a card to auto-fill · password: <span className="text-slate-500 font-mono">demo1234</span></p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Mode switch ── */}
          <div className="mt-5 pt-5 border-t border-slate-800 text-center text-sm">
            {mode === 'login' ? (
              <p className="text-slate-500">
                No account?{' '}
                <button
                  onClick={() => { setMode('signup'); reset(); }}
                  className="text-sky-400 font-semibold hover:text-sky-300 transition-colors"
                >
                  Sign up free
                </button>
              </p>
            ) : (
              <p className="text-slate-500">
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('login'); reset(); }}
                  className="text-sky-400 font-semibold hover:text-sky-300 transition-colors"
                >
                  Log in
                </button>
              </p>
            )}
          </div>

          {/* ── Demo note ── */}
          <p className="text-center text-[11px] text-slate-600 mt-3">
            Demo accounts work offline — no Supabase needed.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
