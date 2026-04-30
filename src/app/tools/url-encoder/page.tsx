import type { Metadata } from "next";
import UrlEncoderClient from "./client";
export const metadata: Metadata = {
  title: "URL Encoder / Decoder",
  description: "Free online URL encoder and decoder. Encode special characters for safe URL transmission or decode percent-encoded URLs instantly.",
  keywords: ["url encoder","url decoder","percent encoding","encodeURIComponent","online url tool"],
  alternates: { canonical: "https://aztools.in/tools/url-encoder" },
  openGraph: { title: "URL Encoder / Decoder - AZ Tools", description: "Encode or decode URLs instantly in your browser.", url: "https://aztools.in/tools/url-encoder", type: "website" },
};
export default function Page() { return <UrlEncoderClient />; }
