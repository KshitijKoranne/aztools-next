import { Metadata } from 'next'
import { Type } from 'lucide-react'
import { CaseConverterClient } from './client'

export const metadata: Metadata = {
  title: 'Case Converter - Text Case Transformer | AZ Tools',
  description: 'Convert text to different cases: uppercase, lowercase, title case, sentence case, alternating case, and more.',
  keywords: 'case converter, text case, uppercase, lowercase, title case, sentence case, text transformer',
  openGraph: {
    title: 'Case Converter - Text Case Transformer | AZ Tools',
    description: 'Convert text to different cases: uppercase, lowercase, title case, sentence case, alternating case, and more.',
  },
}

export default function CaseConverterPage() {
  return <CaseConverterClient />
}