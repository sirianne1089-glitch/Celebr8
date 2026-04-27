export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <article className="container max-w-3xl py-14">
      <h1 className="font-display text-4xl">Privacy Policy</h1>
      <p className="text-ink-mute text-sm mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-6 space-y-4 text-ink-soft leading-relaxed">
        <p>Celebr8 collects only what is needed to power your invitations: your account email, the event details you enter, the guest list you upload, and the RSVP responses you receive.</p>
        <h2 className="font-display text-2xl mt-6">What we collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Account: email, name, password hash, login timestamps.</li>
          <li>Event content: names, dates, venues, photos and messages you provide.</li>
          <li>Guests: names, emails or phone numbers if you import them.</li>
          <li>RSVPs: status (accepted/maybe/declined), optional message, plus-ones.</li>
          <li>Analytics: anonymised invite-open events; never raw IP addresses.</li>
        </ul>
        <h2 className="font-display text-2xl mt-6">What we do not collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Card numbers — payments are processed by Stripe.</li>
          <li>Private device identifiers, biometrics or contact lists.</li>
        </ul>
        <h2 className="font-display text-2xl mt-6">How we secure data</h2>
        <p>All data is stored in Supabase Postgres with row-level security. Service-role keys are never exposed to the browser. Stripe webhooks are signature-verified.</p>
        <h2 className="font-display text-2xl mt-6">Your rights</h2>
        <p>You can delete your account at any time from Settings. We will purge your events, guests and RSVPs within 7 days.</p>
        <h2 className="font-display text-2xl mt-6">Contact</h2>
        <p>Questions? Email <a className="underline" href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@celebr8.app"}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@celebr8.app"}</a>.</p>
      </div>
    </article>
  );
}
