export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <article className="container max-w-3xl py-14 prose prose-ink">
      <h1 className="font-display text-4xl">Terms of Service</h1>
      <p className="text-ink-mute text-sm">Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        These Terms govern your use of Celebr8. By accessing the service you agree to these
        terms. Celebr8 is a digital invitation platform and does not guarantee delivery or
        engagement of recipients.
      </p>
      <h2>Accounts</h2>
      <p>You are responsible for keeping your account credentials secure. You must be at least 18 years old to purchase a paid plan.</p>
      <h2>Acceptable use</h2>
      <p>Do not use Celebr8 to send spam, run paid bulk messaging campaigns, or distribute unlawful or hateful content. Celebr8 reserves the right to suspend any account that violates these rules.</p>
      <h2>Payments</h2>
      <p>Paid plans and event purchases are processed by Stripe. Watermark removal is unlocked only after a confirmed Stripe webhook.</p>
      <h2>Intellectual property</h2>
      <p>Template designs, source code, branding and assets are owned by Celebr8. You retain ownership of the personal content you upload (names, photos, messages).</p>
      <h2>Liability</h2>
      <p>Celebr8 is provided "as is". We are not liable for missed RSVPs, delivery delays, or third-party service outages.</p>
      <h2>Changes</h2>
      <p>We may update these Terms periodically. Continued use of Celebr8 means you accept the latest version.</p>
    </article>
  );
}
