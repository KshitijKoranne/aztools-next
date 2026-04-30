import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Timestamp Converter",
  description: "Convert Unix timestamps to human-readable dates and dates back to timestamps.",
  alternates: { canonical: "https://aztools.in/tools/timestamp-converter" },
};

export default function TimestampConverterPage() {
  return <Client />;
}
