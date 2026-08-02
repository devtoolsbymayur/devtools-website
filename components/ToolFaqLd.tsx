import { FAQ } from "@/components/SEOContent";
import type { ToolFaqItem } from "@/lib/tool-faq";

export function ToolFaqLd({
  heading,
  items,
}: {
  heading: string;
  items: readonly ToolFaqItem[];
}) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <FAQ items={items} heading={heading} />
    </>
  );
}
