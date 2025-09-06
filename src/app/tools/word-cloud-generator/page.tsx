import { Metadata } from 'next'
import { Type } from 'lucide-react'
import { WordCloudGeneratorClient } from './client'

export const metadata: Metadata = {
  title: 'Word Cloud Generator - Visual Text Analysis | AZ Tools',
  description: 'Generate beautiful word clouds from text with customizable colors, fonts, and settings. Visualize word frequency and statistics.',
  keywords: 'word cloud, text visualization, word frequency, text analysis, visual analytics, word statistics',
  openGraph: {
    title: 'Word Cloud Generator - Visual Text Analysis | AZ Tools',
    description: 'Generate beautiful word clouds from text with customizable colors, fonts, and settings. Visualize word frequency and statistics.',
  },
}

export default function WordCloudGeneratorPage() {
  return <WordCloudGeneratorClient />
}