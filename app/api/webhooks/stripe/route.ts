import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const sig = headers().get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e: any) {
    return NextResponse.json({ error: `Bad signature: ${e?.message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const meta = session.metadata ?? {};
        const userId = meta.user_id as string | undefined;
        const plan = meta.plan as string | undefined;
        const eventId = (meta.event_id as string | undefined) || null;
        const amount = session.amount_total != null ? session.amount_total / 100 : null;

        if (userId) {
          await admin.from("payments").update({
            status: "succeeded",
            amount,
            currency: session.currency ?? "usd",
            stripe_payment_intent_id: typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
          }).eq("stripe_checkout_session_id", session.id);

          // Per-event unlock for one-time plans
          if (eventId && (plan === "starter" || plan === "premium")) {
            await admin.from("events").update({ is_watermark_removed: true }).eq("id", eventId);
          }

          // For subscription mode, the subscription.* events will fill in plan info.
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        const status = sub.status;
        const currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
        // Map Stripe price → plan key
        const priceId = sub.items.data[0]?.price.id;
        const plan = mapPriceToPlan(priceId);
        // Find user by customer id (lookup payments first, fall back to email)
        let userId: string | null = null;
        const { data: pay } = await admin
          .from("payments")
          .select("user_id")
          .eq("stripe_payment_intent_id", customerId)
          .limit(1)
          .maybeSingle();
        if (pay?.user_id) userId = pay.user_id;
        if (!userId) {
          // Lookup by metadata in subscription itself if added
          const metaUid = (sub.metadata?.user_id as string) ?? null;
          userId = metaUid;
        }
        if (userId && plan) {
          await admin.from("subscriptions").upsert({
            user_id: userId,
            plan,
            status,
            stripe_customer_id: customerId,
            stripe_subscription_id: sub.id,
            current_period_end: currentPeriodEnd,
          }, { onConflict: "user_id" });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        await admin.from("subscriptions").update({
          plan: "free",
          status: "canceled",
        }).eq("stripe_customer_id", customerId);
        break;
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const customerId = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
        if (customerId) {
          await admin.from("subscriptions").update({ status: "past_due" }).eq("stripe_customer_id", customerId);
        }
        break;
      }
      default:
        // Ignore other events for MVP
        break;
    }
  } catch (e: any) {
    console.error("Stripe webhook handler error", e);
    return NextResponse.json({ error: e?.message ?? "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function mapPriceToPlan(priceId?: string): "starter" | "premium" | "family" | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_STARTER) return "starter";
  if (priceId === process.env.STRIPE_PRICE_PREMIUM) return "premium";
  if (priceId === process.env.STRIPE_PRICE_FAMILY) return "family";
  return null;
}
