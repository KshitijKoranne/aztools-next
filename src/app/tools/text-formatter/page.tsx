import { Metadata } from "next";
import { TextFormatterClient } from "./client";

// Server-side metadata for SEO - CRITICAL for Next.js SEO improvements
export const metadata: Metadata = {
  title: "Text Formatter - Format, Clean & Transform Text | AZ Tools",
  description: "Professional text formatting tool. Clean up text, convert case (UPPERCASE, lowercase, Title Case, camelCase, snake_case), remove duplicates, and sort lines. Free online text utility.",
  keywords: [
    'text formatter',
    'text cleaner',
    'case converter',
    'text transform',
    'uppercase converter',
    'lowercase converter',
    'title case converter',
    'camelcase converter',
    'snake case converter',
    'kebab case converter',
    'text utility',
    'format text online',
    'clean text',
    'text processing'
  ],
  authors: [{ name: 'KSK Labs' }],
  openGraph: {
    title: 'Text Formatter - Format & Transform Text | AZ Tools',
    description: 'Professional text formatting tool with case conversion, line sorting, duplicate removal and text cleaning features.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AZ Tools'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text Formatter - Format & Transform Text | AZ Tools',
    description: 'Professional text formatting tool with case conversion, line sorting, duplicate removal and text cleaning features.'
  }
};

export default function TextFormatter() {
  return <TextFormatterClient />;
}