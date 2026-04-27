import { redirect } from "next/navigation";
import { createClient, requireUser } from "@/lib/supabase/server";
import type { RsvpRow } from "@/types/database";
import { Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RsvpPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const supabase = createClient();
  const { data: ev } = await supabase.from("events").select("id,user_id,title").eq("id", params.id).maybeSingle();
  if (!ev || ev.user_id !== user.id) redirect("/dashboard");
  const { data: rsvps } = await supabase
    .from("rsvps").select("*").eq("event_id", params.id).order("submitted_at", { ascending: false });
  const list = (rsvps ?? []) as RsvpRow[];
  const accepted = list.filter((r) => r.status === "accepted").length;
  const maybe = list.filter((r) => r.status === "maybe").length;
  const declined = list.filter((r) => r.status === "declined").length;
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Accepted" value={accepted} accent="text-teal" />
        <Stat label="Maybe" value={maybe} accent="text-gold-500" />
        <Stat label="Declined" value={declined} accent="text-maroon-500" />
      </div>
      <div className="flex justify-end">
        <a href={`/api/export/rsvps?eventId=${params.id}`} className="btn-outline text-sm"><Download size={14} /> Export CSV</a>
      </div>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white/70 p-8 text-center text-ink-soft">
          No RSVPs yet. Share your invite to start collecting responses.
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-left text-xs text-ink-mute uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Plus ones</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-t border-line">
                  <td className="px-4 py-3">{r.guest_name}</td>
                  <td className="px-4 py-3"><Badge status={r.status} /></td>
                  <td className="px-4 py-3">{r.plus_ones}</td>
                  <td className="px-4 py-3 text-ink-soft">{r.message ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-mute text-xs">{new Date(r.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white/80 p-5">
      <p className="text-xs text-ink-mute uppercase tracking-wider">{label}</p>
      <p className={`mt-2 font-display text-3xl ${accent ?? "text-ink"}`}>{value}</p>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    accepted: "bg-teal-soft text-teal",
    maybe: "bg-gold-100 text-gold-600",
    declined: "bg-maroon-50 text-maroon-500",
    pending: "bg-cream-100 text-ink-soft",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest ${map[status] ?? "bg-cream-100 text-ink-soft"}`}>
      {status}
    </span>
  );
}
