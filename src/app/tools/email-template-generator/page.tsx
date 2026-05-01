import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Email Template Generator",
  description: "Generate responsive HTML email templates for announcements, newsletters, and promotions.",
  alternates: { canonical: "https://aztools.in/tools/email-template-generator" },
};

export default function EmailTemplateGeneratorPage() {
  return <Client />;
}
