export function Logo({ className = 'h-9 w-9', id = 'mareura-logo' }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label="Mareura">
      <defs>
        <linearGradient id={id} x1="16" y1="24" x2="84" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="0.5" stopColor="#06B6D4" />
          <stop offset="1" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      <path d="M22 79 L22 30 L50 60 L78 30 L78 79" fill="none" stroke={`url(#${id})`}
        strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
