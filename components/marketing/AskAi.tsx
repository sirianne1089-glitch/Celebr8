"use client";
import { useState } from "react";
import { MessageSquareMore, Send } from "lucide-react";

export function AskAi() {
  const [q, setQ] = useState("");
  const [a, setA] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
      setA(data.answer);
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white/80 backdrop-blur p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <MessageSquareMore size={16} className="text-gold-500" />
        Ask the Celebr8 assistant
      </div>
      <p className="text-xs text-ink-mute mt-1">
        Answers questions about Celebr8 features, pricing, sharing and templates.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          className="input"
          placeholder="How does WhatsApp sharing work?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
        />
        <button onClick={ask} disabled={loading} className="btn-gold flex-shrink-0">
          <Send size={16} />
        </button>
      </div>
      {error && <p className="mt-3 text-xs text-maroon-500">{error}</p>}
      {a && (
        <div className="mt-4 rounded-xl border border-line bg-cream-50 p-4 text-sm text-ink-soft whitespace-pre-wrap">
          {a}
        </div>
      )}
    </div>
  );
}
