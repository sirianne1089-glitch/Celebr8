import Link from "next/link";
import { createClient, requireUser } from "@/lib/supabase/server";
import { effectivePlan } from "@/lib/permissions";
import { Plus, Send, Users, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function DashboardHome() {
  const user = await requireUser();
  const supabase = createClient();

  const [{ data: events }, { data: subscription }, { data: plan }] = await Promise.all([
    supabase
      .from("events")
      .select("id,title,category,status,event_date,is_watermark_removed,invite_code,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("subscriptions").select("plan,status,current_period_end").eq("user_id", user.id).maybeSingle(),
    supabase.from("plans").select("*").eq("key", effectivePlan(null)).maybeSingle(),
  ]);

  const planKey = effectivePlan(subscription ?? null);
  const { data: planRow } = await supabase.from("plans").select("*").eq("key", planKey).maybeSingle();

  // Aggregate RSVP totals
  const eventIds = (events ?? []).map((e) => e.id);
  let accepted = 0, maybe = 0, declined = 0, total = 0;
  if (eventIds.length > 0) {
    const { data: rsvps } = await supabase
      .from("rsvps")
      .select("status")
      .in("event_id", eventIds);
    for (const r of rsvps ?? []) {
      total++;
      if (r.status === "accepted") accepted++;
      else if (r.status === "maybe") maybe++;
      else if (r.status === "declined") declined++;
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-eyebrow">Dashboard</p>
          <h1 className="font-display text-3xl md:text-4xl mt-1">Welcome back.</h1>
        </div>
        <Link href="/dashboard/create" className="btn-gold">
          <Plus size={16} /> New event
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Events" value={events?.length ?? 0} icon={Calendar} />
        <Stat label="Total RSVPs" value={total} icon={Send} />
        <Stat label="Accepted" value={accepted} icon={Users} accent="text-teal" />
        <Stat label="Plan" value={planRow?.name ?? "Free"} icon={Plus} accent="text-gold-500" />
      </div>

      {/* Events list */}
      <section>
        <h2 className="font-display text-xl mb-3">Your events</h2>
        {events && events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              <Link
                key={e.id}
                href={`/dashboard/events/${e.id}/editor`}
                className="rounded-2xl border border-line bg-white/80 p-5 hover:shadow-card transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display text-lg truncate">{e.title}</p>
                    <p className="text-xs text-ink-mute capitalize mt-0.5">
                      {e.category} · {e.status}
                    </p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest rounded-full px-2 py-0.5 ${
                    e.is_watermark_removed ? "bg-teal-soft text-teal" : "bg-cream-100 text-ink-soft"
                  }`}>
                    {e.is_watermark_removed ? "Paid" : "Preview"}
                  </span>
                </div>
                <p className="text-xs text-ink-mute mt-3">
                  {e.event_date ? formatDate(e.event_date) : "No date set"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-white/70 p-10 text-center">
            <p className="text-ink-soft">No events yet.</p>
            <Link href="/dashboard/create" className="btn-gold mt-4 inline-flex">Create your first event</Link>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: any;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white/80 p-5">
      <div className="flex items-center gap-2 text-xs text-ink-mute uppercase tracking-wider">
        <Icon size={14} /> {label}
      </div>
      <p className={`mt-2 font-display text-3xl ${accent ?? "text-ink"}`}>{value}</p>
    </div>
  );
}
