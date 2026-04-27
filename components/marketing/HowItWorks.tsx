"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LayoutTemplate, Pencil, Share2, MailCheck, BarChart3 } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: LayoutTemplate,
    title: "Choose a template",
    body:
      "Pick from 50 hand-crafted designs across weddings, birthdays, housewarmings, baby ceremonies, festivals and corporate events.",
    accent: "from-gold-200 to-gold-400",
  },
  {
    n: "02",
    icon: Pencil,
    title: "Customize your invite",
    body:
      "Live preview as you type. Switch effortlessly between Telugu, English and Hindi. Add your photo and venue map.",
    accent: "from-maroon-100 to-maroon-300",
  },
  {
    n: "03",
    icon: Share2,
    title: "Share via link, WhatsApp or QR",
    body:
      "One tap to send. Generate a QR code for printed cards. Track every open without paid messaging APIs.",
    accent: "from-royal-100 to-royal-300",
  },
  {
    n: "04",
    icon: MailCheck,
    title: "Guests RSVP in seconds",
    body:
      "A beautiful mobile-first RSVP page with envelope reveal animation. Add to calendar, view directions, optional message.",
    accent: "from-teal-soft to-teal",
  },
  {
    n: "05",
    icon: BarChart3,
    title: "Track responses in your dashboard",
    body:
      "Real-time counts of accepted, maybe and declined. Export CSV. Reopen RSVP. Never lose a guest in WhatsApp threads again.",
    accent: "from-cream-100 to-gold-200",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how" ref={ref} className="relative py-24 md:py-36">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="section-eyebrow">How Celebr8 works</p>
          <h2 className="section-title mt-2">
            From idea to invite in <span className="shimmer">five smooth steps.</span>
          </h2>
          <p className="mt-4 text-ink-soft">
            A single, premium flow optimised for Indian celebrations and global guest lists.
          </p>
        </div>

        <div className="relative pl-7 md:pl-0">
          {/* Vertical animated progress line */}
          <div className="absolute left-3.5 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-line/80">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-gold-400 via-maroon-400 to-royal-400"
            />
          </div>

          <ol className="space-y-14 md:space-y-24">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const left = i % 2 === 0;
              return (
                <li
                  key={s.n}
                  className={`relative grid md:grid-cols-2 items-center gap-8 md:gap-12 ${
                    left ? "" : "md:[&>*:first-child]:order-2"
                  }`}
                >
                  {/* dot */}
                  <span className="absolute left-3.5 md:left-1/2 md:-translate-x-1/2 top-2 w-3 h-3 rounded-full bg-gold-400 ring-4 ring-cream-100" />

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: "-80px" }}
                    className={`md:max-w-md ${left ? "md:text-right md:ml-auto md:pr-8" : "md:pl-8"}`}
                  >
                    <p className="font-mono text-xs text-gold-500 tracking-widest">{s.n}</p>
                    <h3 className="font-display text-2xl md:text-3xl mt-1 mb-3 text-ink">
                      {s.title}
                    </h3>
                    <p className="text-ink-soft leading-relaxed">{s.body}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 40, rotate: left ? 4 : -4 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true, margin: "-80px" }}
                    className={`relative ${left ? "md:pl-8" : "md:pr-8 md:text-right"}`}
                  >
                    <StepVisual index={i} icon={Icon} accent={s.accent} />
                  </motion.div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function StepVisual({
  index,
  icon: Icon,
  accent,
}: {
  index: number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  // Each step has a different mock invite-style scene
  const variants = [
    () => (
      <div className="glass rounded-2xl p-6 max-w-md md:ml-auto">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, j) => (
            <div
              key={j}
              className={`aspect-[3/4] rounded-lg bg-gradient-to-br ${
                ["from-maroon-100 to-maroon-300", "from-gold-100 to-gold-300", "from-royal-100 to-royal-300", "from-teal-soft to-teal", "from-cream-100 to-gold-200", "from-maroon-200 to-gold-300"][j]
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-mute">50 templates · 6 categories · 3 languages</p>
      </div>
    ),
    () => (
      <div className="glass rounded-2xl p-6 max-w-md md:ml-auto">
        <div className="rounded-xl bg-cream-50 p-5 border border-line">
          <p className="text-[10px] tracking-[0.4em] uppercase text-maroon-500">Wedding Invitation</p>
          <p className="font-display text-xl mt-1">Karthik & Keerthi</p>
          <div className="mt-3 space-y-2">
            <div className="h-2 rounded bg-line w-3/4" />
            <div className="h-2 rounded bg-line w-1/2" />
            <div className="h-2 rounded bg-line w-2/3" />
          </div>
          <div className="mt-4 flex gap-1.5 text-[10px]">
            <span className="chip">English</span>
            <span className="chip">తెలుగు</span>
            <span className="chip">हिन्दी</span>
          </div>
        </div>
      </div>
    ),
    () => (
      <div className="glass rounded-2xl p-6 max-w-md md:ml-auto">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-line p-4 text-center bg-white/70">
            <p className="text-xs font-semibold">Link</p>
            <p className="text-[10px] text-ink-mute mt-1">Copy & paste</p>
          </div>
          <div className="rounded-xl border border-line p-4 text-center bg-white/70">
            <p className="text-xs font-semibold">WhatsApp</p>
            <p className="text-[10px] text-ink-mute mt-1">One tap</p>
          </div>
          <div className="rounded-xl border border-line p-4 text-center bg-white/70">
            <p className="text-xs font-semibold">QR Code</p>
            <p className="text-[10px] text-ink-mute mt-1">Print friendly</p>
          </div>
        </div>
      </div>
    ),
    () => (
      <div className="glass rounded-2xl p-6 max-w-md md:ml-auto">
        <div className="rounded-xl border border-line p-4 bg-white/80">
          <p className="text-xs text-ink-mute">Your RSVP</p>
          <p className="font-display text-lg mt-1">Will you join us?</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <button className="rounded-lg py-2 bg-teal text-white">Accept</button>
            <button className="rounded-lg py-2 bg-cream-100 border border-line">Maybe</button>
            <button className="rounded-lg py-2 bg-cream-100 border border-line">Decline</button>
          </div>
        </div>
      </div>
    ),
    () => (
      <div className="glass rounded-2xl p-6 max-w-md md:ml-auto">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { l: "Accepted", v: "84", c: "text-teal" },
            { l: "Maybe", v: "12", c: "text-gold-500" },
            { l: "Declined", v: "6", c: "text-maroon-500" },
          ].map((m) => (
            <div key={m.l} className="rounded-xl border border-line bg-white/80 p-4">
              <p className={`font-display text-2xl ${m.c}`}>{m.v}</p>
              <p className="text-[10px] mt-1 text-ink-mute uppercase tracking-wider">{m.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 rounded-full bg-line overflow-hidden">
          <div className="h-full w-[78%] bg-gradient-to-r from-teal to-gold-400" />
        </div>
        <p className="mt-2 text-[10px] text-ink-mute">78% of guests responded</p>
      </div>
    ),
  ];
  const Visual = variants[index] ?? variants[0];
  return (
    <div className="relative">
      <div className={`absolute -inset-3 rounded-3xl bg-gradient-to-br ${accent} opacity-30 blur-2xl`} />
      <div className="relative">
        <Visual />
      </div>
    </div>
  );
}
