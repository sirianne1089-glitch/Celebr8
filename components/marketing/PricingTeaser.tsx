"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Starter",
    price: "$4.99",
    suffix: "per event",
    blurb: "One beautiful event with a clean shareable link.",
    features: ["1 event", "50 guests", "Free templates", "QR + WhatsApp share", "Watermark removed"],
    cta: "/pricing",
  },
  {
    name: "Premium",
    price: "$9.99",
    suffix: "per event",
    blurb: "All templates, full RSVP dashboard, CSV import.",
    features: ["1 event", "250 guests", "All 50 templates", "RSVP dashboard", "CSV import", "Watermark removed"],
    highlight: true,
    cta: "/pricing",
  },
  {
    name: "Family",
    price: "$14.99",
    suffix: "per month",
    blurb: "Run multiple events for the whole family.",
    features: ["5 active events", "500 guests/month", "All templates", "RSVP dashboard", "CSV import"],
    cta: "/pricing",
  },
];

export function PricingTeaser() {
  return (
    <section className="py-20 md:py-28 bg-stage">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-eyebrow">Simple, fair pricing</p>
          <h2 className="section-title mt-2">Pay only when you're ready to publish.</h2>
          <p className="mt-3 text-ink-soft">
            Browse, preview and customise for free. You only pay to remove the watermark and share.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`relative rounded-3xl border ${
                t.highlight ? "border-gold-300 shadow-glow" : "border-line"
              } bg-white/80 backdrop-blur p-6 md:p-8 flex flex-col`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 text-ink text-[10px] font-semibold tracking-widest uppercase px-3 py-1 shadow">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl text-ink">{t.name}</h3>
              <p className="text-sm text-ink-soft mt-1">{t.blurb}</p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-4xl text-ink">{t.price}</span>
                <span className="text-xs text-ink-mute">{t.suffix}</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-ink-soft">
                    <Check size={16} className="text-teal mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={t.cta}
                className={`mt-6 ${t.highlight ? "btn-gold" : "btn-outline"} w-full text-sm`}
              >
                See full pricing
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
