import type { Metadata } from "next";
import JwtDecoderClient from "./client";
export const metadata: Metadata = {
  title: "JWT Decoder",
  description: "Free online JWT decoder. Decode and inspect JSON Web Token header, payload, and signature instantly in your browser — no server, no data sent.",
  keywords: ["jwt decoder","json web token","decode jwt","jwt inspector","jwt parser"],
  alternates: { canonical: "https://aztools.in/tools/jwt-decoder" },
  openGraph: { title: "JWT Decoder - AZ Tools", description: "Decode JWT header and payload instantly. Runs entirely in-browser.", url: "https://aztools.in/tools/jwt-decoder", type: "website" },
};
export default function Page() { return <JwtDecoderClient />; }
