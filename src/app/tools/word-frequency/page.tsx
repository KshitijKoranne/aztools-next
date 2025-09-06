import { Metadata } from 'next'
import { BarChart3 } from 'lucide-react'
import { WordFrequencyClient } from './client'

export const metadata: Metadata = {
  title: 'Word Frequency Analyzer - Text Analysis Tool | AZ Tools',
  description: 'Analyze word frequency in text and discover the most common words with comprehensive statistics and visualization.',
  keywords: 'word frequency analyzer, text analysis, word count, text statistics, content analysis, word distribution',
  openGraph: {
    title: 'Word Frequency Analyzer - Text Analysis Tool | AZ Tools',
    description: 'Analyze word frequency in text and discover the most common words with comprehensive statistics and visualization.',
  },
}

export default function WordFrequencyPage() {
  return <WordFrequencyClient />
}