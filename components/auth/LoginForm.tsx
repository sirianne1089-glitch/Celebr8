"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(next ?? "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email" type="email" required autoComplete="email"
          className="input" value={email} onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password" type="password" required autoComplete="current-password"
          className="input" value={password} onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-maroon-500">{error}</p>}
      <button disabled={loading} className="btn-primary w-full">{loading ? "Logging in..." : "Login"}</button>
      <div className="flex items-center justify-between text-xs">
        <Link href="/auth/reset" className="text-ink-soft hover:text-ink">Forgot password?</Link>
      </div>
    </form>
  );
}
