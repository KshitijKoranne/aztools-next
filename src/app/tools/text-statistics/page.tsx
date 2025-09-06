import { Metadata } from 'next'
import { BarChart3 } from 'lucide-react'
import { TextStatisticsClient } from './client'

export const metadata: Metadata = {
  title: 'Text Statistics Analyzer - Word Count & Readability | AZ Tools',
  description: 'Analyze text statistics including word count, character count, reading time, and readability score. Perfect for writers and content creators.',
  keywords: 'text statistics, word count, character count, readability, text analyzer, writing tools',
  openGraph: {
    title: 'Text Statistics Analyzer - Word Count & Readability | AZ Tools',
    description: 'Analyze text statistics including word count, character count, reading time, and readability score. Perfect for writers and content creators.',
  },
}

export default function TextStatisticsPage() {
  return <TextStatisticsClient />
}