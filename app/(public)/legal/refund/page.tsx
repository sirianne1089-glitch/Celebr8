export const metadata = { title: "Refund Policy" };

export default function RefundPage() {
  return (
    <article className="container max-w-3xl py-14">
      <h1 className="font-display text-4xl">Refund Policy</h1>
      <p className="text-ink-mute text-sm mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-6 space-y-4 text-ink-soft leading-relaxed">
        <p>Because Celebr8 unlocks digital content immediately upon payment, refunds are subject to the following rules:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>7-day fair-use refund.</strong> If you purchase a Starter or Premium event and have not yet shared the public link with guests, contact us within 7 days for a full refund.</li>
          <li><strong>Subscriptions.</strong> Family subscriptions can be cancelled anytime. Cancellation stops the next renewal; the current period is non-refundable.</li>
          <li><strong>Watermark removal.</strong> Once a watermark is removed and the invite is shared, the purchase is non-refundable.</li>
          <li><strong>Errors and outages.</strong> If a confirmed payment is not unlocked due to a Celebr8-side error, we will refund or reissue at our cost.</li>
        </ul>
        <p>To request a refund, email <a className="underline" href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@celebr8.app"}`}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@celebr8.app"}</a> with your order ID.</p>
      </div>
    </article>
  );
}
