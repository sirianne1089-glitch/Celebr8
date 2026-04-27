import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 56"
      role="img"
      aria-label="Celebr8"
      className={cn("h-8 w-auto", className)}
    >
      <defs>
        <linearGradient id="celebr8-mark-c" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7F1F2C" />
          <stop offset="55%" stopColor="#C68A12" />
          <stop offset="100%" stopColor="#F5C04C" />
        </linearGradient>
        <linearGradient id="celebr8-num-c" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C68A12" />
          <stop offset="100%" stopColor="#7F1F2C" />
        </linearGradient>
      </defs>
      <g>
        <circle cx="28" cy="28" r="22" fill="none" stroke="url(#celebr8-mark-c)" strokeWidth="2.5" />
        <path d="M18 30 Q 28 14, 38 30" fill="none" stroke="url(#celebr8-mark-c)" strokeWidth="2" />
        <circle cx="28" cy="20" r="2.4" fill="#F5C04C" />
        <circle cx="20" cy="28" r="1.6" fill="#C68A12" />
        <circle cx="36" cy="28" r="1.6" fill="#C68A12" />
        <circle cx="28" cy="36" r="1.6" fill="#7F1F2C" />
      </g>
      <g fontFamily="'Fraunces','Cormorant Garamond',Georgia,serif" fontWeight={700}>
        <text x="60" y="36" fontSize="26" fill="#15131A" letterSpacing="0.5">
          Celebr
        </text>
        <text x="170" y="36" fontSize="26" fill="url(#celebr8-num-c)" letterSpacing="0.5">
          8
        </text>
      </g>
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" className={cn("h-8 w-auto", className)} aria-label="Celebr8 mark">
      <defs>
        <linearGradient id="m1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7F1F2C" />
          <stop offset="55%" stopColor="#C68A12" />
          <stop offset="100%" stopColor="#F5C04C" />
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="22" fill="none" stroke="url(#m1)" strokeWidth="2.5" />
      <path d="M18 30 Q 28 14, 38 30" fill="none" stroke="url(#m1)" strokeWidth="2" />
      <circle cx="28" cy="20" r="2.4" fill="#F5C04C" />
      <circle cx="20" cy="28" r="1.6" fill="#C68A12" />
      <circle cx="36" cy="28" r="1.6" fill="#C68A12" />
      <circle cx="28" cy="36" r="1.6" fill="#7F1F2C" />
    </svg>
  );
}
