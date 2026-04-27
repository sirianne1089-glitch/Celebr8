# Celebr8

Premium digital invitation platform for Indian and NRI celebrations — weddings,
birthdays, housewarmings, baby ceremonies, festivals, and corporate events.
Telugu, English and Hindi out of the box.

Built on **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion +
Supabase + Stripe**, deployable to **Vercel**.

---

## Highlights

- 50 production-ready templates across 6 categories, fully data-driven (10 base
  layouts + config variations).
- Premium animated landing page with scroll-storytelling, floating 3D invitation
  cards, particle field and a video-style hero — all rendered with CSS + Framer
  Motion (no video file required).
- Try-before-login editor with `localStorage` draft persistence and a polite
  auth gate.
- Dashboard with events, guest manager, CSV import, share view (link + QR +
  WhatsApp deep-link), live RSVP tracker and CSV export.
- Mobile-first responsive design across hero, editor, public invite and
  dashboard.
- Stripe checkout for Starter ($4.99/event), Premium ($9.99/event) and Family
  ($14.99/month) — watermark removed only after a verified Stripe webhook.
- Supabase Auth + Row-Level Security; service-role key never reaches the
  browser; Stripe webhook signature is enforced.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Environment variables
cp .env.example .env.local
# fill in Supabase + Stripe keys

# 3. Run dev server
npm run dev          # http://localhost:3000
```

### Environment variables

See [`.env.example`](./.env.example). Required for production:

| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public origin (e.g. `https://celebr8.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** For webhooks and RSVP submit. |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_PRICE_STARTER` | Stripe price id for Starter |
| `STRIPE_PRICE_PREMIUM` | Stripe price id for Premium |
| `STRIPE_PRICE_FAMILY` | Stripe price id for Family (subscription) |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Public support email |

---

## Database setup

Run the migration and seed in Supabase:

```bash
# Using the Supabase CLI
supabase link --project-ref <your-ref>
supabase db push                                          # applies supabase/migrations/0001_init.sql
psql "$SUPABASE_DB_URL" -f supabase/seed.sql              # loads plans + 50 templates
```

Or paste them into the Supabase SQL editor in this order:

1. `supabase/migrations/0001_init.sql` — tables, enums, indexes, triggers, RLS,
   storage buckets.
2. `supabase/seed.sql` — `plans` and 50 launch templates.

The migration enables RLS on every user-owned table and allows public read on
`templates` and `plans`. RSVP submissions go through the server route which
uses the service role.

---

## Stripe setup

1. Create three Products in Stripe → Prices:
   - Starter ($4.99 one-time per event)
   - Premium ($9.99 one-time per event)
   - Family ($14.99/mo subscription)
2. Copy the `price_…` ids into `STRIPE_PRICE_STARTER`,
   `STRIPE_PRICE_PREMIUM`, `STRIPE_PRICE_FAMILY`.
3. Create a webhook endpoint pointed at `https://<your-domain>/api/webhooks/stripe`.
   Subscribe to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

The `is_watermark_removed` flag on `events` is set **only** after a confirmed
`checkout.session.completed` webhook with matching metadata — never on the
redirect URL.

---

## Deploy to Vercel

1. Push this repository to GitHub (or any git remote).
2. Import the project into Vercel.
3. Add every variable from `.env.example` to **Project → Settings → Environment
   Variables** for Production *and* Preview.
4. Vercel auto-detects Next.js and runs `npm run build`. The output is
   serverless-ready.
5. Add your custom domain on Vercel; HTTPS is configured automatically.

---

## Folder structure

```
app/
  (public)/            # marketing site, templates, editor, pricing, help, legal
  auth/                # login, signup, reset, OAuth callback
  dashboard/           # protected dashboard, event flows, billing, settings
  invite/[code]/       # public invite page (envelope reveal, RSVP)
  api/                 # all server routes
components/
  marketing/           # hero, how-it-works, categories, pricing, FAQ
  templates/           # template card, filter, preview client
  editor/              # pre-login editor
  dashboard/           # shell, event editor, guests, share, settings, billing
  invite/              # public invite + RSVP form
  brand/               # Logo, LogoMark
  auth/                # login, signup, reset forms
lib/
  supabase/            # client.ts, server.ts, admin.ts, middleware.ts
  stripe.ts            # lazy Stripe singleton
  template-engine/     # 10 base layouts + renderer
  validators.ts        # Zod schemas for every API endpoint
  permissions.ts       # plan enforcement helpers
  utils.ts             # cn, date/time formatting, deep links
supabase/
  migrations/0001_init.sql
  seed.sql
public/
  logo.svg, logo-mark.svg, favicon.svg
types/
  database.ts          # row types
  app.ts               # PublicEvent, DraftInvite
middleware.ts          # Supabase session refresh
```

---

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Run prod build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:types` | Regenerate `types/database.ts` from a linked Supabase project |

---

## Security

- Row-Level Security on `events`, `event_content`, `guests`, `payments`,
  `subscriptions`, `invite_opens`, `audit_logs`.
- Public invite data is served via `/api/invite/[code]` which sanitizes the
  payload (no owner email, no billing).
- Zod validation on every server route input.
- Stripe webhook signature is verified on every request.
- `SUPABASE_SERVICE_ROLE_KEY` is referenced only in `lib/supabase/admin.ts`
  (server-only) and never in any client component.
- No screenshot blocking — instead, free previews carry a visible watermark
  removed only after a confirmed payment.

---

## Post-MVP roadmap

- Bulk WhatsApp via Twilio / 360dialog (paid messaging).
- SMS fallback.
- AI image-edit / portrait insertion.
- MP4 video render.
- Drag-and-drop designer.
- Expanded library to 680 templates.

---

© Celebr8. Built for every celebration.
