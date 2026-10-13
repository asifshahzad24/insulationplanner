export function LogoMark({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="lm-thermal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dc2626" />
          <stop offset=".3" stopColor="#f97316" />
          <stop offset=".5" stopColor="#facc15" />
          <stop offset=".7" stopColor="#22d3ee" />
          <stop offset=".85" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#312e81" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6.5" fill="url(#lm-thermal)" />
      <path d="M5.5 12.2 12 6.5l6.5 5.7V18a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5z" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M8 14.2h8" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
