"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ResetForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    setLoading(false);
    if (error) setError(error.message);
    else setInfo("If that email exists, a recovery link is on its way.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {error && <p className="text-sm text-maroon-500">{error}</p>}
      {info && <p className="text-sm text-teal">{info}</p>}
      <button disabled={loading} className="btn-primary w-full">{loading ? "Sending..." : "Send recovery email"}</button>
    </form>
  );
}
