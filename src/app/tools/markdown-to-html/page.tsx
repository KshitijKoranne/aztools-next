import { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { MarkdownToHtmlClient } from './client'

export const metadata: Metadata = {
  title: 'Markdown to HTML Converter - Professional Conversion | AZ Tools',
  description: 'Convert Markdown documents to HTML with live preview and CSS styling options. Upload files or paste text for instant conversion.',
  keywords: 'markdown to html, markdown converter, html generator, documentation converter, markup conversion',
  openGraph: {
    title: 'Markdown to HTML Converter - Professional Conversion | AZ Tools',
    description: 'Convert Markdown documents to HTML with live preview and CSS styling options. Upload files or paste text for instant conversion.',
  },
}

export default function MarkdownToHtmlPage() {
  return <MarkdownToHtmlClient />
}