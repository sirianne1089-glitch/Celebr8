import { createClient, requireUser } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,email,phone,country,default_language,timezone")
    .eq("id", user.id)
    .maybeSingle();
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <p className="section-eyebrow">Settings</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Profile</h1>
      </div>
      <SettingsForm initial={profile ?? { email: user.email ?? "" }} />
    </div>
  );
}
