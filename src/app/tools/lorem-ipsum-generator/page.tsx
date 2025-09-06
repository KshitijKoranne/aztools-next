import { Metadata } from 'next'
import { FileText } from 'lucide-react'
import { LoremIpsumGeneratorClient } from './client'

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator - Placeholder Text Generator | AZ Tools',
  description: 'Generate placeholder Lorem Ipsum text with customizable word, sentence, and paragraph counts for design and development.',
  keywords: 'lorem ipsum generator, placeholder text, dummy text, filler text, lorem ipsum, text generator',
  openGraph: {
    title: 'Lorem Ipsum Generator - Placeholder Text Generator | AZ Tools',
    description: 'Generate placeholder Lorem Ipsum text with customizable word, sentence, and paragraph counts for design and development.',
  },
}

export default function LoremIpsumGeneratorPage() {
  return <LoremIpsumGeneratorClient />
}