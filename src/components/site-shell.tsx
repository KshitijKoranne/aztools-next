import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-page">
      <a className="site-skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-wordmark" href="/" aria-label="AZ Tools home">
          <Image className="site-wordmark__logo" src="/favicon-32x32.png" alt="" width={40} height={40} priority />
        </Link>

        <span className="site-header__title">AZ Tools</span>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="https://kjrlabs.in/" target="_blank" rel="noopener noreferrer">
            KJR Labs
            <ArrowUpRight aria-hidden="true" />
          </a>
          <Link href="/privacy-policy">Privacy</Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>AZ Tools is a small collection of useful apps by KJR Labs.</p>
        <p>© {new Date().getFullYear()} KJR Labs</p>
      </div>
    </footer>
  );
}
