import { NextRequest, NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";
import { UpdateEventSchema } from "@/lib/validators";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = createClient();
  const { data: event, error } = await supabase
    .from("events").select("*").eq("id", params.id).eq("user_id", user.id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data: content } = await supabase
    .from("event_content").select("*").eq("event_id", params.id);
  return NextResponse.json({ event, content: content ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  let payload: unknown;
  try { payload = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = UpdateEventSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  const supabase = createClient();
  const data = parsed.data;
  const updates: Record<string, unknown> = {};
  if (data.title !== undefined) updates.title = data.title;
  if (data.category !== undefined) updates.category = data.category;
  if (data.defaultLanguage !== undefined) updates.default_language = data.defaultLanguage;
  if (data.eventDate !== undefined) updates.event_date = data.eventDate;
  if (data.eventTime !== undefined) updates.event_time = data.eventTime;
  if (data.timezone !== undefined) updates.timezone = data.timezone;
  if (data.venueName !== undefined) updates.venue_name = data.venueName;
  if (data.venueAddress !== undefined) updates.venue_address = data.venueAddress;
  if (data.mapUrl !== undefined) updates.map_url = data.mapUrl;
  if (data.rsvpDeadline !== undefined) updates.rsvp_deadline = data.rsvpDeadline;
  if (data.status !== undefined) {
    updates.status = data.status;
    if (data.status === "published") updates.published_at = new Date().toISOString();
  }
  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from("events").update(updates).eq("id", params.id).eq("user_id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data.content) {
    const rows = (Object.entries(data.content) as Array<[string, any]>)
      .filter(([, v]) => v)
      .map(([language, content]) => ({
        event_id: params.id,
        language,
        host_names: content?.hostNames ?? null,
        headline: content?.headline ?? null,
        message: content?.message ?? null,
      }));
    if (rows.length > 0) {
      const { error: cErr } = await supabase
        .from("event_content").upsert(rows, { onConflict: "event_id,language" });
      if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = createClient();
  const { error } = await supabase.from("events").delete().eq("id", params.id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
