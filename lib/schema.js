import { SITE_NAME, absoluteUrl } from "./site";

// Builds the Article, BreadcrumbList and FAQPage JSON-LD for an area monograph.
// FAQ entries come from the same data the page renders, so the schema always
// matches the visible questions and answers word for word.
export function buildAreaJsonLd(area) {
  const url = absoluteUrl("/" + area.slug);

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url + "#article",
    headline: area.title,
    description: area.metaDescription,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: area.datePublished,
    dateModified: area.dateModified,
    inLanguage: "en-US",
    articleSection: "Area Guides",
    keywords: area.keywords.join(", "),
    author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    about: {
      "@type": "Place",
      name: area.placeName,
      address: {
        "@type": "PostalAddress",
        addressRegion: "VA",
        addressCountry: "US",
        postalCode: area.primaryZip,
      },
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Fairfax County, Virginia",
      },
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: area.breadcrumbName, item: url },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: area.faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return [article, breadcrumbs, faq];
}

export function buildAreaMetadata(area) {
  const url = absoluteUrl("/" + area.slug);
  return {
    title: area.metaTitle,
    description: area.metaDescription,
    keywords: area.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: area.metaTitle,
      description: area.metaDescription,
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: area.datePublished,
      modifiedTime: area.dateModified,
    },
    twitter: {
      card: "summary_large_image",
      title: area.metaTitle,
      description: area.metaDescription,
    },
    robots: { index: true, follow: true },
  };
}
