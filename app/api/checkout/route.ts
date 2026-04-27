import { NextRequest, NextResponse } from "next/server";
import { createClient, requireUser } from "@/lib/supabase/server";
import { getStripe, PRICE_IDS } from "@/lib/stripe";
import { CheckoutSchema } from "@/lib/validators";
import { getAppUrl } from "@/lib/utils";

export async function POST(req: NextRequest) {
  let user;
  try { user = await requireUser(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const body = await req.json().catch(() => null);
  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const stripe = getStripe();
  const supabase = createClient();
  const data = parsed.data;

  const priceId = PRICE_IDS[data.plan];
  if (!priceId) {
    return NextResponse.json({ error: "Stripe price not configured for this plan" }, { status: 500 });
  }

  // Look up profile email
  const { data: profile } = await supabase.from("profiles").select("email,full_name").eq("id", user.id).maybeSingle();

  const successUrl = `${getAppUrl()}/dashboard/billing?success=1`;
  const cancelUrl = `${getAppUrl()}/dashboard/billing?canceled=1`;

  // Starter and Premium are one-time per-event purchases (mode: payment).
  // Family is a subscription.
  const mode: "payment" | "subscription" = data.plan === "family" ? "subscription" : "payment";

  const session = await stripe.checkout.sessions.create({
    mode,
    customer_email: profile?.email ?? user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      user_id: user.id,
      plan: data.plan,
      event_id: data.eventId ?? "",
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  // Track pending payment
  await supabase.from("payments").insert({
    user_id: user.id,
    event_id: data.eventId ?? null,
    plan: data.plan,
    amount: null,
    currency: "usd",
    stripe_checkout_session_id: session.id,
    status: "pending",
  });

  return NextResponse.json({ url: session.url });
}
