"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const cats = [
  { slug: "wedding",      label: "Weddings",       count: "15 designs", g: "from-maroon-200 via-gold-200 to-cream-100" },
  { slug: "birthday",     label: "Birthdays",      count: "10 designs", g: "from-gold-200 via-cream-100 to-royal-100" },
  { slug: "housewarming", label: "Housewarming",   count: "8 designs",  g: "from-cream-100 via-gold-100 to-maroon-100" },
  { slug: "baby",         label: "Baby Ceremonies",count: "7 designs",  g: "from-royal-100 via-cream-100 to-gold-100" },
  { slug: "festival",     label: "Festivals",      count: "5 designs",  g: "from-teal-soft via-gold-100 to-cream-100" },
  { slug: "corporate",    label: "Corporate",      count: "5 designs",  g: "from-royal-200 via-royal-100 to-cream-100" },
];

export function Categories() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="section-eyebrow">Designed for every occasion</p>
          <h2 className="section-title mt-2">Six categories. Six moods. One Celebr8.</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cats.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                href={`/templates?category=${c.slug}`}
                className="group block rounded-2xl border border-line bg-white/70 backdrop-blur shadow-card hover:shadow-deep transition-all overflow-hidden"
              >
                <div className={`relative aspect-[4/5] bg-gradient-to-br ${c.g}`}>
                  <div className="absolute inset-3 rounded-xl border border-white/40" />
                  <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/85 backdrop-blur px-3 py-2">
                    <p className="font-display text-base md:text-lg font-semibold text-ink">{c.label}</p>
                    <p className="text-[11px] text-ink-mute mt-0.5">{c.count}</p>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] tracking-[0.3em] uppercase font-semibold text-ink/70 bg-white/70 rounded-full px-2 py-1 group-hover:bg-ink group-hover:text-white transition">
                    Browse →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
