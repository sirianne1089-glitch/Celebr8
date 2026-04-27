import { NextRequest, NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";
import { GuestSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = createClient();
  let payload: unknown;
  try { payload = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const body = payload as Record<string, unknown>;
  const eventId = body.eventId as string | undefined;
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

  // Verify ownership
  const { data: ev } = await supabase.from("events").select("id,user_id").eq("id", eventId).maybeSingle();
  if (!ev || ev.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const parsed = GuestSchema.safeParse(body.guest ?? body);
  if (!parsed.success) return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  const g = parsed.data;
  const { data, error } = await supabase
    .from("guests")
    .insert({
      event_id: eventId,
      name: g.name,
      email: g.email ?? null,
      phone: g.phone ?? null,
      guest_group: g.guest_group,
      preferred_language: g.preferred_language,
    })
    .select("id, invite_code, name, email, phone, guest_group, preferred_language")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ guest: data });
}

export async function GET(req: NextRequest) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = createClient();
  const eventId = req.nextUrl.searchParams.get("eventId");
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });
  const { data: ev } = await supabase.from("events").select("id,user_id").eq("id", eventId).maybeSingle();
  if (!ev || ev.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data, error } = await supabase.from("guests").select("*").eq("event_id", eventId).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ guests: data ?? [] });
}

export async function DELETE(req: NextRequest) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = createClient();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { data: g } = await supabase.from("guests").select("event_id").eq("id", id).maybeSingle();
  if (!g) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data: ev } = await supabase.from("events").select("user_id").eq("id", g.event_id).maybeSingle();
  if (!ev || ev.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { error } = await supabase.from("guests").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
