import Link from "next/link";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-inner">
            <Link href="/" className="site-brand">
              {SITE_NAME}
            </Link>
            <nav className="site-nav" aria-label="Primary">
              <Link href="/">Home</Link>
              <Link href="/#areas">Areas</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="site-inner">
            <span>{SITE_NAME}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
