import LongBranchMonograph from "@/components/LongBranchMonograph";
import area from "@/content/long-branch";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

const pageUrl = absoluteUrl("/" + area.slug);

export const metadata = {
  title: area.metaTitle,
  description: area.metaDescription,
  keywords: area.keywords,
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    type: "article",
    url: pageUrl,
    siteName: SITE_NAME,
    title: area.title,
    description: area.metaDescription,
    locale: "en_US",
    publishedTime: area.datePublished,
    modifiedTime: area.dateModified,
  },
  twitter: {
    card: "summary",
    title: area.metaTitle,
    description: area.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

function buildJsonLd() {
  const place = {
    "@type": "Place",
    name: area.placeName,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Fairfax",
      addressRegion: "VA",
      postalCode: "22032",
      addressCountry: "US",
    },
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Fairfax County, Virginia",
      containedInPlace: {
        "@type": "State",
        name: "Virginia",
      },
    },
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": pageUrl + "#article",
    headline: area.title,
    description: area.metaDescription,
    url: pageUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    datePublished: area.datePublished,
    dateModified: area.dateModified,
    inLanguage: "en-US",
    author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    about: place,
    keywords: area.keywords.join(", "),
    articleSection: area.sections.map((section) => section.heading),
    citation: area.references.map((ref) => ref.text),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: area.breadcrumbName, item: pageUrl },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: area.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return [article, breadcrumbs, faqPage];
}

export default function Page() {
  return (
    <>
      {buildJsonLd().map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
      <LongBranchMonograph area={area} />
    </>
  );
}
