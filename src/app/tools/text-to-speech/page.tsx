import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Text-to-Speech Generator",
  description: "Read text aloud using browser speech synthesis.",
  alternates: { canonical: "https://aztools.in/tools/text-to-speech" },
};

export default function TextToSpeechPage() {
  return <Client />;
}
