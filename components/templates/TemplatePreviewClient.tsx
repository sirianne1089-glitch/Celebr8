"use client";
import { useState } from "react";
import { TemplateRenderer } from "@/lib/template-engine";
import type { Language, TemplateRow } from "@/types/database";
import { cn } from "@/lib/utils";

const LANGS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "te", label: "తెలుగు" },
  { value: "hi", label: "हिन्दी" },
];

export function TemplatePreviewClient({ template }: { template: TemplateRow }) {
  const [lang, setLang] = useState<Language>(
    (template.supported_languages?.[0] as Language) ?? "en",
  );
  const copy = template.default_copy?.[lang] ?? template.default_copy?.en;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {LANGS.filter((l) => template.supported_languages.includes(l.value)).map((l) => (
          <button
            key={l.value}
            onClick={() => setLang(l.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs border transition",
              lang === l.value
                ? "bg-ink text-cream-50 border-ink"
                : "bg-white/70 border-line text-ink-soft hover:bg-white",
            )}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="aspect-[3/4] max-w-md mx-auto">
        <TemplateRenderer
          baseLayout={template.base_layout}
          colors={template.config.colors}
          motif={template.config.motif}
          copy={copy ?? { hostNames: template.name, headline: template.category, message: "" }}
          language={lang}
          watermark
        />
      </div>
    </div>
  );
}
