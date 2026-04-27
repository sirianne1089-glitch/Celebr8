"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SettingsForm({ initial }: { initial: any }) {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: initial.full_name ?? "",
    email: initial.email ?? "",
    phone: initial.phone ?? "",
    country: initial.country ?? "US",
    default_language: initial.default_language ?? "en",
    timezone: initial.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setInfo(null);
    setErr(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErr("Not signed in");
      setSaving(false);
      return;
    }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...form,
    });
    setSaving(false);
    if (error) setErr(error.message);
    else setInfo("Saved.");
  }

  async function deleteAccount() {
    if (!confirm("Permanently delete your account and all events? This cannot be undone.")) return;
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) {
      await supabase.auth.signOut();
      router.push("/");
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error ?? "Failed to delete account");
    }
  }

  return (
    <form onSubmit={save} className="space-y-4 rounded-2xl border border-line bg-white/80 p-6">
      <div>
        <label className="label">Full name</label>
        <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input" value={form.email} disabled />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label">Phone</label><input className="input" value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label className="label">Country</label><input className="input" value={form.country ?? ""} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Default language</label>
          <select className="input" value={form.default_language} onChange={(e) => setForm({ ...form, default_language: e.target.value })}>
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
        <div>
          <label className="label">Timezone</label>
          <input className="input" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
        </div>
      </div>
      {info && <p className="text-sm text-teal">{info}</p>}
      {err && <p className="text-sm text-maroon-500">{err}</p>}
      <div className="flex gap-3 pt-2">
        <button disabled={saving} className="btn-gold">{saving ? "Saving..." : "Save"}</button>
        <button type="button" onClick={deleteAccount} className="btn-outline text-maroon-500">Delete account</button>
      </div>
    </form>
  );
}
