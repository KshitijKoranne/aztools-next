import { ArrowDown, ArrowUpRight, FileStack } from "lucide-react";

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
              A small collection by KJR Labs
            </p>
            <h1 id="page-title">
              Useful tools for the <span>work in between.</span>
            </h1>
            <p className="landing-hero__lede">
              Focused apps for the small tasks that keep things moving.
            </p>
            <a className="text-link" href="#apps">
              Browse the collection
              <ArrowDown aria-hidden="true" />
            </a>
          </div>

          <aside className="collection-note" aria-label="AZ Tools collection note">
            <div className="collection-note__topline">
              <span>AZ / 001</span>
              <span>Live collection</span>
            </div>
            <div className="collection-note__icon" aria-hidden="true">
              <FileStack strokeWidth={1.4} />
            </div>
            <p>One useful thing at a time.</p>
            <a className="collection-note__link" href="#apps">
              See what is available
              <ArrowUpRight aria-hidden="true" />
            </a>
          </aside>
        </section>

        <section className="apps-section" id="apps" aria-labelledby="apps-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Available now</p>
              <h2 id="apps-title">Start with PDF World.</h2>
            </div>
            <p>
              The first app on the shelf is ready when you are. More focused tools will join it over time.
            </p>
          </div>

          <div className="app-grid">
            {directoryApps.map((app) => (
              <AppTile key={app.id} app={app} />
            ))}
          </div>

          <p className="future-note">
            <span aria-hidden="true">+</span>
            More tools will join this shelf over time.
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
