import type { Language, TemplateCopy } from "./database";

export type DraftInvite = {
  templateId: string;
  templateSlug?: string;
  title: string;
  category: string;
  defaultLanguage: Language;
  eventDate?: string;
  eventTime?: string;
  timezone?: string;
  venueName?: string;
  venueAddress?: string;
  mapUrl?: string;
  rsvpDeadline?: string;
  content: Partial<Record<Language, TemplateCopy>>;
  photoUrl?: string;
};

export type PublicEvent = {
  id: string;
  title: string;
  category: string;
  inviteCode: string;
  defaultLanguage: Language;
  eventDate: string | null;
  eventTime: string | null;
  timezone: string;
  venueName: string | null;
  venueAddress: string | null;
  mapUrl: string | null;
  rsvpDeadline: string | null;
  isWatermarkRemoved: boolean;
  template: {
    slug: string;
    baseLayout: string;
    config: { colors: { primary: string; accent: string; background: string; text: string }; motif?: string };
    supportsPhoto: boolean;
  };
  content: Record<Language, TemplateCopy & { photoUrl?: string | null }>;
};
