import { createClient } from "@/lib/supabase/server";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateFilters } from "@/components/templates/TemplateFilters";
import type { TemplateRow } from "@/types/database";

export const metadata = { title: "Browse 50 Premium Templates" };

export const dynamic = "force-dynamic";

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: { category?: string; premium?: string; search?: string };
}) {
  const supabase = createClient();
  let query = supabase
    .from("templates")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (searchParams.category) query = query.eq("category", searchParams.category);
  if (searchParams.premium === "true") query = query.eq("is_premium", true);
  if (searchParams.premium === "false") query = query.eq("is_premium", false);
  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`);
  }

  const { data, error } = await query;
  const templates = (data ?? []) as TemplateRow[];

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-2xl mb-8">
        <p className="section-eyebrow">Templates</p>
        <h1 className="font-display text-3xl md:text-5xl font-semibold mt-2">
          50 designs. <span className="shimmer">Endless moments.</span>
        </h1>
        <p className="text-ink-soft mt-3">
          Filter by category and pick a style. Customise it instantly — no signup needed.
        </p>
      </div>

      <div className="mb-8">
        <TemplateFilters />
      </div>

      {error && (
        <div className="rounded-2xl border border-maroon-200 bg-maroon-50 text-maroon-500 p-4 text-sm">
          We couldn't load templates right now. Please try again.
        </div>
      )}

      {templates.length === 0 && !error ? (
        <div className="rounded-2xl border border-line bg-white/70 p-10 text-center">
          <p className="text-ink-soft">No templates match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {templates.map((t) => (
            <TemplateCard key={t.id} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
