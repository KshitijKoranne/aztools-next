import { ArrowDown } from "lucide-react";

import { AppTile } from "@/components/app-tile";
import { SiteShell } from "@/components/site-shell";
import { directoryApps } from "@/data/apps";
import { jsonLd, siteName, siteUrl } from "@/lib/seo";

export default function Home() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteName,
          url: siteUrl,
          description: "A small collection of useful apps by KJR Labs.",
        })}
      />

      <main id="main-content">
        <section className="landing-hero" aria-labelledby="page-title">
          <div className="landing-hero__copy">
            <p className="eyebrow">
              <span className="eyebrow__rule" aria-hidden="true" />
              Small web tools by KJR Labs
            </p>
            <h1 id="page-title">
              Useful tools for everyday work.
            </h1>
            <p className="landing-hero__lede">
              Simple web apps for the little tasks that keep things moving.
            </p>
            <a className="text-link" href="#apps">
              See the tools
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="apps-section" id="apps" aria-labelledby="apps-title">
          <div className="section-heading">
            <h2 id="apps-title">Tools</h2>
          </div>

          <div className="app-grid">
            {directoryApps.map((app) => (
              <AppTile key={app.id} app={app} />
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
