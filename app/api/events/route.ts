import { NextRequest, NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";
import { CreateEventSchema } from "@/lib/validators";
import { effectivePlan, canCreateEvent } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  let payload: unknown;
  try { payload = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = CreateEventSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const supabase = createClient();

  // Plan enforcement: count current active events
  const { count: currentEvents } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .neq("status", "archived");

  const [{ data: subRow }, { data: planRow }] = await Promise.all([
    supabase.from("subscriptions").select("plan,status,current_period_end").eq("user_id", user.id).maybeSingle(),
    supabase.from("plans").select("*").eq("key", "free").maybeSingle(),
  ]);

  const planKey = effectivePlan(subRow ?? null);
  const { data: plan } = await supabase.from("plans").select("*").eq("key", planKey).maybeSingle();
  const planForCheck = plan ?? planRow;

  // Free plan cannot create persistent events
  if (planForCheck && !canCreateEvent(planForCheck as any, currentEvents ?? 0)) {
    return NextResponse.json(
      { error: "Plan limit reached. Upgrade to save more events." },
      { status: 402 },
    );
  }

  // Insert event row
  const { data: event, error } = await supabase
    .from("events")
    .insert({
      user_id: user.id,
      template_id: data.templateId,
      title: data.title,
      category: data.category,
      default_language: data.defaultLanguage,
      event_date: data.eventDate ?? null,
      event_time: data.eventTime ?? null,
      timezone: data.timezone,
      venue_name: data.venueName ?? null,
      venue_address: data.venueAddress ?? null,
      map_url: data.mapUrl ?? null,
      rsvp_deadline: data.rsvpDeadline ?? null,
    })
    .select("id, invite_code, status")
    .single();

  if (error || !event) {
    return NextResponse.json({ error: error?.message ?? "Failed to create event" }, { status: 500 });
  }

  // Insert content rows
  const rows = (Object.entries(data.content) as Array<[string, any]>)
    .filter(([, v]) => v)
    .map(([language, content]) => ({
      event_id: event.id,
      language,
      host_names: content?.hostNames ?? null,
      headline: content?.headline ?? null,
      message: content?.message ?? null,
    }));
  if (rows.length > 0) {
    const { error: cErr } = await supabase.from("event_content").upsert(rows, { onConflict: "event_id,language" });
    if (cErr) {
      // Soft-fail: event exists even if content insert had a transient issue.
      console.error("event_content insert failed", cErr);
    }
  }

  return NextResponse.json({
    eventId: event.id,
    inviteCode: event.invite_code,
    status: event.status,
    redirectUrl: `/dashboard/events/${event.id}/editor`,
  });
}

export async function GET() {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id,title,category,status,invite_code,event_date,is_watermark_removed,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data ?? [] });
}
