import longBranch from "@/content/areas/long-branch";
import ravensworth from "@/content/areas/ravensworth";
import westSpringfield from "@/content/areas/west-springfield";
import northSpringfield from "@/content/areas/north-springfield";
import burkeCentre from "@/content/areas/burke-centre";

export const AREAS = [longBranch, ravensworth, westSpringfield, northSpringfield, burkeCentre];

export function getArea(slug) {
  return AREAS.find((a) => a.slug === slug);
}
