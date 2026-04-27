// =============================================================================
// Generated-style typed Database type for Supabase
// (We hand-author this for the MVP. Run `npm run db:types` against the linked
//  Supabase project to regenerate from the actual schema once available.)
// =============================================================================

export type EventStatus = "draft" | "published" | "archived";
export type RsvpStatus = "pending" | "accepted" | "maybe" | "declined";
export type PlanKey =
  | "free"
  | "starter"
  | "premium"
  | "family"
  | "corporate";
export type TemplateCategory =
  | "wedding"
  | "birthday"
  | "housewarming"
  | "baby"
  | "festival"
  | "corporate";
export type Language = "en" | "te" | "hi";

export type TemplateCopy = {
  hostNames: string;
  headline: string;
  message: string;
};

export type TemplateConfig = {
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  motif?: string;
};

export type TemplateRow = {
  id: string;
  slug: string;
  name: string;
  category: TemplateCategory;
  base_layout: string;
  is_premium: boolean;
  supports_photo: boolean;
  supported_languages: Language[];
  thumbnail_url: string | null;
  preview_image_url: string | null;
  config: TemplateConfig;
  default_copy: Record<Language, TemplateCopy>;
  status: "active" | "hidden" | "draft";
  sort_order: number;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  default_language: Language;
  timezone: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  user_id: string;
  template_id: string | null;
  title: string;
  category: TemplateCategory;
  status: EventStatus;
  invite_code: string;
  default_language: Language;
  event_date: string | null;
  event_time: string | null;
  timezone: string;
  venue_name: string | null;
  venue_address: string | null;
  map_url: string | null;
  rsvp_deadline: string | null;
  is_watermark_removed: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EventContentRow = {
  id: string;
  event_id: string;
  language: Language;
  host_names: string | null;
  headline: string | null;
  message: string | null;
  custom_fields: Record<string, unknown>;
  photo_url: string | null;
};

export type GuestRow = {
  id: string;
  event_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  guest_group: string;
  preferred_language: Language;
  invite_code: string;
  created_at: string;
  updated_at: string;
};

export type RsvpRow = {
  id: string;
  event_id: string;
  guest_id: string | null;
  guest_name: string;
  status: RsvpStatus;
  plus_ones: number;
  message: string | null;
  dietary_preference: string | null;
  submitted_at: string;
};

export type PlanRow = {
  key: PlanKey;
  name: string;
  price_usd: number;
  max_events: number | null;
  max_guests_per_event: number | null;
  premium_templates: boolean;
  remove_watermark: boolean;
  csv_import: boolean;
  rsvp_dashboard: boolean;
  stripe_price_id: string | null;
};

export type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: PlanKey;
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentRow = {
  id: string;
  user_id: string;
  event_id: string | null;
  plan: PlanKey | null;
  amount: number | null;
  currency: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  status: string;
  created_at: string;
};

// Generic Supabase Database typing kept loose for MVP. Strengthen via `db:types`.
export type Database = {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: Partial<ProfileRow>; Update: Partial<ProfileRow> };
      templates: { Row: TemplateRow; Insert: Partial<TemplateRow>; Update: Partial<TemplateRow> };
      events: { Row: EventRow; Insert: Partial<EventRow>; Update: Partial<EventRow> };
      event_content: { Row: EventContentRow; Insert: Partial<EventContentRow>; Update: Partial<EventContentRow> };
      guests: { Row: GuestRow; Insert: Partial<GuestRow>; Update: Partial<GuestRow> };
      rsvps: { Row: RsvpRow; Insert: Partial<RsvpRow>; Update: Partial<RsvpRow> };
      plans: { Row: PlanRow; Insert: Partial<PlanRow>; Update: Partial<PlanRow> };
      subscriptions: { Row: SubscriptionRow; Insert: Partial<SubscriptionRow>; Update: Partial<SubscriptionRow> };
      payments: { Row: PaymentRow; Insert: Partial<PaymentRow>; Update: Partial<PaymentRow> };
    };
  };
};
