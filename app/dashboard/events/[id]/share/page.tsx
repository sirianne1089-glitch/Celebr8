import { redirect } from "next/navigation";
import { createClient, requireUser } from "@/lib/supabase/server";
import { ShareView } from "@/components/dashboard/ShareView";
import type { EventRow } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function SharePage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const supabase = createClient();
  const { data: ev } = await supabase
    .from("events")
    .select("id,user_id,title,invite_code,status,is_watermark_removed")
    .eq("id", params.id).maybeSingle();
  if (!ev || ev.user_id !== user.id) redirect("/dashboard");
  return <ShareView event={ev as EventRow} />;
}
