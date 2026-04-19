// ============================================================
//  src/components/Footer.jsx (White Canvas Edition)
// ============================================================
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import Logo from './Logo';

const LINKS = {
  Platform:  [
    { label: 'Discover Projects', to: '/discover'  },
    { label: 'Post an Idea',      to: null          },
    { label: 'Smart Match',       to: '/discover'   },
    { label: 'Community',         to: '/community'  },
  ],
  Resources: [
    { label: 'How It Works',    to: '/' },
    { label: 'Privacy Policy',  to: null },
    { label: 'Terms of Use',    to: null },
    { label: 'Contact',         to: null },
  ],
};

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer 
      id="about" 
      style={{
        backgroundColor: 'var(--ink)',
        color: 'var(--canvas)',
        borderTop: '4px solid var(--section-accent)',
        padding: '5rem clamp(1rem, 3vw, 2.5rem) 3rem',
        '--section-accent': 'var(--accent-red)'
      }}
    >
      <div className="max-w-[1340px] mx-auto">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-2">
            <button onClick={() => navigate('/')} className="mb-6 block cursor-pointer">
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '2rem',
                color: 'var(--canvas)',
                letterSpacing: '-0.03em',
                textTransform: 'uppercase'
              }}>
                Co-Lab
              </span>
            </button>
            <p style={{
              fontFamily: 'var(--font-editorial)',
              fontStyle: 'italic',
              fontSize: '1.125rem',
              color: 'var(--canvas)',
              opacity: 0.6,
              maxWidth: '320px',
              lineHeight: 1.5,
              marginBottom: '2rem'
            }}>
              A platform for student builders, researchers, and innovators to find
              collaborators and ship projects that matter.
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              {[
                { icon: Github,   href: 'https://github.com' },
                { icon: Twitter,  href: 'https://twitter.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Mail,     href: 'mailto:hello@colab.dev' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-hover flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'transparent',
                    border: '1.5px solid var(--ink-muted)',
                    color: 'var(--ink-faint)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--canvas)';
                    e.currentTarget.style.color = 'var(--canvas)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--ink-muted)';
                    e.currentTarget.style.color = 'var(--ink-faint)';
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--ink-muted)',
                marginBottom: '1.5rem'
              }}>
                {section}
              </p>
              <ul className="flex flex-col gap-3">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <button
                      onClick={() => to && navigate(to)}
                      className="text-left"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        color: 'var(--ink-faint)',
                        transition: 'color 0.15s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--canvas)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--ink-faint)'}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '2rem' }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--ink-muted)'
          }}>
            © 2026 Co-Lab · Open Source · Built for students
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            color: 'var(--ink-muted)'
          }}>
            White Canvas Edition
          </p>
        </div>
      </div>
    </footer>
  );
}
