export function Logo({ className = 'h-9 w-9', id = 'storepilot-logo' }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="48" x2="48" y2="0">
          <stop offset="0" stopColor="#22C55E" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <path d="M12 33c0-7 4-11 11-11" fill="none" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
      <path d="M14 15l10 12 8-16" fill="none" stroke={`url(#${id})`} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 11l5 1-1 5" fill="none" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
