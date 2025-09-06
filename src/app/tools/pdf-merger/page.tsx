import { Metadata } from 'next';
import PdfMerger from './client';

export const metadata: Metadata = {
  title: "PDF Merger - AZ Tools",
  description: "Merge multiple PDF files into a single document. Client-side processing ensures your files stay private and secure. Support for bookmarks, optimization, and metadata.",
  keywords: ["PDF merger", "combine PDF", "merge PDF files", "PDF tools", "document merger", "PDF combiner"],
};

export default function PdfMergerPage() {
  return <PdfMerger />;
}