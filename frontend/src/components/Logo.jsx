// ============================================================
//  src/components/Logo.jsx  —  Co-Lab SVG Brand Mark
// ============================================================

/**
 * The Co-Lab logo — an interconnected node graph forming "CL"
 * symbolizing collaboration and open innovation.
 * Props: size (px), showText (bool), className
 */
export default function Logo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* ── SVG Mark ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Co-Lab logo"
      >
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#38bdf8" />
            <stop offset="55%"  stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="lg2" x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring — subtle */}
        <circle cx="20" cy="20" r="18.5" stroke="url(#lg1)" strokeWidth="0.6" strokeDasharray="4 2.5" opacity="0.4" />

        {/* Connection lines between nodes */}
        <line x1="10" y1="10" x2="30" y2="10" stroke="url(#lg1)" strokeWidth="1"   opacity="0.5" />
        <line x1="10" y1="10" x2="10" y2="30" stroke="url(#lg1)" strokeWidth="1"   opacity="0.5" />
        <line x1="10" y1="20" x2="30" y2="20" stroke="url(#lg1)" strokeWidth="0.8" opacity="0.35" />
        <line x1="30" y1="10" x2="30" y2="20" stroke="url(#lg1)" strokeWidth="1"   opacity="0.5" />
        <line x1="10" y1="30" x2="30" y2="30" stroke="url(#lg1)" strokeWidth="1"   opacity="0.5" />
        <line x1="20" y1="10" x2="10" y2="30" stroke="url(#lg2)" strokeWidth="0.7" opacity="0.3" />
        <line x1="20" y1="20" x2="30" y2="30" stroke="url(#lg2)" strokeWidth="0.7" opacity="0.3" />

        {/* Nodes */}
        {/* Corner nodes — large */}
        <circle cx="10" cy="10" r="3"   fill="url(#lg1)" filter="url(#glow)" />
        <circle cx="30" cy="10" r="2.5" fill="url(#lg1)" filter="url(#glow)" />
        <circle cx="10" cy="30" r="2.5" fill="url(#lg1)" filter="url(#glow)" />
        <circle cx="30" cy="30" r="3"   fill="url(#lg2)" filter="url(#glow)" />

        {/* Mid nodes */}
        <circle cx="10" cy="20" r="1.8" fill="url(#lg1)" opacity="0.75" />
        <circle cx="30" cy="20" r="1.8" fill="url(#lg2)" opacity="0.75" />
        <circle cx="20" cy="10" r="1.5" fill="url(#lg1)" opacity="0.6" />

        {/* Centre hub — brightest */}
        <circle cx="20" cy="20" r="3.5" fill="url(#lg2)" filter="url(#glow)" />
        <circle cx="20" cy="20" r="1.5" fill="#fff" opacity="0.9" />
      </svg>

      {/* ── Wordmark ── */}
      {showText && (
        <span
          className="font-extrabold tracking-tight leading-none gradient-text"
          style={{ fontSize: size * 0.58 }}
        >
          Co-Lab
        </span>
      )}
    </div>
  );
}
