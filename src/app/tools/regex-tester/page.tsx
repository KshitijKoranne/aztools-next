import { Metadata } from 'next'
import { RegexTesterClient } from './client'

export const metadata: Metadata = {
  title: 'Regex Tester - Test Regular Expressions Online | AZ Tools',
  description: 'Test and debug regular expressions with live feedback, match highlighting, and group capture. Perfect for developers working with pattern matching and text processing.',
  keywords: ['regex tester', 'regular expressions', 'pattern matching', 'regex debugger', 'developer tools', 'text processing'],
  openGraph: {
    title: 'Regex Tester - Test Regular Expressions Online | AZ Tools',
    description: 'Test and debug regular expressions with live feedback, match highlighting, and group capture.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Regex Tester - Test Regular Expressions Online | AZ Tools',
    description: 'Test and debug regular expressions with live feedback, match highlighting, and group capture.',
  }
}

export default function RegexTesterPage() {
  return <RegexTesterClient />
}