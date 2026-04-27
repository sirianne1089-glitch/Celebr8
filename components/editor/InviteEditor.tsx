"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateRenderer } from "@/lib/template-engine";
import type { Language, TemplateCopy, TemplateRow } from "@/types/database";
import type { DraftInvite } from "@/types/app";
import { cn } from "@/lib/utils";
import { Save, Eye, Languages } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DRAFT_KEY = "celebr8.draft.v1";

const LANGS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "te", label: "తెలుగు" },
  { value: "hi", label: "हिन्दी" },
];

type Props = {
  template: TemplateRow;
  initialDraft?: Partial<DraftInvite>;
  isAuthed?: boolean;
};

export function InviteEditor({ template, initialDraft, isAuthed }: Props) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState<Language>("en");
  const [tab, setTab] = useState<"details" | "preview">("details");
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialContent: Record<Language, TemplateCopy> = useMemo(() => ({
    en: template.default_copy.en ?? { hostNames: "", headline: "", message: "" },
    te: template.default_copy.te ?? { hostNames: "", headline: "", message: "" },
    hi: template.default_copy.hi ?? { hostNames: "", headline: "", message: "" },
  }), [template]);

  const [draft, setDraft] = useState<DraftInvite>(() => ({
    templateId: template.id,
    templateSlug: template.slug,
    title: initialDraft?.title ?? template.default_copy.en?.hostNames ?? template.name,
    category: template.category,
    defaultLanguage: initialDraft?.defaultLanguage ?? "en",
    eventDate: initialDraft?.eventDate ?? "",
    eventTime: initialDraft?.eventTime ?? "",
    timezone: initialDraft?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    venueName: initialDraft?.venueName ?? "",
    venueAddress: initialDraft?.venueAddress ?? "",
    mapUrl: initialDraft?.mapUrl ?? "",
    rsvpDeadline: initialDraft?.rsvpDeadline ?? "",
    content: initialDraft?.content ?? initialContent,
    photoUrl: initialDraft?.photoUrl ?? "",
  }));

  // Load any prior local draft (try-before-login)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DraftInvite;
        if (parsed.templateId === template.id) {
          setDraft((d) => ({ ...d, ...parsed, content: { ...d.content, ...parsed.content } }));
        }
      }
    } catch {}
  }, [template.id]);

  // Persist draft locally
  useEffect(() => {
    try { window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch {}
  }, [draft]);

  const copy = draft.content[activeLang] ?? initialContent[activeLang];

  function setCopyField(field: keyof TemplateCopy, value: string) {
    setDraft((d) => ({
      ...d,
      content: {
        ...d.content,
        [activeLang]: { ...(d.content[activeLang] ?? initialContent[activeLang]), [field]: value },
      },
    }));
  }

  async function onSave() {
    setError(null);
    if (!isAuthed) {
      setShowAuthGate(true);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: draft.templateId,
          title: draft.title,
          category: draft.category,
          defaultLanguage: draft.defaultLanguage,
          eventDate: draft.eventDate || null,
          eventTime: draft.eventTime || null,
          timezone: draft.timezone,
          venueName: draft.venueName || null,
          venueAddress: draft.venueAddress || null,
          mapUrl: draft.mapUrl || null,
          rsvpDeadline: draft.rsvpDeadline || null,
          content: draft.content,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to save");
      window.localStorage.removeItem(DRAFT_KEY);
      router.push(`/dashboard/events/${json.eventId}/editor`);
    } catch (e: any) {
      setError(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Tab nav for mobile */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 rounded-full border border-line bg-white/80 p-1 text-xs">
          <button
            onClick={() => setTab("details")}
            className={cn("rounded-full py-2", tab === "details" ? "bg-ink text-cream-50" : "text-ink-soft")}
          >Details</button>
          <button
            onClick={() => setTab("preview")}
            className={cn("rounded-full py-2", tab === "preview" ? "bg-ink text-cream-50" : "text-ink-soft")}
          >Preview</button>
        </div>
      </div>

      {/* Form */}
      <section className={cn("space-y-5", tab === "details" ? "block" : "hidden lg:block")}>
        <div className="flex items-center gap-2">
          <Languages size={14} className="text-gold-500" />
          <span className="text-xs text-ink-mute uppercase tracking-widest">Language</span>
          <div className="flex items-center gap-1">
            {LANGS.map((l) => (
              <button
                key={l.value}
                onClick={() => setActiveLang(l.value)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs border transition",
                  activeLang === l.value
                    ? "bg-ink text-cream-50 border-ink"
                    : "bg-white border-line text-ink-soft",
                )}
              >{l.label}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Event title (internal)</label>
          <input
            className="input"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="My event title"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Host names</label>
            <input
              className="input"
              value={copy.hostNames}
              onChange={(e) => setCopyField("hostNames", e.target.value)}
              placeholder="Aarav & Anika"
            />
          </div>
          <div>
            <label className="label">Headline</label>
            <input
              className="input"
              value={copy.headline}
              onChange={(e) => setCopyField("headline", e.target.value)}
              placeholder="Wedding Invitation"
            />
          </div>
        </div>

        <div>
          <label className="label">Message</label>
          <textarea
            rows={3}
            className="input"
            value={copy.message}
            onChange={(e) => setCopyField("message", e.target.value)}
            placeholder="Together with our families, we invite you..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input"
              value={draft.eventDate ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, eventDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Time</label>
            <input
              type="time"
              className="input"
              value={draft.eventTime ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, eventTime: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="label">Venue</label>
          <input
            className="input"
            value={draft.venueName ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, venueName: e.target.value }))}
            placeholder="Grand Hall"
          />
        </div>
        <div>
          <label className="label">Address</label>
          <input
            className="input"
            value={draft.venueAddress ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, venueAddress: e.target.value }))}
            placeholder="123 Main St, City"
          />
        </div>
        <div>
          <label className="label">Google Maps URL (optional)</label>
          <input
            type="url"
            className="input"
            value={draft.mapUrl ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, mapUrl: e.target.value }))}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="btn-gold flex-1"
          >
            <Save size={16} /> {saving ? "Saving..." : isAuthed ? "Save event" : "Save · Sign up"}
          </button>
          <button onClick={() => setTab("preview")} className="btn-outline lg:hidden">
            <Eye size={16} /> Preview
          </button>
        </div>

        {error && <p className="text-sm text-maroon-500">{error}</p>}

        {!isAuthed && (
          <p className="text-xs text-ink-mute">
            Your draft is saved locally. Create an account to save it permanently and share with guests.
          </p>
        )}
      </section>

      {/* Preview */}
      <section className={cn("lg:sticky lg:top-24 lg:h-fit", tab === "preview" ? "block" : "hidden lg:block")}>
        <div className="aspect-[3/4] max-w-md mx-auto">
          <TemplateRenderer
            baseLayout={template.base_layout}
            colors={template.config.colors}
            motif={template.config.motif}
            copy={copy}
            eventDate={draft.eventDate}
            eventTime={draft.eventTime}
            venueName={draft.venueName}
            venueAddress={draft.venueAddress}
            language={activeLang}
            watermark
          />
        </div>
        <p className="text-center text-xs text-ink-mute mt-3">
          Watermark is removed after publishing on a paid plan.
        </p>
      </section>

      {showAuthGate && <AuthGate onClose={() => setShowAuthGate(false)} />}
    </div>
  );
}

function AuthGate({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 backdrop-blur p-4">
      <div className="bg-white rounded-2xl shadow-deep w-full max-w-md p-6 border border-line">
        <h3 className="font-display text-xl">Save your invite</h3>
        <p className="text-sm text-ink-soft mt-2">
          Your customisation is saved on this device. Create a free account to save it
          permanently, share with guests and track RSVPs.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <a className="btn-gold" href="/auth/signup?next=/editor">Create account</a>
          <a className="btn-outline" href="/auth/login?next=/editor">Login</a>
          <button onClick={onClose} className="btn-ghost text-xs mt-2">Keep editing</button>
        </div>
      </div>
    </div>
  );
}
