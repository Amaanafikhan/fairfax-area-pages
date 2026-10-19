import Link from "next/link";
import longBranch from "@/content/long-branch";
import { SITE_NAME } from "@/lib/site";
import styles from "./page.module.css";

const areas = [longBranch];

export const metadata = {
  title: SITE_NAME + ": Fairfax County Area Guides",
  description: "Reference guides to Fairfax County, Virginia communities: history, geography, housing, schools and assessment.",
};

export default function Home() {
  return (
    <div className="container">
      <h1 className={styles.title}>Fairfax County Area Guides</h1>
      <ul className={styles.grid}>
        {areas.map((area) => (
          <li key={area.slug}>
            <Link href={"/" + area.slug} className={styles.card}>
              <span className={styles.cardTitle}>{area.placeName}</span>
              <span className={styles.cardText}>{area.metaDescription}</span>
              <span className={styles.cardLink}>Read about {area.shortName} →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
