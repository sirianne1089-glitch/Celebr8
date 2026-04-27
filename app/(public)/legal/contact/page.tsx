export const metadata = { title: "Contact" };

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@celebr8.app";
  return (
    <article className="container max-w-3xl py-14">
      <h1 className="font-display text-4xl">Contact</h1>
      <p className="text-ink-soft mt-3">
        We're a small team that loves celebrations. Email us — we typically respond within
        one business day.
      </p>
      <div className="mt-6 rounded-2xl border border-line bg-white/80 p-6">
        <p className="font-display text-xl">Support</p>
        <a className="block mt-1 text-gold-500" href={`mailto:${email}`}>{email}</a>
        <p className="text-sm text-ink-mute mt-4">For corporate inquiries, please mention your company and expected event scale.</p>
      </div>
    </article>
  );
}
