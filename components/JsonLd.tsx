import {
  FAQ_ITEMS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

export function JsonLd({
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  faqItems = FAQ_ITEMS,
}: {
  title?: string;
  description?: string;
  faqItems?: readonly { question: string; answer: string }[];
}) {
  const url = absoluteUrl("/");

  const software = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JSON Format Online — json.",
    alternateName: [
      "JSON Formatter",
      "JSON Beautifier",
      "Online JSON Format Tool",
    ],
    url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description,
    featureList: [
      "Format JSON online",
      "JSON beautifier / pretty print",
      "JSON validator with line errors",
      "JSON minifier",
      "JSON tree viewer",
      "Local browser processing",
    ],
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to format JSON online",
    description:
      "Format and beautify JSON in your browser using a free online JSON formatter.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        name: "Paste or upload JSON",
        text: "Paste JSON into the editor or upload a .json file.",
      },
      {
        "@type": "HowToStep",
        name: "Choose indentation",
        text: "Select 2 spaces, 4 spaces, or Tab.",
      },
      {
        "@type": "HowToStep",
        name: "Format JSON",
        text: "Click Format or press Ctrl+Enter to beautify the JSON.",
      },
      {
        "@type": "HowToStep",
        name: "Copy or download",
        text: "Copy the formatted JSON or download it as a .json file.",
      },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "JSON Format",
        item: url,
      },
    ],
  };

  const graphs = [software, website, howTo, faq, breadcrumb];

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    applicationCategory: "DeveloperApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description,
  };

  const all = [...graphs, softwareApp] as const;

  return (
    <>
      {all.map((data) => (
        <script
          key={String((data as { "@type"?: string })["@type"])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
