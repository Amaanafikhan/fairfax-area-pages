"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./LongBranchMonograph.module.css";

function LeadList({ items }) {
  return (
    <ul className={styles.leadList}>
      {items.map((item) => (
        <li key={item.lead}>
          <strong>{item.lead}</strong> {item.text}
        </li>
      ))}
    </ul>
  );
}

function DataTable({ caption, head, rows }) {
  return (
    <div className={styles.tableWrap} role="region" aria-label={caption} tabIndex={0}>
      <table className={head.length > 2 ? styles.table + " " + styles.wide : styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={i}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ block }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h3":
      return <h3 className={styles.h3}>{block.text}</h3>;
    case "ul":
      return <LeadList items={block.items} />;
    case "table":
      return <DataTable caption={block.caption} head={block.head} rows={block.rows} />;
    case "note":
      return (
        <aside className={styles.note} aria-label="Note">
          {block.text}
        </aside>
      );
    default:
      return null;
  }
}

function formatDate(iso) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export default function LongBranchMonograph({ area }) {
  const toc = [
    { id: "summary", heading: "Executive Summary" },
    ...area.sections.map((s) => ({ id: s.id, heading: s.heading })),
    { id: "faq", heading: "Frequently Asked Questions" },
    { id: "references", heading: "References and Disclaimers" },
  ];
  const [tocIds] = useState(() => toc.map((item) => item.id));
  const active = useActiveSection(tocIds);
  const [openFaqs, setOpenFaqs] = useState(() => new Set());
  const allOpen = openFaqs.size === area.faqs.length;

  function toggleFaq(index, isOpen) {
    setOpenFaqs((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(index);
      else next.delete(index);
      return next;
    });
  }

  function toggleAll() {
    setOpenFaqs(allOpen ? new Set() : new Set(area.faqs.map((_, i) => i)));
  }

  return (
    <article className={styles.article}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li aria-current="page">{area.breadcrumbName}</li>
        </ol>
      </nav>

      <header className={styles.header}>
        <h1 className={styles.h1}>{area.title}</h1>
        <p className={styles.dek}>{area.note}</p>
        <p>{area.intro}</p>
        <p className={styles.dates}>
          Published <time dateTime={area.datePublished}>{formatDate(area.datePublished)}</time>
        </p>
      </header>

      <section id="summary" aria-labelledby="summary-heading" className={styles.section}>
        <h2 id="summary-heading" className={styles.h2}>
          Long Branch at a Glance
        </h2>
        <DataTable caption="Quick facts" head={["Quick fact", "Detail"]} rows={area.glance} />

        <div className={styles.takeaways}>
          <h3 className={styles.takeawaysTitle}>Key Takeaways</h3>
          <LeadList items={area.takeaways} />
        </div>

        <dl className={styles.metrics}>
          {area.metrics.map((metric) => (
            <div key={metric.label} className={styles.metric}>
              <dt className={styles.metricLabel}>{metric.label}</dt>
              <dd className={styles.metricValue}>{metric.value}</dd>
              <dd className={styles.metricNote}>{metric.note}</dd>
            </div>
          ))}
        </dl>
      </section>

      <nav aria-labelledby="toc-heading" className={styles.toc}>
        <h2 id="toc-heading" className={styles.tocTitle}>
          Contents
        </h2>
        <ol>
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={"#" + item.id}
                className={active === item.id ? styles.tocActive : undefined}
                aria-current={active === item.id ? "location" : undefined}
              >
                {item.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {area.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={section.id + "-heading"}
          className={styles.section}
        >
          <h2 id={section.id + "-heading"} className={styles.h2}>
            {section.heading}
          </h2>
          {section.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </section>
      ))}

      <section id="faq" aria-labelledby="faq-heading" className={styles.section}>
        <div className={styles.faqHeader}>
          <h2 id="faq-heading" className={styles.h2}>
            Frequently Asked Questions
          </h2>
          <button type="button" className={styles.textButton} onClick={toggleAll}>
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
        <div className={styles.faqList}>
          {area.faqs.map((faq, i) => (
            <details
              key={faq.q}
              className={styles.faq}
              open={openFaqs.has(i)}
              onToggle={(e) => toggleFaq(i, e.currentTarget.open)}
            >
              <summary>
                <h3 className={styles.faqQ}>{faq.q}</h3>
              </summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="references" aria-labelledby="references-heading" className={styles.section}>
        <h2 id="references-heading" className={styles.h2}>
          References
        </h2>
        <ol className={styles.references}>
          {area.references.map((ref) => (
            <li key={ref.url + ref.text}>
              {ref.text}{" "}
              <a href={ref.url} rel="noopener noreferrer" target="_blank">
                {ref.url.replace(/^https:\/\//, "")}
              </a>
            </li>
          ))}
        </ol>

        <h2 className={styles.h2}>Regulatory and Legal Disclaimers</h2>
        <ul className={styles.disclaimers}>
          {area.disclaimers.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
