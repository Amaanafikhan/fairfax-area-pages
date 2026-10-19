"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./AreaArticle.module.css";

function Block({ block }) {
  switch (block.type) {
    case "h3":
      return <h3 className={styles.subheading}>{block.text}</h3>;
    case "list":
      return (
        <ul className={styles.list}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "table":
      return (
        <figure className={styles.tableFigure}>
          <div
            className={styles.tableScroll}
            role="region"
            aria-label={block.caption}
            tabIndex={0}
          >
            <table className={styles.table}>
              <caption>{block.caption}</caption>
              <thead>
                <tr>
                  {block.head.map((cell) => (
                    <th key={cell} scope="col">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th key={i} scope="row">
                          {cell}
                        </th>
                      ) : (
                        <td key={i}>{cell}</td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );
    case "note":
      return <p className={styles.note}>{block.text}</p>;
    default:
      return <p>{block.text}</p>;
  }
}

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  const panelId = "faq-panel-" + index;
  const buttonId = "faq-button-" + index;
  return (
    <div className={styles.faqItem}>
      <h3 className={styles.faqQuestion}>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{item.q}</span>
          <span className={styles.faqIcon} aria-hidden="true">
            {open ? "−" : "+"}
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={styles.faqAnswer}
        hidden={!open}
      >
        <p>{item.a}</p>
      </div>
    </div>
  );
}

export default function AreaArticle({ area }) {
  return (
    <article className={styles.article} itemScope itemType="https://schema.org/Article">
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li aria-current="page">{area.breadcrumbName}</li>
        </ol>
      </nav>

      <header className={styles.header}>
        <p className={styles.kicker}>{area.kicker}</p>
        <h1 itemProp="headline">{area.title}</h1>
        <p className={styles.dek}>{area.dek}</p>
      </header>

      <section aria-labelledby="summary-heading" className={styles.takeaways}>
        <h2 id="summary-heading">Executive Summary</h2>
        {area.summary.map((text) => (
          <p key={text.slice(0, 40)}>{text}</p>
        ))}
        <h3 className={styles.takeawaysLabel}>Key Takeaways</h3>
        <ul>
          {area.takeaways.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="metrics-heading" className={styles.metricsSection}>
        <h2 id="metrics-heading" className={styles.visuallyHidden}>
          Key Metrics
        </h2>
        <dl className={styles.metrics}>
          {area.metrics.map((m) => (
            <div key={m.label} className={styles.metric}>
              <dt>{m.label}</dt>
              <dd>
                <span className={styles.metricValue}>{m.value}</span>
                <span className={styles.metricNote}>{m.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <nav aria-labelledby="toc-heading" className={styles.toc}>
        <h2 id="toc-heading">Contents</h2>
        <ol>
          {area.sections.map((s) => (
            <li key={s.id}>
              <a href={"#" + s.id}>{s.heading}</a>
            </li>
          ))}
          <li>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
          <li>
            <a href="#references">References and Disclaimers</a>
          </li>
        </ol>
      </nav>

      <div className={styles.body} itemProp="articleBody">
        {area.sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={s.id + "-heading"}>
            <h2 id={s.id + "-heading"}>{s.heading}</h2>
            {s.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </section>
        ))}

        <section id="faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading">Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {area.faqs.map((item, i) => (
              <FaqItem key={item.q} item={item} index={i} />
            ))}
          </div>
        </section>

        <footer id="references" className={styles.references} aria-labelledby="references-heading">
          <h2 id="references-heading">References and Disclaimers</h2>
          <h3 className={styles.subheading}>Academic and Primary References</h3>
          <ol className={styles.refList}>
            {area.references.map((r) => (
              <li key={r.text}>
                {r.url ? (
                  <a href={r.url} rel="noopener noreferrer" target="_blank">
                    {r.text}
                  </a>
                ) : (
                  r.text
                )}
              </li>
            ))}
          </ol>
          <h3 className={styles.subheading}>Statutory and Editorial Disclaimers</h3>
          {area.disclaimers.map((d) => (
            <p key={d.slice(0, 40)} className={styles.disclaimer}>
              {d}
            </p>
          ))}
        </footer>
      </div>
    </article>
  );
}
