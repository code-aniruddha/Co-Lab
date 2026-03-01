// ============================================================
//  src/pages/CommunityPage.jsx  —  Community + resources hub
// ============================================================
import { motion } from 'framer-motion';
import { Users, MessageSquare, Star, Trophy, Github, ExternalLink, Sparkles, Zap, Shield, Cpu, Leaf } from 'lucide-react';
import { HACKATHON_TEAMS } from '../lib/mockData';

// Team icon map
const TEAM_ICONS = { ByteForce: Zap, ChainGuard: Shield, NeuralNexus: Cpu, GreenPulse: Leaf };

const FEATURED_MEMBERS = [
  { name: 'Aryan Mehta',   role: 'Full-Stack Developer', skills: ['React', 'Node.js', 'MongoDB'], projects: 4, avatar: 'AM' },
  { name: 'Priya Sharma',  role: 'ML Engineer',          skills: ['Python', 'TensorFlow', 'CV'],  projects: 3, avatar: 'PS' },
  { name: 'Rohan Verma',   role: 'Blockchain Dev',       skills: ['Solidity', 'Web3', 'IPFS'],    projects: 2, avatar: 'RV' },
  { name: 'Sneha Patil',   role: 'Data Scientist',       skills: ['FastAPI', 'Pandas', 'GIS'],    projects: 5, avatar: 'SP' },
  { name: 'Kabir Das',     role: 'IoT & Cloud',          skills: ['Node.js', 'AWS', 'MQTT'],      projects: 3, avatar: 'KD' },
  { name: 'Anika Singh',   role: 'Product Designer',     skills: ['Figma', 'React', 'UX'],        projects: 6, avatar: 'AS' },
];

const RESOURCES = [
  { title: 'How to Write a Great Project Brief', type: 'Guide',   icon: Star  },
  { title: 'Best Practices for Remote Collaboration', type: 'Article', icon: MessageSquare },
  { title: 'Student Project Showcase 2025',      type: 'Archive', icon: Trophy },
  { title: 'Open Source Starter Kit',            type: 'Repo',    icon: Github },
];

const COLORS = ['from-sky-500 to-indigo-500', 'from-indigo-500 to-purple-500', 'from-purple-500 to-pink-500', 'from-emerald-500 to-sky-500', 'from-amber-500 to-orange-500', 'from-rose-500 to-pink-500'];

function MemberCard({ member, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-3 hover:ring-1 hover:ring-sky-500/25 transition-all duration-300 group"
    >
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${COLORS[index % COLORS.length]} flex items-center justify-center text-white font-extrabold text-sm shrink-0`}>
          {member.avatar}
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm truncate">{member.name}</p>
          <p className="text-slate-500 text-xs truncate">{member.role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {member.skills.map(s => (
          <span key={s} className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 text-[11px] border border-slate-700/50">
            {s}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-2 border-t border-slate-800">
        <Sparkles size={11} className="text-sky-400" />
        <span>{member.projects} projects</span>
      </div>
    </motion.div>
  );
}

const STATUS_STYLES = {
  forming: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  active:  'bg-sky-500/15  text-sky-400  border border-sky-500/25',
  closed:  'bg-slate-700/40 text-slate-400 border border-slate-600/30',
};
const TEAM_GRADIENTS = [
  'from-sky-500 to-indigo-500',
  'from-indigo-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-violet-500 to-purple-500',
];

function TeamCard({ team, index }) {
  const Icon = TEAM_ICONS[team.name] || Sparkles;
  const openSlots = team.slots_total - team.slots_filled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.1 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-4 hover:ring-1 hover:ring-indigo-500/30 transition-all duration-300 group"
      style={{ border: '1px solid rgba(99,102,241,0.12)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${TEAM_GRADIENTS[index % TEAM_GRADIENTS.length]} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
            <Icon size={18} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-extrabold text-base truncate">{team.name}</p>
            <p className="text-slate-500 text-[11px] truncate">{team.hackathon}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${STATUS_STYLES[team.status] || STATUS_STYLES.forming}`}>
          {team.status}
        </span>
      </div>

      {/* Project title */}
      <p className="text-slate-300 text-sm leading-snug font-medium">{team.project}</p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5">
        {team.tech_stack.map(t => (
          <span key={t} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[11px] border border-indigo-500/20">
            {t}
          </span>
        ))}
      </div>

      {/* Members avatars */}
      {team.members?.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {team.members.slice(0, 4).map((m, mi) => (
              <div
                key={mi}
                title={`${m.name} — ${m.role}`}
                className="w-7 h-7 rounded-full border-2 border-[#080f1e] bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[9px] font-bold text-white"
              >
                {m.avatar}
              </div>
            ))}
            {team.members.length > 4 && (
              <div className="w-7 h-7 rounded-full border-2 border-[#080f1e] bg-slate-800 flex items-center justify-center text-[9px] font-semibold text-slate-400">
                +{team.members.length - 4}
              </div>
            )}
          </div>
          <span className="text-xs text-slate-500">{team.members.length} member{team.members.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Slots & looking-for */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        {/* Slot pips */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            {Array.from({ length: team.slots_total }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i < team.slots_filled ? 'bg-sky-400' : 'bg-slate-700'}`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 ml-1">
            {openSlots > 0 ? `${openSlots} slot${openSlots > 1 ? 's' : ''} open` : 'Full team'}
          </span>
        </div>

        {team.looking_for?.length > 0 && (
          <span className="text-[10px] text-amber-400 font-semibold truncate max-w-[120px]">
            Need: {team.looking_for[0]}
          </span>
        )}
      </div>
    </motion.div>
  );
}


export default function CommunityPage() {
  return (
    <div className="min-h-screen">

      {/* ── Hero banner ── */}
      <section className="py-16 section-glass border-b border-slate-800/40">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Users size={12} /> Community
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-4xl sm:text-5xl font-extrabold text-white mb-4"
          >
            Meet the{' '}
            <span className="gradient-text">Builders</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Students from 48+ colleges building the future — one project at a time.
          </motion.p>
        </div>
      </section>

      {/* ── Stats row ── */}
      <section className="py-10 section-glass">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { label: 'Active Members', value: '1,200+' },
              { label: 'Colleges',       value: '48'     },
              { label: 'Projects Built', value: '200+'   },
              { label: 'Teams Formed',   value: '320+'   },
            ].map(({ label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-4 text-center"
              >
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-slate-500 text-xs mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured builders ── */}
      <section className="py-16 section-glass-mid">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-10">
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Top Contributing Students</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Builders</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURED_MEMBERS.map((m, i) => (
              <MemberCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Hackathon Teams ── */}
      <section className="py-16 section-glass-mid">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">Active Hackathon Teams</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Find Your Team</h2>
              <p className="text-slate-400 text-sm mt-2">Join a team building for competitive hackathons.</p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold shrink-0">
              <Trophy size={12} /> {HACKATHON_TEAMS.length} teams active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
            {HACKATHON_TEAMS.map((team, i) => (
              <TeamCard key={team.id} team={team} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Resources ── */}
      <section className="py-16 section-glass">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="mb-10">
            <p className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-2">Learning Hub</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Resources & Guides</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESOURCES.map(({ title, type, icon: Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:ring-1 hover:ring-sky-500/25 cursor-pointer group transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm group-hover:text-sky-300 transition-colors truncate">{title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{type}</p>
                </div>
                <ExternalLink size={14} className="text-slate-600 group-hover:text-sky-400 transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join CTA ── */}
      <section className="py-20 section-glass-mid">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-10 relative overflow-hidden"
            style={{ border: '1px solid rgba(56,189,248,0.15)' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-40 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl font-extrabold text-white mb-4 relative">
              Ready to Build<br />
              <span className="gradient-text">Something Meaningful?</span>
            </h2>
            <p className="text-slate-400 mb-8 relative">
              Sign up today and connect with student builders who share your vision.
            </p>
            <a
              href="/discover"
              className="btn-primary px-8 py-3.5 text-base inline-flex items-center gap-2"
            >
              <Sparkles size={16} /> Start Exploring
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
