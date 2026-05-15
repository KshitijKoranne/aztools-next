import type { Metadata } from "next";
import HttpHeadersParserClient from "./client";

export const metadata: Metadata = {
  title: "HTTP Headers Parser",
  description: "Parse raw HTTP request or response headers into a readable table.",
  alternates: { canonical: "https://aztools.in/tools/http-headers-parser" },
};

export default function HttpHeadersParserPage() {
  return <HttpHeadersParserClient />;
}
