import { NextRequest, NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";
import { GuestSchema, LANGUAGES } from "@/lib/validators";

/**
 * Accepts JSON body: { eventId, csv: string }
 * CSV columns: name,email,phone,group,language
 * Validates each row; returns counts + per-row errors.
 */
export async function POST(req: NextRequest) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = createClient();
  const body = await req.json().catch(() => null);
  if (!body || typeof body.csv !== "string" || typeof body.eventId !== "string") {
    return NextResponse.json({ error: "Provide eventId and csv" }, { status: 400 });
  }
  const { data: ev } = await supabase.from("events").select("id,user_id").eq("id", body.eventId).maybeSingle();
  if (!ev || ev.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const lines = (body.csv as string).split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return NextResponse.json({ error: "Empty CSV" }, { status: 400 });
  const header = parseRow(lines[0]).map((c) => c.toLowerCase().trim());
  const need = ["name"];
  for (const n of need) if (!header.includes(n)) return NextResponse.json({ error: `Missing column: ${n}` }, { status: 400 });

  const idx = (key: string) => header.indexOf(key);
  const valid: any[] = [];
  const errors: { row: number; reason: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseRow(lines[i]);
    const lang = (cols[idx("language")] ?? "en").trim().toLowerCase();
    const candidate = {
      name: cols[idx("name")]?.trim(),
      email: cols[idx("email")]?.trim() || undefined,
      phone: cols[idx("phone")]?.trim() || undefined,
      guest_group: cols[idx("group")]?.trim() || "family",
      preferred_language: (LANGUAGES as readonly string[]).includes(lang) ? lang : "en",
    };
    const parsed = GuestSchema.safeParse(candidate);
    if (!parsed.success) {
      errors.push({ row: i + 1, reason: parsed.error.issues[0]?.message ?? "Invalid row" });
      continue;
    }
    valid.push({
      event_id: body.eventId,
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone ?? null,
      guest_group: parsed.data.guest_group,
      preferred_language: parsed.data.preferred_language,
    });
  }

  if (valid.length === 0) {
    return NextResponse.json({ inserted: 0, errors });
  }

  const { error } = await supabase.from("guests").insert(valid);
  if (error) return NextResponse.json({ error: error.message, errors }, { status: 500 });
  return NextResponse.json({ inserted: valid.length, errors });
}

function parseRow(line: string): string[] {
  const out: string[] = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQ = false;
      else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { out.push(cur); cur = ""; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}
