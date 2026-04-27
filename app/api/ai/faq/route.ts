import { NextRequest, NextResponse } from "next/server";
import { FaqAskSchema } from "@/lib/validators";

/**
 * Deterministic FAQ assistant. Looks up the closest match from a curated list.
 * Avoids exposing arbitrary AI provider responses for MVP. If AI_PROVIDER_API_KEY
 * is configured, we still keep the curated answers as the source of truth and
 * only use the model for paraphrase (post-MVP).
 */
const KNOWLEDGE: { q: string; a: string; tags: string[] }[] = [
  {
    q: "How do I create an invite?",
    a: "Browse /templates, pick a design, customise the names, date, venue and message in the editor, then click Save. You'll be prompted to sign up if you haven't already.",
    tags: ["create", "invite", "start", "begin", "make"],
  },
  {
    q: "How does WhatsApp sharing work?",
    a: "Celebr8 generates a public invite URL plus a WhatsApp deeplink. Tap it on your phone and it opens WhatsApp with the message pre-filled — choose your contact and send.",
    tags: ["whatsapp", "share", "send"],
  },
  {
    q: "When is the watermark removed?",
    a: "Immediately after Stripe confirms your payment via webhook. The 'preview' watermark is replaced automatically — no further action needed.",
    tags: ["watermark", "remove", "preview", "payment"],
  },
  {
    q: "Which languages are supported?",
    a: "All templates support English, Telugu and Hindi. You can edit each language independently and let guests switch on the public invite page.",
    tags: ["language", "telugu", "hindi", "english"],
  },
  {
    q: "Can guests RSVP from a phone?",
    a: "Yes. The public invite page is mobile-first with envelope reveal, RSVP form, add-to-calendar and Google Maps directions.",
    tags: ["rsvp", "phone", "mobile", "guest"],
  },
  {
    q: "Can I import guests via CSV?",
    a: "Yes, on Premium and Family plans. CSV columns: name,email,phone,group,language. Validation errors are reported per row.",
    tags: ["csv", "import", "guests"],
  },
  {
    q: "What about refunds?",
    a: "We offer a 7-day fair-use refund for events that have not yet been shared. See /legal/refund for details.",
    tags: ["refund", "cancel"],
  },
  {
    q: "How do I contact support?",
    a: "Email " + (process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@celebr8.app") + " — we typically respond within one business day.",
    tags: ["contact", "support", "email", "help"],
  },
];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = FaqAskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a valid question (2–500 chars)" }, { status: 400 });
  }
  const q = parsed.data.question.toLowerCase();

  // Naive keyword scoring against tags + question text
  let best = { score: 0, ans: "" };
  for (const k of KNOWLEDGE) {
    let score = 0;
    for (const t of k.tags) if (q.includes(t)) score += 2;
    if (q.includes(k.q.toLowerCase().slice(0, 6))) score += 1;
    if (score > best.score) best = { score, ans: k.a };
  }

  if (best.score === 0) {
    return NextResponse.json({
      answer:
        "I couldn't find a direct answer in the help center. For specific questions, please email " +
        (process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@celebr8.app") +
        " and we'll respond within one business day.",
    });
  }
  return NextResponse.json({ answer: best.ans });
}
