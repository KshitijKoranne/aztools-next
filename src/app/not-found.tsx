import Link from "next/link";

import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <main className="not-found-page" id="main-content">
        <p className="eyebrow">404 / Not found</p>
        <h1>That page is not on the shelf.</h1>
        <p className="not-found-page__copy">
          The address may have moved, or it may not exist.
        </p>
        <Link className="text-link" href="/">
          Return to AZ Tools
        </Link>
      </main>
    </SiteShell>
  );
}
