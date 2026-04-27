import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { InviteEditor } from "@/components/editor/InviteEditor";
import type { TemplateRow } from "@/types/database";

export const dynamic = "force-dynamic";
export const metadata = { title: "Customize your invite" };

export default async function EditorPage({
  searchParams,
}: {
  searchParams: { template?: string };
}) {
  if (!searchParams.template) redirect("/templates");
  const supabase = createClient();
  const { data } = await supabase
    .from("templates")
    .select("*")
    .eq("slug", searchParams.template)
    .eq("status", "active")
    .maybeSingle();
  const template = data as TemplateRow | null;
  if (!template) redirect("/templates");

  const user = await getUser();

  return (
    <div className="container py-10">
      <div className="mb-6">
        <p className="section-eyebrow">Editor preview</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Customize <span className="shimmer">{template.name}</span></h1>
        <p className="text-ink-soft mt-2 text-sm">
          Make it yours. Switch languages anytime. Save when you're ready.
        </p>
      </div>
      <InviteEditor template={template} isAuthed={!!user} />
    </div>
  );
}
