"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateRenderer } from "@/lib/template-engine";
import type { Language, TemplateCopy } from "@/types/database";
import type { PublicEvent } from "@/types/app";
import { RsvpForm } from "@/components/invite/RsvpForm";
import { Calendar, Map as MapIcon, Languages } from "lucide-react";
import { buildCalendarLink, cn, formatDate, formatTime } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

const LANGS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "te", label: "తెలుగు" },
  { value: "hi", label: "हिन्दी" },
];

export function PublicInvite({
  event,
  guestCode,
}: {
  event: PublicEvent & { isPreviewOnly?: boolean };
  guestCode?: string;
}) {
  const [language, setLanguage] = useState<Language>(event.defaultLanguage);
  const [opened, setOpened] = useState(false);
  const copyForLang = (event.content as Record<string, TemplateCopy>)[language] ??
    (event.content as Record<string, TemplateCopy>)[event.defaultLanguage] ??
    { hostNames: event.title, headline: event.category, message: "" };

  useEffect(() => {
    const t = setTimeout(() => setOpened(true), 500);
    return () => clearTimeout(t);
  }, []);

  const tpl = event.template;
  const showWatermark = !event.isWatermarkRemoved;

  const calStart = event.eventDate
    ? new Date(`${event.eventDate}T${event.eventTime ?? "10:00"}:00`)
    : null;
  const calLink = calStart
    ? buildCalendarLink({
        title: event.title,
        description: copyForLang.message ?? "",
        location: [event.venueName, event.venueAddress].filter(Boolean).join(", "),
        start: calStart,
      })
    : null;

  return (
    <div className="min-h-[100svh] bg-stage relative overflow-hidden">
      {/* Top brand bar */}
      <header className="container py-4 flex items-center justify-between">
        <Logo className="h-7 w-auto" />
        <div className="flex items-center gap-1 text-xs">
          <Languages size={12} className="text-ink-mute mr-1" />
          {LANGS.map((l) => (
            <button
              key={l.value}
              onClick={() => setLanguage(l.value)}
              className={cn(
                "rounded-full px-2.5 py-1 border",
                language === l.value
                  ? "bg-ink text-cream-50 border-ink"
                  : "bg-white border-line text-ink-soft",
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      <main className="container max-w-md mx-auto pb-12">
        {/* Envelope reveal */}
        <AnimatePresence>
          {!opened && (
            <motion.div
              key="envelope"
              initial={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -30 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-10 grid place-items-center bg-stage/95 backdrop-blur"
            >
              <div className="text-center">
                <div className="relative mx-auto w-56 h-40 rounded-xl shadow-deep" style={{ background: "linear-gradient(135deg, #7F1F2C, #C68A12)" }}>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute inset-0 origin-top"
                    style={{ background: "linear-gradient(135deg, #5A1320, #7F1F2C)" }}
                  />
                  <div className="absolute inset-0 grid place-items-center text-cream-50 text-sm tracking-[0.4em] uppercase">
                    Opening...
                  </div>
                </div>
                <p className="mt-4 text-xs text-ink-mute tracking-widest uppercase">A Celebr8 invitation</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {tpl ? (
            <div className="aspect-[3/4]">
              <TemplateRenderer
                baseLayout={tpl.baseLayout}
                colors={tpl.config.colors}
                motif={tpl.config.motif}
                copy={copyForLang}
                eventDate={event.eventDate}
                eventTime={event.eventTime}
                venueName={event.venueName}
                venueAddress={event.venueAddress}
                language={language}
                watermark={showWatermark}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-white/80 p-8 text-center">
              <h1 className="font-display text-3xl">{event.title}</h1>
            </div>
          )}

          <div className="mt-5 space-y-3 text-sm">
            {(event.eventDate || event.eventTime) && (
              <div className="rounded-xl border border-line bg-white/80 p-4 flex items-center gap-3">
                <Calendar size={18} className="text-gold-500" />
                <div>
                  <p className="font-semibold">{formatDate(event.eventDate)}</p>
                  <p className="text-ink-mute text-xs">{formatTime(event.eventTime ?? null)}</p>
                </div>
                {calLink && (
                  <a href={calLink} target="_blank" rel="noopener" className="ml-auto btn-outline text-xs">
                    Add to calendar
                  </a>
                )}
              </div>
            )}
            {(event.venueName || event.venueAddress) && (
              <div className="rounded-xl border border-line bg-white/80 p-4 flex items-center gap-3">
                <MapIcon size={18} className="text-gold-500" />
                <div className="flex-1">
                  <p className="font-semibold">{event.venueName}</p>
                  <p className="text-ink-mute text-xs">{event.venueAddress}</p>
                </div>
                {event.mapUrl && (
                  <a href={event.mapUrl} target="_blank" rel="noopener" className="btn-outline text-xs">
                    Directions
                  </a>
                )}
              </div>
            )}
          </div>

          {event.isPreviewOnly ? (
            <div className="mt-6 rounded-xl border border-gold-300 bg-cream-100 p-4 text-sm text-ink-soft">
              This invite is in preview. The host hasn't published it yet.
            </div>
          ) : (
            <div className="mt-8">
              <RsvpForm
                eventCode={event.inviteCode}
                guestCode={guestCode}
                rsvpDeadline={event.rsvpDeadline}
              />
            </div>
          )}
        </motion.div>
      </main>

      <footer className="container max-w-md mx-auto pb-8 text-center text-[11px] text-ink-mute">
        <p>Created with <a href="/" className="underline">Celebr8</a></p>
      </footer>
    </div>
  );
}
