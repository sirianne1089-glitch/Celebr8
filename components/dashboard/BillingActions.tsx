"use client";
import { useState } from "react";

export function BillingActions({ currentPlan }: { currentPlan: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start(plan: "starter" | "premium" | "family") {
    setError(null);
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, mode: plan === "family" ? "subscription" : "payment" }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json?.error ?? "Failed");
      window.location.href = json.url;
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <button onClick={() => start("starter")} disabled={loading !== null} className="btn-outline">
        {loading === "starter" ? "Loading..." : "Buy Starter ($4.99)"}
      </button>
      <button onClick={() => start("premium")} disabled={loading !== null} className="btn-gold">
        {loading === "premium" ? "Loading..." : "Buy Premium ($9.99)"}
      </button>
      <button onClick={() => start("family")} disabled={loading !== null} className="btn-primary">
        {loading === "family" ? "Loading..." : "Subscribe to Family ($14.99/mo)"}
      </button>
      {error && <p className="w-full text-sm text-maroon-500 mt-2">{error}</p>}
      <p className="w-full text-[11px] text-ink-mute mt-2">
        Watermark is removed only after Stripe confirms the payment.
        Current plan: <span className="text-ink font-medium capitalize">{currentPlan}</span>
      </p>
    </div>
  );
}
