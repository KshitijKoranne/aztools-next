import type { Metadata } from "next";
import TextEncryptionClient from "./client";

export const metadata: Metadata = {
  title: "Text Encryption",
  description:
    "Free online text encryption tool. Encrypt and decrypt text using AES-256-GCM with a password. Runs entirely in your browser — nothing is sent to any server.",
  keywords: [
    "text encryption",
    "text decryption",
    "AES encryption",
    "encrypt text online",
    "password encryption",
    "browser encryption",
  ],
  alternates: { canonical: "https://aztools.in/tools/text-encryption" },
  openGraph: {
    title: "Text Encryption - AZ Tools",
    description:
      "Encrypt and decrypt text with AES-256-GCM. Password-protected, runs entirely in-browser.",
    url: "https://aztools.in/tools/text-encryption",
    type: "website",
  },
};

export default function TextEncryptionPage() {
  return <TextEncryptionClient />;
}
