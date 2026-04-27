import Link from "next/link";
import { Check } from "lucide-react";

export const metadata = { title: "Pricing" };

const plans = [
  {
    key: "free",
    name: "Free Preview",
    price: "$0",
    suffix: "to try",
    blurb: "Browse, customise and preview every template.",
    features: ["Browse 50 templates", "Live preview & language switch", "Watermark on previews", "No saving or sharing"],
    cta: { href: "/templates", label: "Try the editor" },
  },
  {
    key: "starter",
    name: "Starter",
    price: "$4.99",
    suffix: "per event",
    blurb: "One simple, beautiful event.",
    features: ["1 event", "Up to 50 guests", "Free templates", "WhatsApp + QR sharing", "Watermark removed"],
    cta: { href: "/auth/signup?plan=starter", label: "Get Starter" },
  },
  {
    key: "premium",
    name: "Premium",
    price: "$9.99",
    suffix: "per event",
    blurb: "All templates, full RSVP dashboard.",
    features: ["1 event", "Up to 250 guests", "All 50 templates", "RSVP dashboard", "CSV import", "Watermark removed"],
    highlight: true,
    cta: { href: "/auth/signup?plan=premium", label: "Get Premium" },
  },
  {
    key: "family",
    name: "Family",
    price: "$14.99",
    suffix: "per month",
    blurb: "Multiple events for the whole family.",
    features: ["5 active events", "Up to 500 guests / month", "All templates", "RSVP dashboard", "CSV import"],
    cta: { href: "/auth/signup?plan=family", label: "Get Family" },
  },
  {
    key: "corporate",
    name: "Corporate",
    price: "Custom",
    suffix: "",
    blurb: "For companies and large gatherings.",
    features: ["Unlimited events", "Custom branding", "Priority support", "Bulk messaging (post-MVP)"],
    cta: { href: "/legal/contact", label: "Contact us" },
  },
];

export default function PricingPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="section-eyebrow">Pricing</p>
        <h1 className="font-display text-4xl md:text-6xl font-semibold mt-2">
          Pay only when you're <span className="shimmer">ready to celebrate.</span>
        </h1>
        <p className="text-ink-soft mt-3">
          Browsing and previewing is always free. Watermark removal happens automatically after a confirmed payment.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {plans.slice(0, 3).map((p) => (
          <PlanCard key={p.key} p={p} />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-5 mt-5">
        {plans.slice(3).map((p) => (
          <PlanCard key={p.key} p={p} />
        ))}
      </div>

      <section className="mt-16 grid md:grid-cols-3 gap-5 text-sm">
        <Faq q="When is the watermark removed?" a="Immediately after Stripe confirms your payment via webhook. We never unlock based on browser redirects." />
        <Faq q="Can I get a refund?" a="See our refund policy — we offer a fair-use refund within 7 days for events that were not yet sent." />
        <Faq q="What about WhatsApp messaging?" a="MVP uses one-tap WhatsApp deep-linking from your phone. Bulk paid messaging is on the post-MVP roadmap." />
      </section>
    </div>
  );
}

function PlanCard({ p }: { p: any }) {
  return (
    <div
      className={`relative rounded-3xl border ${
        p.highlight ? "border-gold-300 shadow-glow bg-cream-50" : "border-line bg-white/80"
      } backdrop-blur p-7 flex flex-col`}
    >
      {p.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 text-ink text-[10px] font-semibold tracking-widest uppercase px-3 py-1 shadow">
          Most popular
        </span>
      )}
      <h3 className="font-display text-xl">{p.name}</h3>
      <p className="text-sm text-ink-soft mt-1">{p.blurb}</p>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="font-display text-4xl">{p.price}</span>
        {p.suffix && <span className="text-xs text-ink-mute">{p.suffix}</span>}
      </div>
      <ul className="mt-5 space-y-2 text-sm flex-1">
        {p.features.map((f: string) => (
          <li key={f} className="flex items-start gap-2 text-ink-soft">
            <Check size={16} className="text-teal mt-0.5 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link href={p.cta.href} className={`mt-6 ${p.highlight ? "btn-gold" : "btn-outline"} w-full text-sm`}>
        {p.cta.label}
      </Link>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5">
      <p className="font-semibold text-ink">{q}</p>
      <p className="text-ink-soft mt-2">{a}</p>
    </div>
  );
}
