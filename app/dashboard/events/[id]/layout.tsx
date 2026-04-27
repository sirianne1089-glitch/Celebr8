import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, requireUser } from "@/lib/supabase/server";
import { Pencil, Users, Share2, BarChart3 } from "lucide-react";

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const user = await requireUser();
  const supabase = createClient();
  const { data: ev } = await supabase
    .from("events")
    .select("id,title,status,user_id")
    .eq("id", params.id)
    .maybeSingle();
  if (!ev || ev.user_id !== user.id) redirect("/dashboard");
  const tabs = [
    { href: `/dashboard/events/${params.id}/editor`, label: "Editor", icon: Pencil },
    { href: `/dashboard/events/${params.id}/guests`, label: "Guests", icon: Users },
    { href: `/dashboard/events/${params.id}/share`, label: "Share", icon: Share2 },
    { href: `/dashboard/events/${params.id}/rsvp`, label: "RSVP", icon: BarChart3 },
  ];
  return (
    <div className="space-y-6">
      <div>
        <p className="section-eyebrow">Event</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">{ev.title}</h1>
        <p className="text-xs text-ink-mute mt-1 capitalize">Status: {ev.status}</p>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max border-b border-line pb-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={t.href} className="rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-cream-100 inline-flex items-center gap-2">
                <Icon size={14} /> {t.label}
              </Link>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  );
}
