import { createClient, requireUser } from "@/lib/supabase/server";
import { effectivePlan } from "@/lib/permissions";
import { BillingActions } from "@/components/dashboard/BillingActions";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string };
}) {
  const user = await requireUser();
  const supabase = createClient();
  const [{ data: subscription }, { data: payments }] = await Promise.all([
    supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("payments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
  ]);
  const planKey = effectivePlan(subscription ?? null);
  const { data: plan } = await supabase.from("plans").select("*").eq("key", planKey).maybeSingle();

  return (
    <div className="space-y-6">
      <div>
        <p className="section-eyebrow">Billing</p>
        <h1 className="font-display text-3xl md:text-4xl mt-1">Plan & payments</h1>
      </div>

      {searchParams.success && (
        <div className="rounded-xl border border-teal/30 bg-teal-soft p-4 text-sm text-teal">
          Thank you. Your purchase is being confirmed by Stripe — your plan and watermark
          status will update within a few seconds once the webhook fires.
        </div>
      )}
      {searchParams.canceled && (
        <div className="rounded-xl border border-line bg-cream-100 p-4 text-sm text-ink-soft">
          Checkout cancelled. No charges were made.
        </div>
      )}

      <div className="rounded-2xl border border-line bg-white/80 p-6">
        <p className="text-xs uppercase tracking-widest text-ink-mute">Current plan</p>
        <p className="font-display text-3xl mt-1">{plan?.name ?? "Free"}</p>
        <p className="text-sm text-ink-soft mt-1">
          {plan?.max_events === null
            ? "Unlimited events"
            : `Up to ${plan?.max_events ?? 0} events`}
          {" · "}
          {plan?.max_guests_per_event === null
            ? "Unlimited guests"
            : `${plan?.max_guests_per_event ?? 0} guests`}
        </p>
        <ul className="mt-4 space-y-1 text-sm text-ink-soft">
          {plan?.remove_watermark && <li className="flex items-center gap-2"><Check size={14} className="text-teal" /> Watermark removal</li>}
          {plan?.csv_import && <li className="flex items-center gap-2"><Check size={14} className="text-teal" /> CSV import</li>}
          {plan?.rsvp_dashboard && <li className="flex items-center gap-2"><Check size={14} className="text-teal" /> RSVP dashboard</li>}
          {plan?.premium_templates && <li className="flex items-center gap-2"><Check size={14} className="text-teal" /> Premium templates</li>}
        </ul>
        <BillingActions currentPlan={planKey} />
      </div>

      <div>
        <h2 className="font-display text-xl mb-3">Recent payments</h2>
        {payments && payments.length > 0 ? (
          <div className="rounded-2xl border border-line bg-white/80 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-left text-xs text-ink-mute uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-line">
                    <td className="px-4 py-3 text-ink-mute text-xs">{new Date(p.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 capitalize">{p.plan ?? "—"}</td>
                    <td className="px-4 py-3">{p.amount != null ? `$${Number(p.amount).toFixed(2)}` : "—"}</td>
                    <td className="px-4 py-3 capitalize">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-white/70 p-8 text-center text-ink-soft">
            No payments yet.
          </div>
        )}
      </div>
    </div>
  );
}
