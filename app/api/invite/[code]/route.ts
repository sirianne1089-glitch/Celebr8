import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Public route. Returns sanitized invite data by event invite_code OR guest invite_code.
 * Never returns owner-private info (email, billing, etc.).
 */
export async function GET(_: NextRequest, { params }: { params: { code: string } }) {
  const admin = createAdminClient();
  // First try matching event by invite_code
  const { data: ev } = await admin
    .from("events")
    .select("id,title,category,invite_code,default_language,event_date,event_time,timezone,venue_name,venue_address,map_url,rsvp_deadline,is_watermark_removed,status,template_id")
    .eq("invite_code", params.code)
    .maybeSingle();

  let event = ev;
  let guestId: string | null = null;
  if (!event) {
    const { data: guest } = await admin
      .from("guests")
      .select("id,event_id")
      .eq("invite_code", params.code)
      .maybeSingle();
    if (!guest) return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    guestId = guest.id;
    const { data: ev2 } = await admin
      .from("events")
      .select("id,title,category,invite_code,default_language,event_date,event_time,timezone,venue_name,venue_address,map_url,rsvp_deadline,is_watermark_removed,status,template_id")
      .eq("id", guest.event_id)
      .maybeSingle();
    event = ev2 ?? null;
    if (!event) return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  if (event.status === "archived") {
    return NextResponse.json({ error: "Invite no longer available" }, { status: 410 });
  }

  const [{ data: contentRows }, { data: template }] = await Promise.all([
    admin.from("event_content").select("*").eq("event_id", event.id),
    admin.from("templates").select("slug,base_layout,supports_photo,config").eq("id", event.template_id).maybeSingle(),
  ]);

  const content: Record<string, any> = {};
  for (const row of contentRows ?? []) {
    content[row.language] = {
      hostNames: row.host_names ?? "",
      headline: row.headline ?? "",
      message: row.message ?? "",
      photoUrl: row.photo_url ?? null,
    };
  }

  // Log open (best-effort)
  await admin.from("invite_opens").insert({
    event_id: event.id,
    guest_id: guestId,
    invite_code: params.code,
  });

  return NextResponse.json({
    event: {
      id: event.id,
      title: event.title,
      category: event.category,
      inviteCode: event.invite_code,
      defaultLanguage: event.default_language,
      eventDate: event.event_date,
      eventTime: event.event_time,
      timezone: event.timezone,
      venueName: event.venue_name,
      venueAddress: event.venue_address,
      mapUrl: event.map_url,
      rsvpDeadline: event.rsvp_deadline,
      isWatermarkRemoved: !!event.is_watermark_removed,
      template: template
        ? {
            slug: template.slug,
            baseLayout: template.base_layout,
            supportsPhoto: !!template.supports_photo,
            config: template.config,
          }
        : null,
      content,
      isPreviewOnly: event.status !== "published",
      guestId,
    },
  });
}
