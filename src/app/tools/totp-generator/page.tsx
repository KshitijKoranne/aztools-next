import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "TOTP Generator",
  description: "Generate time-based one-time passwords compatible with Google Authenticator.",
  alternates: { canonical: "https://aztools.in/tools/totp-generator" },
};

export default function TotpGeneratorPage() {
  return <Client />;
}
