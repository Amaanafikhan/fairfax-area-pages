import Link from "next/link";
import "./globals.css";
import { HEADER_BUTTON, HEADER_PHONE, NAV_LINKS, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f9fb",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-US">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container site-header-inner">
            <Link href="/" className="brand" aria-label={SITE_NAME + " home"}>
              <span className="brand-mark" aria-hidden="true">
                HF
              </span>
              <span className="brand-divider" aria-hidden="true" />
              <span className="brand-name">{SITE_NAME}</span>
            </Link>
            <nav className="site-nav" aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="header-actions">
              {HEADER_PHONE ? <span className="header-phone">{HEADER_PHONE}</span> : null}
              <Link href={HEADER_BUTTON.href} className="pill-button">
                {HEADER_BUTTON.label}
              </Link>
            </div>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container">{SITE_NAME}</div>
        </footer>
      </body>
    </html>
  );
}
