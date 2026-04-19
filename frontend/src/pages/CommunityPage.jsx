// ============================================================
//  src/pages/CommunityPage.jsx (White Canvas Edition)
// ============================================================
import { motion } from 'framer-motion';
import { Users, Star, Trophy, Github, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';
import { HACKATHON_TEAMS } from '../lib/mockData';
import { variants, viewportConfig } from '../lib/motion';

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

function MemberCard({ member, index }) {
  return (
    <motion.div
      variants={variants.fadeUp}
      className="brutal-hover flex flex-col"
      style={{
        backgroundColor: 'var(--canvas)',
        border: '1.5px solid var(--rule-strong)',
        padding: '1.5rem',
        borderTop: '4px solid var(--section-accent)'
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div style={{
          width: '48px', height: '48px',
          backgroundColor: 'var(--ink)',
          color: 'var(--canvas)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.125rem'
        }}>
          {member.avatar}
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--ink)' }}>{member.name}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{member.role}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {member.skills.map(s => (
          <span key={s} style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: 'transparent',
            border: '1px solid var(--ink)',
            color: 'var(--ink)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            {s}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-4 border-t-2" style={{ borderColor: 'var(--rule)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--ink-muted)' }}>
        {member.projects} projects completed
      </div>
    </motion.div>
  );
}

function TeamCard({ team, index }) {
  const openSlots = team.slots_total - team.slots_filled;

  return (
    <motion.div
      variants={variants.fadeUp}
      className="brutal-hover flex flex-col"
      style={{
        backgroundColor: 'var(--canvas)',
        border: '1.5px solid var(--rule-strong)',
        padding: '1.5rem',
        borderLeft: '6px solid var(--ink)'
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--ink)' }}>{team.name}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>{team.hackathon}</p>
        </div>
        <span style={{
          padding: '0.25rem 0.5rem',
          backgroundColor: team.status === 'forming' ? 'var(--section-accent)' : 'var(--ink-disabled)',
          color: team.status === 'forming' ? 'var(--canvas)' : 'var(--ink)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          {team.status}
        </span>
      </div>

      <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--ink)', marginBottom: '1rem' }}>
        {team.project}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {team.tech_stack.map(t => (
          <span key={t} style={{
            padding: '0.15rem 0.4rem',
            backgroundColor: 'var(--canvas-warm)',
            border: '1px solid var(--rule)',
            color: 'var(--ink-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            textTransform: 'uppercase'
          }}>
            {t}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-3 flex justify-between items-center" style={{ borderTop: '2px solid var(--ink)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--ink)' }}>
          {team.members?.length || 0} Members
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--section-accent)', fontWeight: 700 }}>
          {openSlots > 0 ? `${openSlots} slots open` : 'Full'}
        </div>
      </div>
    </motion.div>
  );
}

export default function CommunityPage() {
  return (
    <div style={{ '--section-accent': 'var(--accent-black)', minHeight: '100vh', backgroundColor: 'var(--canvas)' }}>

      {/* Hero */}
      <section style={{ borderBottom: '2px solid var(--ink)', padding: 'var(--section-padding-y) 0', backgroundColor: 'var(--canvas-warm)' }}>
        <div className="max-w-[1340px] mx-auto px-5 sm:px-8 text-center">
          <motion.div initial="hidden" animate="show" variants={variants.staggerFast}>
            <motion.div variants={variants.fadeIn} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>
              <Users size={14} className="inline mr-2" /> Community
            </motion.div>
            
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(4rem, 8vw, 8rem)', color: 'var(--ink)', lineHeight: 0.9, letterSpacing: '-0.04em', margin: '0 0 1.5rem 0' }}>
              <div className="overflow-hidden block"><motion.div variants={variants.clipReveal}>Meet the</motion.div></div>
              <div className="overflow-hidden block"><motion.div variants={variants.clipReveal}><span className="accent-highlight">Builders</span></motion.div></div>
            </h1>
            
            <motion.p variants={variants.fadeUp} style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', color: 'var(--ink-muted)', maxWidth: '600px', mx: 'auto' }}>
              Students from 48+ colleges building the future — one project at a time.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderBottom: '2px solid var(--ink)', backgroundColor: 'var(--canvas)' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 max-w-[1340px] mx-auto">
          {[
            { label: 'Active Members', value: '1,200+' },
            { label: 'Colleges',       value: '48'     },
            { label: 'Projects Built', value: '200+'   },
            { label: 'Teams Formed',   value: '320+'   },
          ].map(({ label, value }, i) => (
            <div key={label} style={{
              padding: '3rem 2rem',
              borderRight: i !== 3 ? '1px solid var(--rule)' : 'none',
              textAlign: 'center'
            }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'var(--ink)', lineHeight: 1 }}>{value}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--ink-muted)', marginTop: '0.5rem' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Builders */}
      <section style={{ padding: 'var(--section-padding-y) 0', backgroundColor: 'var(--canvas)' }}>
        <div className="max-w-[1340px] mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--ink-muted)', marginBottom: '1rem' }}>Top Contributing Students</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(3rem, 5vw, 5rem)', color: 'var(--ink)', lineHeight: 0.9 }}>Featured Builders</h2>
            <div style={{ borderBottom: '3px solid var(--ink)', margin: '2rem 0', width: '100%' }} />
          </div>
          
          <motion.div variants={variants.staggerContainer} initial="hidden" whileInView="show" viewport={viewportConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_MEMBERS.map((m, i) => <MemberCard key={m.name} member={m} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* Hackathon Teams */}
      <section style={{ padding: 'var(--section-padding-y) 0', backgroundColor: 'var(--canvas-section)' }}>
        <div className="max-w-[1340px] mx-auto px-5 sm:px-8">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--ink-muted)', marginBottom: '1rem' }}>Active Hackathon Teams</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(3rem, 5vw, 5rem)', color: 'var(--ink)', lineHeight: 0.9 }}>Find Your Team</h2>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, padding: '0.5rem 1rem', border: '2px solid var(--ink)' }}>
              <Trophy size={14} className="inline mr-2" /> {HACKATHON_TEAMS.length} teams active
            </div>
          </div>
          
          <motion.div variants={variants.staggerContainer} initial="hidden" whileInView="show" viewport={viewportConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HACKATHON_TEAMS.map((team, i) => <TeamCard key={team.id} team={team} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* Resources */}
      <section style={{ padding: 'var(--section-padding-y) 0', backgroundColor: 'var(--canvas)' }}>
        <div className="max-w-[1340px] mx-auto px-5 sm:px-8">
          <div className="mb-12">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(3rem, 5vw, 5rem)', color: 'var(--ink)', lineHeight: 0.9 }}>Resources & Guides</h2>
            <div style={{ borderBottom: '3px solid var(--ink)', margin: '2rem 0', width: '100%' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {RESOURCES.map(({ title, type, icon: Icon }) => (
              <div key={title} className="brutal-hover cursor-pointer" style={{
                display: 'flex', alignItems: 'center', gap: '1.5rem',
                padding: '2rem',
                border: '1.5px solid var(--ink)'
              }}>
                <Icon size={24} color="var(--ink)" />
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--ink)' }}>{title}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{type}</p>
                </div>
                <ExternalLink size={20} color="var(--ink-faint)" className="ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
