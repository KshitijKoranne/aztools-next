import type { Metadata } from "next";

import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "The AZ Tools privacy policy.",
  alternates: { canonical: "https://aztools.in/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <main className="policy-page" id="main-content">
        <p className="eyebrow">AZ Tools / Privacy</p>
        <h1>Privacy policy</h1>
        <p className="policy-page__updated">Last updated: August 4, 2026</p>
        <p className="policy-page__intro">
          AZ Tools is a directory operated by KJR Labs. This page explains what happens when you visit the directory. Applications linked from this site may have their own privacy policies.
        </p>

        <section>
          <h2>What this site collects</h2>
          <p>
            The directory does not ask you to create an account, submit a form, or upload files. If privacy-respecting analytics are enabled, the information collected is limited to site-usage events needed to understand whether the directory is working. No attempt is made to identify you personally.
          </p>
        </section>

        <section>
          <h2>Links to other applications</h2>
          <p>
            AZ Tools links to separately hosted applications, including PDF World. When you open one of those applications, its own hosting, analytics, cookies, storage, and privacy terms apply. Please read the relevant policy before using a service with sensitive information.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about this policy can be sent to <a href="mailto:kshitij.koranne@live.com">kshitij.koranne@live.com</a>.
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
