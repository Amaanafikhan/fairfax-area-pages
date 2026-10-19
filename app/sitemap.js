import longBranch from "@/content/long-branch";
import { absoluteUrl } from "@/lib/site";

export default function sitemap() {
  return [
    { url: absoluteUrl("/"), lastModified: longBranch.dateModified },
    { url: absoluteUrl("/" + longBranch.slug), lastModified: longBranch.dateModified },
  ];
}
