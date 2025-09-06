import { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { TextDiffClient } from './client'

export const metadata: Metadata = {
  title: 'Text Diff - Compare Two Texts | AZ Tools',
  description: 'Compare two texts and highlight the differences between them. Free online text comparison tool with visual diff highlighting.',
  keywords: 'text diff, text comparison, compare texts, difference finder, text analyzer',
  openGraph: {
    title: 'Text Diff - Compare Two Texts | AZ Tools',
    description: 'Compare two texts and highlight the differences between them. Free online text comparison tool with visual diff highlighting.',
  },
}

export default function TextDiffPage() {
  return <TextDiffClient />
}