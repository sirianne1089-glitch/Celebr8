import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (_stripe) return _stripe;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("STRIPE_SECRET_KEY is not configured");
  _stripe = new Stripe(secret, {
    // Using a stable API version; pin per Stripe-recommended.
    apiVersion: "2024-09-30.acacia" as Stripe.LatestApiVersion,
    typescript: true,
  });
  return _stripe;
}

export const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "",
  premium: process.env.STRIPE_PRICE_PREMIUM ?? "",
  family: process.env.STRIPE_PRICE_FAMILY ?? "",
};
