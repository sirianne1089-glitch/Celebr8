import { z } from "zod";

export const LANGUAGES = ["en", "te", "hi"] as const;
export const CATEGORIES = [
  "wedding",
  "birthday",
  "housewarming",
  "baby",
  "festival",
  "corporate",
] as const;
export const RSVP_STATUSES = ["pending", "accepted", "maybe", "declined"] as const;
export const PLAN_KEYS = ["starter", "premium", "family"] as const;

export const TemplateCopySchema = z.object({
  hostNames: z.string().max(160).default(""),
  headline: z.string().max(160).default(""),
  message: z.string().max(800).default(""),
});
export type TemplateCopyInput = z.infer<typeof TemplateCopySchema>;

export const CreateEventSchema = z.object({
  templateId: z.string().uuid(),
  title: z.string().min(2).max(120),
  category: z.enum(CATEGORIES),
  defaultLanguage: z.enum(LANGUAGES),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  eventTime: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .optional()
    .nullable(),
  timezone: z.string().max(64).default("America/New_York"),
  venueName: z.string().max(160).optional().nullable(),
  venueAddress: z.string().max(400).optional().nullable(),
  mapUrl: z.string().url().max(2000).optional().nullable(),
  rsvpDeadline: z.string().datetime().optional().nullable(),
  content: z.object({
    en: TemplateCopySchema.optional(),
    te: TemplateCopySchema.optional(),
    hi: TemplateCopySchema.optional(),
  }),
});

export const UpdateEventSchema = CreateEventSchema.partial().extend({
  status: z.enum(["draft", "published", "archived"]).optional(),
});

export const GuestSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(160).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  guest_group: z.string().max(60).default("family"),
  preferred_language: z.enum(LANGUAGES).default("en"),
});

export const RsvpSubmitSchema = z.object({
  eventCode: z.string().min(4).max(64),
  guestCode: z.string().max(64).optional(),
  guestName: z.string().min(1).max(120),
  status: z.enum(RSVP_STATUSES).refine((v) => v !== "pending", {
    message: "Cannot submit pending status",
  }),
  plusOnes: z.number().int().min(0).max(20).default(0),
  message: z.string().max(800).optional().nullable(),
  dietaryPreference: z.string().max(160).optional().nullable(),
});

export const CheckoutSchema = z.object({
  plan: z.enum(PLAN_KEYS),
  eventId: z.string().uuid().optional(),
  mode: z.enum(["payment", "subscription"]).default("subscription"),
});

export const FaqAskSchema = z.object({
  question: z.string().min(2).max(500),
});
