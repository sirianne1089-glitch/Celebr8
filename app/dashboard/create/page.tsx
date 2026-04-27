import Link from "next/link";
import { createClient, requireUser } from "@/lib/supabase/server";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateFilters } from "@/components/templates/TemplateFilters";
import type { TemplateRow } from "@/types/database";

export const dynamic = "force-dynamic";
export const metadata = { title: "Create event" };

export default async function CreatePage({
  searchParams,
}: {
  searchParams: { category?: string; premium?: string };
}) {
  await requireUser();
  const supabase = createClient();
  let q = supabase.from("templates").select("*").eq("status", "active").order("sort_order");
  if (searchParams.category) q = q.eq("category", searchParams.category);
  if (searchParams.premium === "true") q = q.eq("is_premium", true);
  if (searchParams.premium === "false") q = q.eq("is_premium", false);
  const { data } = await q;
  const templates = (data ?? []) as TemplateRow[];
  return (
    <div className="space-y-6">
      <div>
        <p className="section-eyebrow">Create event</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Pick a template to start.</h1>
      </div>
      <TemplateFilters />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {templates.map((t) => (
          <Link key={t.id} href={`/editor?template=${t.slug}`}>
            <TemplateCard t={t} />
          </Link>
        ))}
      </div>
      {templates.length === 0 && (
        <div className="rounded-2xl border border-line bg-white/70 p-8 text-center text-ink-soft">No templates match your filters.</div>
      )}
    </div>
  );
}
