"use client";
import { useState } from "react";
import { Plus, Upload, Trash2, X } from "lucide-react";
import type { GuestRow } from "@/types/database";

export function GuestsManager({
  eventId,
  initialGuests,
}: {
  eventId: string;
  initialGuests: GuestRow[];
}) {
  const [guests, setGuests] = useState<GuestRow[]>(initialGuests);
  const [showAdd, setShowAdd] = useState(false);
  const [importInfo, setImportInfo] = useState<string | null>(null);

  async function deleteGuest(id: string) {
    if (!confirm("Remove this guest?")) return;
    const res = await fetch(`/api/guests?id=${id}`, { method: "DELETE" });
    if (res.ok) setGuests((gs) => gs.filter((g) => g.id !== id));
  }

  async function addGuest(payload: any) {
    const res = await fetch(`/api/guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, guest: payload }),
    });
    const json = await res.json();
    if (res.ok) {
      setGuests((gs) => [json.guest as GuestRow, ...gs]);
      setShowAdd(false);
    } else alert(json.error ?? "Failed");
  }

  async function importCsv(file: File) {
    const text = await file.text();
    const res = await fetch(`/api/guests/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, csv: text }),
    });
    const json = await res.json();
    if (res.ok) {
      setImportInfo(`${json.inserted ?? 0} imported. ${(json.errors ?? []).length} errors.`);
      const refresh = await fetch(`/api/guests?eventId=${eventId}`);
      const data = await refresh.json();
      setGuests((data.guests ?? []) as GuestRow[]);
    } else {
      setImportInfo(`Import failed: ${json.error}`);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <p className="text-sm text-ink-soft">{guests.length} guests</p>
        <div className="flex gap-2">
          <label className="btn-outline cursor-pointer">
            <Upload size={14} /> Import CSV
            <input type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
          </label>
          <button className="btn-gold" onClick={() => setShowAdd(true)}><Plus size={14} /> Add guest</button>
        </div>
      </div>
      {importInfo && <p className="text-xs text-ink-soft">{importInfo}</p>}

      {guests.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white/70 p-8 text-center text-ink-soft">
          No guests yet. Add manually or import a CSV with columns: <code>name,email,phone,group,language</code>.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {guests.map((g) => (
              <div key={g.id} className="rounded-xl border border-line bg-white/80 p-3 flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{g.name}</p>
                  <p className="text-xs text-ink-mute mt-0.5">{[g.email, g.phone].filter(Boolean).join(" · ")}</p>
                  <p className="text-[11px] text-ink-mute mt-0.5">{g.guest_group} · {g.preferred_language}</p>
                </div>
                <button onClick={() => deleteGuest(g.id)} className="text-maroon-500 p-1"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-line bg-white/80 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-left text-xs text-ink-mute uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email / Phone</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => (
                  <tr key={g.id} className="border-t border-line">
                    <td className="px-4 py-3">{g.name}</td>
                    <td className="px-4 py-3 text-ink-soft">{[g.email, g.phone].filter(Boolean).join(" · ") || <span className="text-ink-mute">—</span>}</td>
                    <td className="px-4 py-3 text-ink-soft">{g.guest_group}</td>
                    <td className="px-4 py-3 text-ink-soft">{g.preferred_language}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteGuest(g.id)} className="text-maroon-500"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showAdd && <AddGuestModal onClose={() => setShowAdd(false)} onSubmit={addGuest} />}
    </div>
  );
}

function AddGuestModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (g: any) => void;
}) {
  const [g, setG] = useState({ name: "", email: "", phone: "", guest_group: "family", preferred_language: "en" });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 backdrop-blur p-4">
      <div className="bg-white rounded-2xl shadow-deep border border-line w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-display text-lg">Add guest</p>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div><label className="label">Name</label><input className="input" value={g.name} onChange={(e) => setG({ ...g, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Email</label><input className="input" value={g.email} onChange={(e) => setG({ ...g, email: e.target.value })} /></div>
            <div><label className="label">Phone</label><input className="input" value={g.phone} onChange={(e) => setG({ ...g, phone: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Group</label><input className="input" value={g.guest_group} onChange={(e) => setG({ ...g, guest_group: e.target.value })} /></div>
            <div>
              <label className="label">Language</label>
              <select className="input" value={g.preferred_language} onChange={(e) => setG({ ...g, preferred_language: e.target.value })}>
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={() => onSubmit(g)} className="btn-gold flex-1">Add</button>
          <button onClick={onClose} className="btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  );
}
