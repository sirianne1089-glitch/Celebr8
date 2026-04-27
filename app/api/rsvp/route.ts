import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { RsvpSubmitSchema } from "@/lib/validators";

/**
 * Public route to submit an RSVP. Validates payload, looks up event by inviteCode,
 * and inserts/updates rsvp record. Uses service role since the visitor is anonymous.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = RsvpSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const admin = createAdminClient();

  // Find event
  let eventId: string | null = null;
  let guestId: string | null = null;
  const { data: ev } = await admin
    .from("events")
    .select("id,status,rsvp_deadline")
    .eq("invite_code", data.eventCode)
    .maybeSingle();
  if (ev) {
    eventId = ev.id;
  } else if (data.guestCode) {
    const { data: g } = await admin
      .from("guests")
      .select("id,event_id")
      .eq("invite_code", data.guestCode)
      .maybeSingle();
    if (g) {
      eventId = g.event_id;
      guestId = g.id;
    }
  }
  if (!eventId) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

  // Check deadline
  const { data: full } = await admin.from("events").select("rsvp_deadline,status").eq("id", eventId).maybeSingle();
  if (full?.status === "archived") return NextResponse.json({ error: "Event closed" }, { status: 410 });
  if (full?.rsvp_deadline && new Date(full.rsvp_deadline).getTime() < Date.now()) {
    return NextResponse.json({ error: "RSVP deadline has passed" }, { status: 410 });
  }

  // Match guestCode if supplied
  if (!guestId && data.guestCode) {
    const { data: g } = await admin.from("guests").select("id").eq("invite_code", data.guestCode).maybeSingle();
    guestId = g?.id ?? null;
  }

  const insert = {
    event_id: eventId,
    guest_id: guestId,
    guest_name: data.guestName,
    status: data.status,
    plus_ones: data.plusOnes,
    message: data.message ?? null,
    dietary_preference: data.dietaryPreference ?? null,
    submitted_at: new Date().toISOString(),
  };

  // If guestId exists, upsert by (event_id, guest_id) using composite uniqueness
  let error;
  if (guestId) {
    const { error: e } = await admin
      .from("rsvps")
      .upsert(insert, { onConflict: "event_id,guest_id" });
    error = e;
  } else {
    const { error: e } = await admin.from("rsvps").insert(insert);
    error = e;
  }
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, status: data.status, submittedAt: insert.submitted_at });
}
