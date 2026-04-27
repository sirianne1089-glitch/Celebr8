import { redirect } from "next/navigation";
import { createClient, requireUser } from "@/lib/supabase/server";
import { GuestsManager } from "@/components/dashboard/GuestsManager";
import type { GuestRow } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function GuestsPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const supabase = createClient();
  const { data: ev } = await supabase.from("events").select("id,user_id").eq("id", params.id).maybeSingle();
  if (!ev || ev.user_id !== user.id) redirect("/dashboard");
  const { data: guests } = await supabase
    .from("guests").select("*").eq("event_id", params.id).order("created_at", { ascending: false });
  return <GuestsManager eventId={params.id} initialGuests={(guests ?? []) as GuestRow[]} />;
}
