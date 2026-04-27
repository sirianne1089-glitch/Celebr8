"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Sparkles, Play } from "lucide-react";

/**
 * HeroCinematic — full-screen hero with a layered, video-style scene built
 * from gradients, particles, and 3D floating invitation cards.
 * No video file required; everything renders with CSS + Framer Motion so the
 * page stays fast and dependency-free.
 */
export function HeroCinematic() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Cinematic background layers */}
      <motion.div
        style={{ y: yBg }}
        aria-hidden
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-stage" />
        <div className="absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-gold-200 via-gold-100 to-transparent blur-3xl opacity-70" />
        <div className="absolute -bottom-40 -right-40 w-[55vw] h-[55vw] rounded-full bg-gradient-to-tl from-royal-200 via-royal-100 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] rounded-full bg-gradient-to-r from-maroon-100 via-cream-100 to-teal-soft blur-3xl opacity-50" />
      </motion.div>

      {/* Particle field */}
      <Particles />

      {/* Floating invitation cards */}
      <motion.div style={{ y: yMid }} className="absolute inset-0 pointer-events-none" aria-hidden>
        <FloatingCard
          className="left-[6%] top-[18%] -rotate-[8deg]"
          color="#7F1F2C"
          accent="#F5C04C"
          headline="Wedding"
          name="Aarav & Anika"
          float="float"
        />
        <FloatingCard
          className="right-[8%] top-[12%] rotate-[6deg]"
          color="#392671"
          accent="#F5C04C"
          headline="Gruhapravesam"
          name="Rao Family"
          float="floatAlt"
        />
        <FloatingCard
          className="left-[10%] bottom-[12%] rotate-[5deg]"
          color="#A53743"
          accent="#1D9E75"
          headline="Birthday"
          name="Diya · Turning One"
          float="floatAlt"
        />
        <FloatingCard
          className="right-[6%] bottom-[18%] -rotate-[9deg]"
          color="#1D9E75"
          accent="#F5C04C"
          headline="Sankranti"
          name="The Reddys"
          float="float"
        />
      </motion.div>

      {/* Hero copy */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container pt-28 md:pt-36 pb-24 md:pb-44 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 chip mb-6"
        >
          <Sparkles size={14} className="text-gold-400" />
          <span>Premium · Telugu · English · Hindi</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          className="font-display text-5xl md:text-7xl font-semibold leading-[1.04] tracking-tight"
        >
          Every celebration deserves <br className="hidden md:block" />
          a <span className="shimmer">stunning invite.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-6 text-base md:text-lg text-ink-soft max-w-2xl mx-auto"
        >
          Design premium digital invitations in minutes. Share via WhatsApp, link or QR.
          Track RSVPs in your dashboard. Built for Indian and NRI families.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/templates" className="btn-gold px-7 py-3 text-base">
            Create Your Invite — Free Preview
          </Link>
          <Link href="#how" className="btn-outline px-6 py-3 text-base">
            <Play size={14} /> See How It Works
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-xs text-ink-mute"
        >
          50 premium templates · WhatsApp share · QR codes · RSVP dashboard · Pay only when you publish
        </motion.p>
      </motion.div>

      <ScrollHint />
    </section>
  );
}

function FloatingCard({
  className,
  color,
  accent,
  headline,
  name,
  float,
}: {
  className: string;
  color: string;
  accent: string;
  headline: string;
  name: string;
  float: "float" | "floatAlt";
}) {
  return (
    <div
      className={`absolute hidden md:block w-44 lg:w-52 aspect-[3/4] rounded-2xl shadow-deep border border-white/60 backdrop-blur ${className} animate-${float}`}
      style={{
        background: `linear-gradient(160deg, #FFFCF6, ${accent}33), linear-gradient(135deg, #FFFFFF 0%, ${accent}22 100%)`,
      }}
    >
      <div className="absolute inset-2 rounded-xl border" style={{ borderColor: accent + "55" }} />
      <div className="relative h-full p-5 flex flex-col items-center text-center">
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color }}>
          {headline}
        </span>
        <svg viewBox="0 0 100 14" className="w-16 h-3 mt-2" aria-hidden>
          <path d="M2 7 Q 25 -4, 50 7 T 98 7" fill="none" stroke={accent} strokeWidth="1.4" />
        </svg>
        <p className="font-display text-base lg:text-lg font-semibold mt-2" style={{ color }}>
          {name}
        </p>
        <div className="mt-auto h-px w-12" style={{ background: accent }} />
        <p className="mt-2 text-[10px] opacity-70" style={{ color }}>
          Save the date
        </p>
      </div>
    </div>
  );
}

function Particles() {
  const dots = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {dots.map((_, i) => (
        <span
          key={i}
          className="absolute block rounded-full bg-gold-300/70 animate-sparkle"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            width: `${4 + ((i * 7) % 6)}px`,
            height: `${4 + ((i * 7) % 6)}px`,
            animationDelay: `${(i * 0.18).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}

function ScrollHint() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[10px] text-ink-mute">
      <span className="tracking-[0.3em] uppercase">Scroll</span>
      <span className="block w-px h-8 bg-gradient-to-b from-ink-mute to-transparent" />
    </div>
  );
}
