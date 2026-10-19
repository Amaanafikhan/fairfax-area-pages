import AreaArticle from "@/components/AreaArticle";
import area from "@/content/areas/ravensworth";
import { buildAreaJsonLd, buildAreaMetadata } from "@/lib/schema";

export const metadata = buildAreaMetadata(area);

export default function Page() {
  const jsonLd = buildAreaJsonLd(area);
  return (
    <>
      {jsonLd.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
      <AreaArticle area={area} />
    </>
  );
}
