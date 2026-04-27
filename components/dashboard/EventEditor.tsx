"use client";
import { useMemo, useState } from "react";
import { TemplateRenderer } from "@/lib/template-engine";
import type { EventContentRow, EventRow, Language, TemplateCopy, TemplateRow } from "@/types/database";
import { cn } from "@/lib/utils";
import { Save, Send } from "lucide-react";

const LANGS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "te", label: "తెలుగు" },
  { value: "hi", label: "हिन्दी" },
];

export function EventEditor({
  event,
  content,
  template,
}: {
  event: EventRow;
  content: EventContentRow[];
  template: TemplateRow | null;
}) {
  const [activeLang, setActiveLang] = useState<Language>(event.default_language as Language);
  const [tab, setTab] = useState<"details" | "preview">("details");

  const initialMap: Record<Language, TemplateCopy> = useMemo(() => {
    const base: Record<Language, TemplateCopy> = {
      en: { hostNames: "", headline: "", message: "" },
      te: { hostNames: "", headline: "", message: "" },
      hi: { hostNames: "", headline: "", message: "" },
    };
    for (const c of content) {
      const lang = c.language as Language;
      base[lang] = {
        hostNames: c.host_names ?? "",
        headline: c.headline ?? "",
        message: c.message ?? "",
      };
    }
    return base;
  }, [content]);

  const [form, setForm] = useState({
    title: event.title,
    eventDate: event.event_date ?? "",
    eventTime: (event.event_time ?? "")?.slice(0, 5),
    venueName: event.venue_name ?? "",
    venueAddress: event.venue_address ?? "",
    mapUrl: event.map_url ?? "",
    rsvpDeadline: event.rsvp_deadline ?? "",
    defaultLanguage: event.default_language as Language,
    contentMap: initialMap,
  });
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function setCopy(field: keyof TemplateCopy, v: string) {
    setForm((f) => ({
      ...f,
      contentMap: {
        ...f.contentMap,
        [activeLang]: { ...f.contentMap[activeLang], [field]: v },
      },
    }));
  }

  async function save(publish = false) {
    setSaving(true);
    setErr(null);
    setInfo(null);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          category: event.category,
          defaultLanguage: form.defaultLanguage,
          eventDate: form.eventDate || null,
          eventTime: form.eventTime || null,
          timezone: event.timezone,
          venueName: form.venueName || null,
          venueAddress: form.venueAddress || null,
          mapUrl: form.mapUrl || null,
          rsvpDeadline: form.rsvpDeadline || null,
          content: form.contentMap,
          status: publish ? "published" : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to save");
      setInfo(publish ? "Published. Share your link with guests." : "Saved.");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!template) return <p className="text-ink-soft">Template missing.</p>;
  const copy = form.contentMap[activeLang];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="lg:hidden">
        <div className="grid grid-cols-2 rounded-full border border-line bg-white/80 p-1 text-xs">
          <button className={cn("rounded-full py-2", tab === "details" ? "bg-ink text-cream-50" : "text-ink-soft")} onClick={() => setTab("details")}>Details</button>
          <button className={cn("rounded-full py-2", tab === "preview" ? "bg-ink text-cream-50" : "text-ink-soft")} onClick={() => setTab("preview")}>Preview</button>
        </div>
      </div>

      <section className={cn("space-y-5", tab === "details" ? "block" : "hidden lg:block")}>
        <div className="flex items-center gap-1">
          {LANGS.map((l) => (
            <button
              key={l.value}
              onClick={() => setActiveLang(l.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs border",
                activeLang === l.value ? "bg-ink text-cream-50 border-ink" : "bg-white border-line text-ink-soft",
              )}
            >{l.label}</button>
          ))}
          <span className="ml-auto text-[11px] text-ink-mute">Default: {form.defaultLanguage}</span>
        </div>

        <div>
          <label className="label">Event title (internal)</label>
          <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Host names</label>
            <input className="input" value={copy.hostNames} onChange={(e) => setCopy("hostNames", e.target.value)} />
          </div>
          <div>
            <label className="label">Headline</label>
            <input className="input" value={copy.headline} onChange={(e) => setCopy("headline", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Message</label>
          <textarea rows={3} className="input" value={copy.message} onChange={(e) => setCopy("message", e.target.value)} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="label">Date</label><input type="date" className="input" value={form.eventDate ?? ""} onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))} /></div>
          <div><label className="label">Time</label><input type="time" className="input" value={form.eventTime ?? ""} onChange={(e) => setForm((f) => ({ ...f, eventTime: e.target.value }))} /></div>
        </div>
        <div><label className="label">Venue</label><input className="input" value={form.venueName ?? ""} onChange={(e) => setForm((f) => ({ ...f, venueName: e.target.value }))} /></div>
        <div><label className="label">Address</label><input className="input" value={form.venueAddress ?? ""} onChange={(e) => setForm((f) => ({ ...f, venueAddress: e.target.value }))} /></div>
        <div><label className="label">Map URL</label><input type="url" className="input" value={form.mapUrl ?? ""} onChange={(e) => setForm((f) => ({ ...f, mapUrl: e.target.value }))} /></div>
        <div><label className="label">RSVP deadline (UTC)</label><input type="datetime-local" className="input" value={form.rsvpDeadline ? new Date(form.rsvpDeadline).toISOString().slice(0, 16) : ""} onChange={(e) => setForm((f) => ({ ...f, rsvpDeadline: e.target.value ? new Date(e.target.value).toISOString() : "" }))} /></div>

        <div className="flex gap-2 pt-2">
          <button onClick={() => save(false)} disabled={saving} className="btn-primary flex-1"><Save size={16} /> {saving ? "Saving..." : "Save"}</button>
          <button onClick={() => save(true)} disabled={saving} className="btn-gold flex-1"><Send size={16} /> Publish</button>
        </div>
        {info && <p className="text-sm text-teal">{info}</p>}
        {err && <p className="text-sm text-maroon-500">{err}</p>}
      </section>

      <section className={cn("lg:sticky lg:top-24 lg:h-fit", tab === "preview" ? "block" : "hidden lg:block")}>
        <div className="aspect-[3/4] max-w-md mx-auto">
          <TemplateRenderer
            baseLayout={template.base_layout}
            colors={template.config.colors}
            motif={template.config.motif}
            copy={copy}
            eventDate={form.eventDate}
            eventTime={form.eventTime}
            venueName={form.venueName}
            venueAddress={form.venueAddress}
            language={activeLang}
            watermark={!event.is_watermark_removed}
          />
        </div>
        {!event.is_watermark_removed && (
          <p className="text-center text-xs text-ink-mute mt-3">
            Upgrade to remove the watermark and share with guests.
          </p>
        )}
      </section>
    </div>
  );
}
