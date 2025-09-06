import { Metadata } from 'next'
import { Braces } from 'lucide-react'
import { JsonFormatterClient } from './client'

export const metadata: Metadata = {
  title: 'JSON Formatter - Beautify & Validate JSON | AZ Tools',
  description: 'Format, beautify, validate and minify JSON with syntax highlighting. Free online JSON formatter and validator tool.',
  keywords: 'json formatter, json beautify, json validator, json minify, json parser, json pretty print',
  openGraph: {
    title: 'JSON Formatter - Beautify & Validate JSON | AZ Tools',
    description: 'Format, beautify, validate and minify JSON with syntax highlighting. Free online JSON formatter and validator tool.',
  },
}

export default function JsonFormatterPage() {
  return <JsonFormatterClient />
}