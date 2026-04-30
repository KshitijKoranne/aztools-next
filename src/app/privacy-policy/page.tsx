import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/layouts/main-layout";

export const metadata: Metadata = {
  title: "Privacy Policy - AZ Tools",
  description:
    "Learn how AZ Tools protects your privacy. We don't collect personal data and process files locally in your browser.",
  alternates: { canonical: "https://aztools.in/privacy-policy" },
};

const LAST_UPDATED = "April 30, 2026";

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Welcome to AZ Tools (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are
                committed to protecting your privacy and ensuring the security of your
                personal information. This Privacy Policy explains how we collect, use,
                and safeguard your information when you use our online toolkit at
                aztools.in.
              </p>
              <p>
                Our core principle is simple: <strong>your data belongs to you</strong>.
                We&apos;ve designed AZ Tools to minimize data collection and maximize
                your privacy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Local Storage Data</h3>
                <p>We store the following information locally in your browser:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>
                    <strong>Theme preferences:</strong> Your choice of dark or light mode
                  </li>
                  <li>
                    <strong>Tool settings:</strong> Preferences for specific tools
                  </li>
                  <li>
                    <strong>Usage data:</strong> Tool-specific data like saved entries
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Important:</strong> This data never leaves your device and is
                  stored locally in your browser. We cannot access this information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <p>
                  We <strong>do not collect</strong> any personal information such as
                  names, email addresses, phone numbers, or any other personally
                  identifiable information.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">How We Use Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The limited information we collect is used solely to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Remember your preferences (theme) for a better user experience</li>
                <li>Store your tool-specific settings locally on your device</li>
                <li>Ensure our tools work properly and efficiently</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We do not use your information for marketing, advertising targeting, or
                sharing with third parties.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Google Services</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    <strong>Google Fonts:</strong> We use Google Fonts to display text.
                    Google may log your IP address when loading fonts.
                  </li>
                  <li>
                    <strong>Google DNS API:</strong> Our DNS lookup tool uses
                    Google&apos;s public DNS API to resolve domain queries.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">File Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Privacy-First Approach</h3>
                <p>
                  Most of our tools process files directly in your browser without
                  uploading them to our servers. This ensures maximum privacy and
                  security for your documents, images, and other files.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Server Processing</h3>
                <p>Some advanced features require server-side processing. When this occurs:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Files are processed temporarily and immediately deleted</li>
                  <li>No files are stored on our servers</li>
                  <li>Processing is done securely and privately</li>
                  <li>We cannot access or view your file contents</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We implement appropriate security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>HTTPS encryption:</strong> All data transmission is encrypted
                </li>
                <li>
                  <strong>Client-side processing:</strong> Most operations happen in
                  your browser
                </li>
                <li>
                  <strong>Minimal data collection:</strong> We collect only what&apos;s
                  necessary
                </li>
                <li>
                  <strong>No data storage:</strong> We don&apos;t store personal files
                  or information
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have the following rights regarding your data:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Access:</strong> View what data is stored locally in your browser
                </li>
                <li>
                  <strong>Deletion:</strong> Clear your local storage data at any time
                </li>
                <li>
                  <strong>Control:</strong> Choose which tools to use and what data to save
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you have any questions or requests regarding this Privacy Policy or
                your data, please contact us:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p>
                  <strong>Email:</strong> kshitij.koranne@live.com
                </p>
                <p>
                  <strong>Website:</strong> aztools.in
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Legal Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This Privacy Policy is governed by the laws of India. Any disputes
                arising from this policy or your use of AZ Tools will be resolved under
                Indian jurisdiction.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>AZ Tools is designed with privacy at its core:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>We don&apos;t collect personal information</li>
                <li>Most processing happens in your browser</li>
                <li>No files are stored on our servers</li>
                <li>You control your data completely</li>
                <li>Minimal use of third-party services</li>
              </ul>
              <p className="text-sm font-medium">
                Your privacy and security are our top priorities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
