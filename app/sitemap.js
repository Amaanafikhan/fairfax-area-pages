import { AREAS } from "@/lib/areas";
import { absoluteUrl } from "@/lib/site";

export default function sitemap() {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...AREAS.map((area) => ({
      url: absoluteUrl("/" + area.slug),
      lastModified: area.dateModified,
      changeFrequency: "yearly",
      priority: 0.8,
    })),
  ];
}
