import { Metadata } from 'next'
import { CodeBeautifierClient } from './client'

export const metadata: Metadata = {
  title: 'Code Beautifier - Format & Beautify Code Online | AZ Tools',
  description: 'Beautify and format your code online. Supports JSON, JavaScript, CSS, HTML, and XML with automatic indentation, syntax validation, and formatting.',
  keywords: ['code beautifier', 'code formatter', 'JSON formatter', 'JavaScript beautifier', 'CSS formatter', 'HTML formatter', 'code pretty print'],
  openGraph: {
    title: 'Code Beautifier - Format & Beautify Code Online | AZ Tools',
    description: 'Beautify and format your code online. Supports JSON, JavaScript, CSS, HTML, and XML with automatic formatting.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Code Beautifier - Format & Beautify Code Online | AZ Tools',
    description: 'Beautify and format your code online. Supports JSON, JavaScript, CSS, HTML, and XML with automatic formatting.',
  }
}

export default function CodeBeautifierPage() {
  return <CodeBeautifierClient />
}