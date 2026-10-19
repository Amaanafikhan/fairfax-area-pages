import Link from "next/link";
import { AREAS } from "@/lib/areas";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import styles from "./page.module.css";

export const metadata = {
  title: SITE_NAME + " | Fairfax County Area Guides",
  description:
    "Reference guides to Fairfax County, Virginia communities: geography, history, housing stock, schools context, transportation and the county assessment process.",
  alternates: { canonical: absoluteUrl("/") },
};

export default function HomePage() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Fairfax County Area Guides</h1>
      <section id="areas" aria-labelledby="areas-heading">
        <h2 id="areas-heading" className={styles.sectionTitle}>
          Read about Fairfax County communities
        </h2>
        <ul className={styles.grid}>
          {AREAS.map((area) => (
            <li key={area.slug} className={styles.card}>
              <h3>
                <Link href={"/" + area.slug}>{area.card.title}</Link>
              </h3>
              <p>{area.card.teaser}</p>
              <Link href={"/" + area.slug} className={styles.more}>
                {"Read about " + area.placeShortName}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
