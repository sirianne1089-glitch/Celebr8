import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TemplateRenderer } from "@/lib/template-engine";
import type { TemplateRow } from "@/types/database";
import { Crown, ArrowRight } from "lucide-react";
import { TemplatePreviewClient } from "@/components/templates/TemplatePreviewClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return { title: params.slug.replace(/-/g, " ") };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("templates")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "active")
    .maybeSingle();

  const t = data as TemplateRow | null;
  if (!t) notFound();

  const { data: relatedRaw } = await supabase
    .from("templates")
    .select("id,slug,name,category,base_layout,is_premium,supports_photo,supported_languages,thumbnail_url,preview_image_url,config,default_copy,status,sort_order,created_at")
    .eq("category", t.category)
    .neq("id", t.id)
    .eq("status", "active")
    .order("sort_order", { ascending: true })
    .limit(4);
  const related = (relatedRaw ?? []) as TemplateRow[];

  return (
    <div className="container py-10 md:py-14">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10">
        <div>
          <TemplatePreviewClient template={t} />
        </div>

        <aside className="lg:pt-6">
          <p className="section-eyebrow">{t.category}</p>
          <h1 className="font-display text-3xl md:text-5xl font-semibold mt-2">{t.name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {t.is_premium && (
              <span className="chip"><Crown size={12} /> Premium</span>
            )}
            {t.supported_languages.map((l) => (
              <span key={l} className="chip">{
                l === "te" ? "తెలుగు" : l === "hi" ? "हिन्दी" : "English"
              }</span>
            ))}
            {t.supports_photo && <span className="chip">Photo support</span>}
          </div>

          <p className="text-ink-soft mt-5 leading-relaxed">
            A premium {t.category} template, ready in three languages. Customise the host names,
            date, venue and message — Celebr8 will generate a beautiful invite link, QR and
            WhatsApp share you can send to every guest.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/editor?template=${t.slug}`}
              className="btn-gold text-base px-6 py-3"
            >
              Customize this invite <ArrowRight size={16} />
            </Link>
            <Link href="/templates" className="btn-outline text-base px-5 py-3">
              Browse more
            </Link>
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-white/70 p-5 text-sm text-ink-soft">
            <p className="font-semibold text-ink">Free to try</p>
            <p className="mt-1">
              Edit and preview without an account. Sign up only when you're ready to save and share.
              The watermark is removed after a small one-time payment per event.
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl mb-5">More {t.category} designs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/templates/${r.slug}`}
                className="group rounded-2xl border border-line bg-white/70 overflow-hidden hover:shadow-card transition"
              >
                <div className="aspect-[3/4]">
                  <TemplateRenderer
                    baseLayout={r.base_layout}
                    colors={r.config.colors}
                    motif={r.config.motif}
                    copy={r.default_copy.en}
                    language="en"
                  />
                </div>
                <p className="p-2 text-xs text-center text-ink-soft group-hover:text-ink">{r.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
