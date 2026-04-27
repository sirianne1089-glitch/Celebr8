import * as React from "react";
import type { Language, TemplateCopy } from "@/types/database";
import { formatDate, formatTime } from "@/lib/utils";

export type RenderConfig = {
  baseLayout: string;
  colors: { primary: string; accent: string; background: string; text: string };
  motif?: string;
  copy: TemplateCopy;
  eventDate?: string | null;
  eventTime?: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  photoUrl?: string | null;
  language: Language;
  watermark?: boolean;
};

const localeMap: Record<Language, string> = {
  en: "en-US",
  te: "te-IN",
  hi: "hi-IN",
};

function MotifFlourish({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 30" className="w-32 h-6 mx-auto" aria-hidden>
      <path
        d="M2 15 Q 50 -8, 100 15 T 198 15"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
      />
      <circle cx="100" cy="15" r="3" fill={color} />
    </svg>
  );
}

function Watermark({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 grid place-items-center select-none"
      aria-hidden
    >
      <div
        className="rotate-[-22deg] text-3xl md:text-5xl font-display tracking-widest opacity-15"
        style={{ color }}
      >
        Celebr8 · PREVIEW
      </div>
    </div>
  );
}

export function TemplateRenderer(props: RenderConfig) {
  const { baseLayout, colors, copy, language, watermark } = props;
  const dateStr = formatDate(props.eventDate, localeMap[language]);
  const timeStr = formatTime(props.eventTime ?? undefined);

  const Layout = LAYOUTS[baseLayout] ?? LAYOUTS["centered-card"];

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-2xl shadow-deep border border-line"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <Layout
        colors={colors}
        copy={copy}
        dateStr={dateStr}
        timeStr={timeStr}
        venueName={props.venueName ?? undefined}
        venueAddress={props.venueAddress ?? undefined}
        photoUrl={props.photoUrl ?? undefined}
        motif={props.motif}
      />
      {watermark && <Watermark color={colors.primary} />}
    </div>
  );
}

type LayoutProps = {
  colors: { primary: string; accent: string; background: string; text: string };
  copy: TemplateCopy;
  dateStr: string;
  timeStr: string;
  venueName?: string;
  venueAddress?: string;
  photoUrl?: string;
  motif?: string;
};

function CenteredCard({ colors, copy, dateStr, timeStr, venueName, venueAddress }: LayoutProps) {
  return (
    <div className="relative px-6 py-10 md:px-10 md:py-14 text-center">
      <div className="absolute inset-3 border-2 rounded-xl pointer-events-none" style={{ borderColor: colors.accent + "55" }} />
      <p className="text-[11px] tracking-[0.4em] uppercase mb-2" style={{ color: colors.primary }}>
        {copy.headline}
      </p>
      <MotifFlourish color={colors.accent} />
      <h2 className="font-display text-3xl md:text-5xl font-bold mt-3 mb-3" style={{ color: colors.primary }}>
        {copy.hostNames}
      </h2>
      <p className="max-w-md mx-auto leading-relaxed text-sm md:text-base mb-5 opacity-80">
        {copy.message}
      </p>
      {(dateStr || timeStr) && (
        <p className="text-base md:text-lg font-semibold" style={{ color: colors.primary }}>
          {dateStr}
          {timeStr && <span className="opacity-70"> · {timeStr}</span>}
        </p>
      )}
      {(venueName || venueAddress) && (
        <p className="mt-2 text-xs md:text-sm opacity-75">
          {venueName} {venueAddress && <span>· {venueAddress}</span>}
        </p>
      )}
      <MotifFlourish color={colors.accent} />
    </div>
  );
}

function PhotoHero({ colors, copy, dateStr, timeStr, venueName, photoUrl }: LayoutProps) {
  return (
    <div className="grid grid-rows-[1.1fr_1fr] h-full min-h-[360px]">
      <div className="relative" style={{ backgroundColor: colors.primary }}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="invite"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="relative z-10 p-6 h-full flex items-end">
          <p className="text-white/90 text-xs tracking-[0.3em] uppercase">{copy.headline}</p>
        </div>
      </div>
      <div className="px-6 py-8 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
          {copy.hostNames}
        </h2>
        <p className="text-sm md:text-base mb-4 opacity-80">{copy.message}</p>
        {(dateStr || timeStr) && (
          <p className="font-semibold" style={{ color: colors.primary }}>
            {dateStr}
            {timeStr && <span className="opacity-70"> · {timeStr}</span>}
          </p>
        )}
        {venueName && <p className="text-xs opacity-70 mt-1">{venueName}</p>}
      </div>
    </div>
  );
}

function SplitCard(p: LayoutProps) {
  const { colors, copy, dateStr, timeStr, venueName } = p;
  return (
    <div className="grid grid-cols-2 h-full min-h-[360px]">
      <div className="relative" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent)]" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
          <p className="text-[10px] tracking-[0.4em] uppercase opacity-80">{copy.headline}</p>
          <p className="font-display text-2xl md:text-3xl mt-1">{copy.hostNames}</p>
        </div>
      </div>
      <div className="p-6 flex flex-col justify-center">
        <p className="text-sm md:text-base opacity-80 mb-3">{copy.message}</p>
        {(dateStr || timeStr) && (
          <p className="font-semibold text-base" style={{ color: colors.primary }}>
            {dateStr}
            {timeStr && <span className="opacity-70"> · {timeStr}</span>}
          </p>
        )}
        {venueName && <p className="text-xs opacity-70 mt-1">{venueName}</p>}
      </div>
    </div>
  );
}

function MandapFrame({ colors, copy, dateStr, timeStr, venueName }: LayoutProps) {
  return (
    <div className="relative px-6 py-12 text-center">
      <svg viewBox="0 0 400 70" className="w-full max-w-md mx-auto h-12" aria-hidden>
        <path d="M40 65 Q 200 -30, 360 65" fill="none" stroke={colors.accent} strokeWidth="2.5" />
        <path d="M62 65 Q 200 -10, 338 65" fill="none" stroke={colors.primary} strokeWidth="1.5" />
        <circle cx="200" cy="14" r="6" fill={colors.accent} />
      </svg>
      <p className="text-[10px] tracking-[0.4em] uppercase mt-4 mb-1" style={{ color: colors.primary }}>
        {copy.headline}
      </p>
      <h2 className="font-display text-3xl md:text-5xl font-bold mb-2" style={{ color: colors.primary }}>
        {copy.hostNames}
      </h2>
      <p className="max-w-md mx-auto text-sm md:text-base opacity-80 mb-5">{copy.message}</p>
      {(dateStr || timeStr) && (
        <p className="font-semibold" style={{ color: colors.primary }}>
          {dateStr}
          {timeStr && <span className="opacity-70"> · {timeStr}</span>}
        </p>
      )}
      {venueName && <p className="text-xs opacity-70 mt-1">{venueName}</p>}
      <svg viewBox="0 0 400 70" className="w-full max-w-md mx-auto h-12 rotate-180 mt-6" aria-hidden>
        <path d="M40 65 Q 200 -30, 360 65" fill="none" stroke={colors.accent} strokeWidth="2.5" />
      </svg>
    </div>
  );
}

function MinimalLuxe({ colors, copy, dateStr, timeStr, venueName }: LayoutProps) {
  return (
    <div className="relative px-8 py-12 text-center">
      <p className="text-[10px] tracking-[0.5em] uppercase mb-6" style={{ color: colors.accent }}>
        {copy.headline}
      </p>
      <div className="h-px w-16 mx-auto mb-6" style={{ backgroundColor: colors.accent }} />
      <h2 className="font-display italic text-4xl md:text-6xl font-light mb-4" style={{ color: colors.primary }}>
        {copy.hostNames}
      </h2>
      <div className="h-px w-16 mx-auto mb-5" style={{ backgroundColor: colors.accent }} />
      <p className="max-w-sm mx-auto text-sm leading-relaxed opacity-75 mb-6">{copy.message}</p>
      {(dateStr || timeStr) && (
        <p className="font-semibold tracking-wider" style={{ color: colors.primary }}>
          {dateStr} {timeStr && <span className="opacity-70">· {timeStr}</span>}
        </p>
      )}
      {venueName && <p className="text-xs opacity-70 mt-1">{venueName}</p>}
    </div>
  );
}

function FestivalPoster({ colors, copy, dateStr, venueName }: LayoutProps) {
  return (
    <div
      className="relative px-6 py-10 text-center min-h-[360px]"
      style={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
      }}
    >
      <div className="absolute inset-3 border-2 border-white/30 rounded-xl pointer-events-none" />
      <p className="text-[10px] tracking-[0.4em] uppercase text-white/80 mb-2">{copy.headline}</p>
      <h2 className="font-display text-4xl md:text-6xl font-extrabold text-white mb-3 drop-shadow">
        {copy.hostNames}
      </h2>
      <p className="max-w-md mx-auto text-white/90 mb-5">{copy.message}</p>
      {dateStr && <p className="text-white font-semibold">{dateStr}</p>}
      {venueName && <p className="text-white/80 text-xs mt-1">{venueName}</p>}
    </div>
  );
}

function KidsPlayful({ colors, copy, dateStr, timeStr, venueName }: LayoutProps) {
  return (
    <div className="relative px-6 py-10 text-center">
      <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full" style={{ backgroundColor: colors.accent + "55" }} />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full" style={{ backgroundColor: colors.primary + "44" }} />
      <p className="relative text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: colors.primary }}>
        {copy.headline}
      </p>
      <h2 className="relative font-display text-4xl md:text-5xl font-extrabold mb-3" style={{ color: colors.primary }}>
        {copy.hostNames}
      </h2>
      <p className="relative max-w-md mx-auto opacity-80 mb-5">{copy.message}</p>
      {(dateStr || timeStr) && (
        <p className="relative font-bold" style={{ color: colors.primary }}>
          {dateStr} {timeStr && <span className="opacity-70">· {timeStr}</span>}
        </p>
      )}
      {venueName && <p className="relative text-xs opacity-70 mt-1">{venueName}</p>}
    </div>
  );
}

function CorporateClean({ colors, copy, dateStr, timeStr, venueName }: LayoutProps) {
  return (
    <div className="relative px-8 py-10 text-left">
      <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: colors.accent }}>
        {copy.headline}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-3" style={{ color: colors.primary }}>
        {copy.hostNames}
      </h2>
      <p className="text-sm md:text-base opacity-80 mb-6">{copy.message}</p>
      <div className="h-px w-full" style={{ backgroundColor: colors.accent }} />
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="opacity-60 text-xs uppercase tracking-wider">When</p>
          <p className="font-semibold" style={{ color: colors.primary }}>
            {dateStr} {timeStr}
          </p>
        </div>
        <div>
          <p className="opacity-60 text-xs uppercase tracking-wider">Where</p>
          <p className="font-semibold" style={{ color: colors.primary }}>
            {venueName ?? "TBA"}
          </p>
        </div>
      </div>
    </div>
  );
}

function TempleArch({ colors, copy, dateStr, timeStr, venueName }: LayoutProps) {
  return (
    <div className="relative px-6 py-10 text-center">
      <svg viewBox="0 0 400 200" className="w-full max-w-sm mx-auto h-44" aria-hidden>
        <path
          d="M40 200 L 40 80 Q 200 -60, 360 80 L 360 200"
          fill="none"
          stroke={colors.accent}
          strokeWidth="3"
        />
        <path
          d="M70 200 L 70 95 Q 200 -30, 330 95 L 330 200"
          fill="none"
          stroke={colors.primary}
          strokeWidth="1.5"
        />
        <circle cx="200" cy="40" r="8" fill={colors.accent} />
      </svg>
      <p className="text-[10px] tracking-[0.4em] uppercase mt-3 mb-1" style={{ color: colors.primary }}>
        {copy.headline}
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ color: colors.primary }}>
        {copy.hostNames}
      </h2>
      <p className="max-w-md mx-auto text-sm opacity-80 mb-4">{copy.message}</p>
      {(dateStr || timeStr) && (
        <p className="font-semibold" style={{ color: colors.primary }}>
          {dateStr} {timeStr && <span className="opacity-70">· {timeStr}</span>}
        </p>
      )}
      {venueName && <p className="text-xs opacity-70 mt-1">{venueName}</p>}
    </div>
  );
}

function FloralFrame({ colors, copy, dateStr, timeStr, venueName }: LayoutProps) {
  return (
    <div className="relative px-8 py-12 text-center">
      {[
        "top-2 left-2",
        "top-2 right-2 rotate-90",
        "bottom-2 left-2 -rotate-90",
        "bottom-2 right-2 rotate-180",
      ].map((pos) => (
        <svg key={pos} viewBox="0 0 80 80" className={`absolute ${pos} w-16 h-16 opacity-70`} aria-hidden>
          <circle cx="20" cy="20" r="6" fill={colors.accent} />
          <circle cx="35" cy="12" r="4" fill={colors.primary} />
          <circle cx="14" cy="38" r="4" fill={colors.primary} />
          <path d="M25 25 Q 45 0, 78 18" fill="none" stroke={colors.accent} strokeWidth="1.5" />
        </svg>
      ))}
      <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: colors.primary }}>
        {copy.headline}
      </p>
      <h2 className="font-display text-3xl md:text-5xl font-bold mb-3" style={{ color: colors.primary }}>
        {copy.hostNames}
      </h2>
      <p className="max-w-md mx-auto text-sm md:text-base opacity-80 mb-5">{copy.message}</p>
      {(dateStr || timeStr) && (
        <p className="font-semibold" style={{ color: colors.primary }}>
          {dateStr} {timeStr && <span className="opacity-70">· {timeStr}</span>}
        </p>
      )}
      {venueName && <p className="text-xs opacity-70 mt-1">{venueName}</p>}
    </div>
  );
}

const LAYOUTS: Record<string, React.FC<LayoutProps>> = {
  "centered-card": CenteredCard,
  "photo-hero": PhotoHero,
  "split-card": SplitCard,
  "mandap-frame": MandapFrame,
  "minimal-luxe": MinimalLuxe,
  "festival-poster": FestivalPoster,
  "kids-playful": KidsPlayful,
  "corporate-clean": CorporateClean,
  "temple-arch": TempleArch,
  "floral-frame": FloralFrame,
};
