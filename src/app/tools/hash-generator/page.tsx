import type { Metadata } from "next";
import HashGeneratorClient from "./client";
export const metadata: Metadata = {
  title: "Hash Generator",
  description: "Free online hash generator. Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files instantly in your browser.",
  keywords: ["hash generator","sha256","sha512","sha1","md5 hash","generate hash online"],
  alternates: { canonical: "https://aztools.in/tools/hash-generator" },
  openGraph: { title: "Hash Generator - AZ Tools", description: "Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes from text or file — runs in-browser.", url: "https://aztools.in/tools/hash-generator", type: "website" },
};
export default function Page() { return <HashGeneratorClient />; }
