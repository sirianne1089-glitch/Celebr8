import { NextRequest, NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = createClient();
  const eventId = req.nextUrl.searchParams.get("eventId");
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });
  const { data: ev } = await supabase.from("events").select("user_id,title").eq("id", eventId).maybeSingle();
  if (!ev || ev.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data: rows, error } = await supabase
    .from("rsvps")
    .select("guest_name,status,plus_ones,message,dietary_preference,submitted_at")
    .eq("event_id", eventId)
    .order("submitted_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const csv = [
    "guest_name,status,plus_ones,message,dietary_preference,submitted_at",
    ...(rows ?? []).map((r) =>
      [
        csvCell(r.guest_name),
        r.status,
        r.plus_ones ?? 0,
        csvCell(r.message ?? ""),
        csvCell(r.dietary_preference ?? ""),
        r.submitted_at,
      ].join(","),
    ),
  ].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvps-${eventId}.csv"`,
    },
  });
}

function csvCell(v: string) {
  const needs = v.includes(",") || v.includes('"') || v.includes("\n");
  const safe = v.replace(/"/g, '""');
  return needs ? `"${safe}"` : safe;
}
