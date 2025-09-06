import { Metadata } from 'next'
import { JsonToTypescriptClient } from './client'

export const metadata: Metadata = {
  title: 'JSON to TypeScript Interface - Convert JSON to TypeScript Online | AZ Tools',
  description: 'Convert JSON objects to TypeScript interfaces with customizable options. Generate type-safe interfaces from API responses and data structures.',
  keywords: ['json to typescript', 'typescript interface', 'json converter', 'type generation', 'typescript types'],
  openGraph: {
    title: 'JSON to TypeScript Interface - Convert JSON to TypeScript Online | AZ Tools',
    description: 'Convert JSON objects to TypeScript interfaces with customizable options and type safety.',
    type: 'website',
  }
}

export default function JsonToTypescriptPage() {
  return <JsonToTypescriptClient />
}