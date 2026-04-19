// ============================================================
//  src/components/Logo.jsx (White Canvas Edition)
// ============================================================

export default function Logo({ size = 36, showText = true, className = '' }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Brutalist SVG Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Co-Lab logo"
      >
        {/* Hard geometric shapes, no gradients, no glow */}
        <rect x="4" y="4" width="32" height="32" fill="var(--ink)" />
        <rect x="12" y="12" width="16" height="16" fill="var(--canvas)" />
        <circle cx="20" cy="20" r="4" fill="var(--section-accent)" />
      </svg>

      {/* Wordmark */}
      {showText && (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: size * 0.58,
            color: 'var(--ink)',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase'
          }}
        >
          Co-Lab
        </span>
      )}
    </div>
  );
}
