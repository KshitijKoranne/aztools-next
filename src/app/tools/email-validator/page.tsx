import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Email Validator",
  description: "Validate email addresses and check format correctness.",
  alternates: { canonical: "https://aztools.in/tools/email-validator" },
};

export default function EmailValidatorPage() {
  return <Client />;
}
