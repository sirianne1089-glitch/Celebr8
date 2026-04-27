"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { TemplateRenderer } from "@/lib/template-engine";
import type { TemplateRow, Language } from "@/types/database";
import { Crown } from "lucide-react";

export function TemplateCard({
  t,
  language = "en",
}: {
  t: TemplateRow;
  language?: Language;
}) {
  const copy = t.default_copy?.[language] ?? t.default_copy?.en ?? {
    hostNames: t.name,
    headline: t.category,
    message: "",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="group"
    >
      <Link
        href={`/templates/${t.slug}`}
        className="block rounded-2xl border border-line bg-white/70 backdrop-blur shadow-card overflow-hidden hover:shadow-deep transition-all"
      >
        <div className="relative aspect-[3/4]">
          <div className="absolute inset-0">
            <TemplateRenderer
              baseLayout={t.base_layout}
              colors={t.config?.colors ?? { primary: "#15131A", accent: "#C68A12", background: "#FFF8EC", text: "#15131A" }}
              motif={t.config?.motif}
              copy={copy}
              language={language}
            />
          </div>
          {t.is_premium && (
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-ink text-cream-50 text-[10px] tracking-widest uppercase px-2.5 py-1">
              <Crown size={10} /> Premium
            </span>
          )}
          <span className="absolute top-2 right-2 rounded-full bg-white/90 text-ink text-[10px] uppercase tracking-widest px-2.5 py-1 capitalize">
            {t.category}
          </span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <p className="font-medium text-sm text-ink">{t.name}</p>
          <span className="text-[11px] text-ink-mute group-hover:text-ink transition">Preview →</span>
        </div>
      </Link>
    </motion.div>
  );
}
