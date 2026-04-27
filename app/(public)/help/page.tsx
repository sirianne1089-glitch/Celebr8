import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { AskAi } from "@/components/marketing/AskAi";

export const metadata = { title: "Help & Support" };

export default function HelpPage() {
  return (
    <div className="container py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="section-eyebrow">Help center</p>
        <h1 className="font-display text-4xl md:text-5xl mt-2">We're here to help.</h1>
        <p className="text-ink-soft mt-3">
          Search the FAQ, ask the assistant, or email us at{" "}
          <a className="text-ink underline" href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@celebr8.app"}`}>
            {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@celebr8.app"}
          </a>
          .
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-10">
        <AskAi />
      </div>

      <FaqAccordion />
    </div>
  );
}
