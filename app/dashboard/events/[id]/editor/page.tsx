import { redirect } from "next/navigation";
import { createClient, requireUser } from "@/lib/supabase/server";
import { EventEditor } from "@/components/dashboard/EventEditor";
import type { EventRow, EventContentRow, TemplateRow } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function EventEditorPage({ params }: { params: { id: string } }) {
  const user = await requireUser();
  const supabase = createClient();
  const { data: event } = await supabase
    .from("events").select("*").eq("id", params.id).eq("user_id", user.id).maybeSingle();
  if (!event) redirect("/dashboard");
  const [{ data: contentRows }, { data: template }] = await Promise.all([
    supabase.from("event_content").select("*").eq("event_id", params.id),
    supabase.from("templates").select("*").eq("id", (event as EventRow).template_id ?? "").maybeSingle(),
  ]);
  return (
    <EventEditor
      event={event as EventRow}
      content={(contentRows ?? []) as EventContentRow[]}
      template={template as TemplateRow | null}
    />
  );
}
