import { Metadata } from 'next'
import { Quote } from 'lucide-react'
import { TextGeneratorClient } from './client'

export const metadata: Metadata = {
  title: 'Text Generator - Random Strings & Lists | AZ Tools',
  description: 'Generate random strings and lists with customizable options. Create random text for testing, passwords, and placeholder content.',
  keywords: 'text generator, random string generator, list generator, random text, test data generator',
  openGraph: {
    title: 'Text Generator - Random Strings & Lists | AZ Tools',
    description: 'Generate random strings and lists with customizable options. Create random text for testing, passwords, and placeholder content.',
  },
}

export default function TextGeneratorPage() {
  return <TextGeneratorClient />
}