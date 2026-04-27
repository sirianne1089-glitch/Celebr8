import type { PlanRow, SubscriptionRow } from "@/types/database";

export function effectivePlan(
  subscription: Pick<SubscriptionRow, "plan" | "status" | "current_period_end"> | null,
): "free" | "starter" | "premium" | "family" | "corporate" {
  if (!subscription) return "free";
  const active = ["active", "trialing", "past_due"].includes(subscription.status);
  if (!active) return "free";
  if (
    subscription.current_period_end &&
    new Date(subscription.current_period_end).getTime() < Date.now()
  ) {
    return "free";
  }
  return subscription.plan;
}

export function canCreateEvent(plan: PlanRow, currentEvents: number) {
  if (plan.max_events === null) return true;
  if (plan.max_events === 0) return false;
  return currentEvents < plan.max_events;
}

export function canAddGuest(plan: PlanRow, currentGuests: number) {
  if (plan.max_guests_per_event === null) return true;
  if (plan.max_guests_per_event === 0) return false;
  return currentGuests < plan.max_guests_per_event;
}

export function shouldShowWatermark(p: {
  isWatermarkRemoved: boolean;
  effectivePlan: string;
  canRemove: boolean;
}) {
  if (p.isWatermarkRemoved) return false;
  if (p.canRemove) return false;
  return true;
}
