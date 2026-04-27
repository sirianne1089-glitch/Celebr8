"use client";
import { useState } from "react";
import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "accepted" | "maybe" | "declined";

export function RsvpForm({
  eventCode,
  guestCode,
  rsvpDeadline,
}: {
  eventCode: string;
  guestCode?: string;
  rsvpDeadline?: string | null;
}) {
  const closed = !!rsvpDeadline && new Date(rsvpDeadline).getTime() < Date.now();
  const [status, setStatus] = useState<Status | null>(null);
  const [name, setName] = useState("");
  const [plusOnes, setPlusOnes] = useState(0);
  const [message, setMessage] = useState("");
  const [diet, setDiet] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!status) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventCode,
          guestCode,
          guestName: name,
          status,
          plusOnes,
          message: message || undefined,
          dietaryPreference: diet || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to submit");
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (closed) {
    return (
      <div className="rounded-2xl border border-line bg-white/80 p-6 text-center text-sm text-ink-soft">
        RSVP is closed. Please contact the host directly.
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-teal/30 bg-teal-soft p-6 text-center">
        <p className="font-display text-xl text-teal">Thank you!</p>
        <p className="text-sm text-ink-soft mt-1">Your response has been recorded.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white/85 p-5 space-y-4">
      <p className="font-display text-xl">Will you attend?</p>
      <div className="grid grid-cols-3 gap-2">
        {([
          { v: "accepted", l: "Yes", icon: Check, color: "bg-teal text-white" },
          { v: "maybe", l: "Maybe", icon: HelpCircle, color: "bg-gold-300 text-ink" },
          { v: "declined", l: "No", icon: X, color: "bg-maroon-100 text-maroon-500" },
        ] as { v: Status; l: string; icon: any; color: string }[]).map((o) => {
          const Icon = o.icon;
          const active = status === o.v;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => setStatus(o.v)}
              className={cn(
                "rounded-xl py-3 text-sm font-semibold border transition flex items-center justify-center gap-2",
                active ? `${o.color} border-transparent` : "bg-white border-line text-ink-soft",
              )}
            >
              <Icon size={14} /> {o.l}
            </button>
          );
        })}
      </div>

      <div>
        <label className="label">Your name</label>
        <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Plus ones</label>
          <input
            type="number"
            min={0}
            max={20}
            className="input"
            value={plusOnes}
            onChange={(e) => setPlusOnes(parseInt(e.target.value || "0", 10))}
          />
        </div>
        <div>
          <label className="label">Dietary (optional)</label>
          <input className="input" value={diet} onChange={(e) => setDiet(e.target.value)} placeholder="Vegetarian, Jain..." />
        </div>
      </div>

      <div>
        <label className="label">Message to host (optional)</label>
        <textarea rows={2} className="input" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>

      {error && <p className="text-sm text-maroon-500">{error}</p>}

      <button disabled={!status || submitting || !name} className="btn-gold w-full">
        {submitting ? "Submitting..." : "Submit RSVP"}
      </button>
    </form>
  );
}
