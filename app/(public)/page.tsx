import { HeroCinematic } from "@/components/marketing/HeroCinematic";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Categories } from "@/components/marketing/Categories";
import { PricingTeaser } from "@/components/marketing/PricingTeaser";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { FinalCta } from "@/components/marketing/FinalCta";

export default function HomePage() {
  return (
    <>
      <HeroCinematic />
      <HowItWorks />
      <Categories />
      <PricingTeaser />
      <FaqAccordion />
      <FinalCta />
    </>
  );
}
