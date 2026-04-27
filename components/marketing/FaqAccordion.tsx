"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Do I need to pay before I can try it?",
    a: "No. You can browse all 50 templates, customise an invite, switch languages and preview everything for free. Payment is only required when you save, share or remove the watermark.",
  },
  {
    q: "Which languages are supported?",
    a: "Telugu, English and Hindi are supported in every template. Each language can have its own custom invite copy.",
  },
  {
    q: "How does WhatsApp sharing work?",
    a: "Celebr8 generates a public invite link and a one-tap WhatsApp share link. Guests open the invite directly in their browser — no app install required.",
  },
  {
    q: "Can guests RSVP from their phone?",
    a: "Yes. The public invite page is mobile-first with an envelope reveal animation, RSVP form, add-to-calendar and Google Maps directions.",
  },
  {
    q: "What about screenshots?",
    a: "Browsers cannot reliably block screenshots. Celebr8 uses a visible watermark on free previews and removes it after payment, which is the industry-standard approach.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Celebr8 uses Supabase row-level security, encrypted storage, signed Stripe webhooks and never exposes server keys to the browser.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 md:py-28">
      <div className="container max-w-3xl">
        <div className="text-center mb-10">
          <p className="section-eyebrow">Frequently asked</p>
          <h2 className="section-title mt-2">Everything you need to know.</h2>
        </div>
        <div className="rounded-3xl border border-line bg-white/80 backdrop-blur divide-y divide-line">
          {faqs.map((f, i) => (
            <button
              key={f.q}
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left px-5 py-4 md:px-6 md:py-5 flex items-start justify-between gap-3 hover:bg-cream-50 transition"
              aria-expanded={open === i}
            >
              <div className="flex-1">
                <p className="font-semibold text-ink">{f.q}</p>
                <div
                  className={cn(
                    "grid transition-all duration-300",
                    open === i ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]",
                  )}
                >
                  <p className="overflow-hidden text-sm text-ink-soft leading-relaxed">{f.a}</p>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "shrink-0 mt-1 transition-transform",
                  open === i ? "rotate-180 text-gold-500" : "text-ink-mute",
                )}
                size={18}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
