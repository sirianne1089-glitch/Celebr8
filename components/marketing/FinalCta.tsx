"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[28px] border border-line bg-gradient-to-br from-maroon-500 via-maroon-400 to-gold-500 p-10 md:p-16 text-center text-cream-50 shadow-deep"
        >
          <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-gold-300/30 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] rounded-full bg-royal-400/30 blur-3xl" />
          <div className="relative z-10">
            <p className="text-[11px] tracking-[0.4em] uppercase text-cream-100/80">
              Ready when you are
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-semibold mt-3">
              Make every guest feel <span className="italic">honoured.</span>
            </h2>
            <p className="mt-4 text-cream-100/90 max-w-xl mx-auto">
              Try the editor for free. Pay only when you publish. Share to anyone, anywhere.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-full bg-cream-50 text-ink px-7 py-3 text-base font-semibold hover:shadow-glow transition"
              >
                Start creating
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-cream-100/60 text-cream-50 px-6 py-3 text-base font-semibold hover:bg-white/10 transition"
              >
                See pricing
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
