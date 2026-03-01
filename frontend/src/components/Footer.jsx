// ============================================================
//  src/components/Footer.jsx
// ============================================================
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart, Mail } from 'lucide-react';
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
    <footer id="about" className="border-t border-slate-800/60 section-glass pt-16 pb-8 px-5">
      <div className="max-w-6xl mx-auto">

        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <button onClick={() => navigate('/')} className="mb-4 block">
              <Logo size={36} showText />
            </button>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-5">
              A platform for student builders, researchers, and innovators to find
              collaborators, form dream teams, and ship projects that matter.
            </p>
            {/* Social icons */}
            <div className="flex gap-2.5">
              {[
                { icon: Github,   href: 'https://github.com' },
                { icon: Twitter,  href: 'https://twitter.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Mail,     href: 'mailto:hello@colab.dev' },
              ].map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-slate-500 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <p className="text-slate-200 font-semibold text-sm uppercase tracking-wider mb-4">{section}</p>
              <ul className="space-y-2.5">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <button
                      onClick={() => to && navigate(to)}
                      className="text-slate-500 text-sm hover:text-sky-400 transition-colors inline-flex items-center gap-1.5 group text-left"
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-sky-400 transition-colors" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">© 2026 Co-Lab · Open Source · Built for students, by students</p>
          <p className="text-slate-600 text-xs flex items-center gap-1.5">
            Made in React
          </p>
        </div>
      </div>
    </footer>
  );
}
