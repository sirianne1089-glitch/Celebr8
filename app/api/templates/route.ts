import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const params = req.nextUrl.searchParams;
  let q = supabase.from("templates").select("*").eq("status", "active").order("sort_order");
  const cat = params.get("category");
  const premium = params.get("premium");
  const language = params.get("language");
  const search = params.get("search");
  if (cat) q = q.eq("category", cat);
  if (premium === "true") q = q.eq("is_premium", true);
  if (premium === "false") q = q.eq("is_premium", false);
  if (language) q = q.contains("supported_languages", [language]);
  if (search) q = q.ilike("name", `%${search}%`);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ templates: data ?? [] });
}
