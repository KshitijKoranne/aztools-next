import { Metadata } from 'next'
import { SqlQueryFormatterClient } from './client'

export const metadata: Metadata = {
  title: 'SQL Query Formatter - Format & Beautify SQL Online | AZ Tools',
  description: 'Format and beautify SQL queries with customizable options. Support for MySQL, PostgreSQL, SQLite, and other SQL dialects.',
  keywords: ['sql formatter', 'sql beautifier', 'sql pretty print', 'sql query formatter', 'database tools'],
  openGraph: {
    title: 'SQL Query Formatter - Format & Beautify SQL Online | AZ Tools',
    description: 'Format and beautify SQL queries with customizable formatting options and dialect support.',
    type: 'website',
  }
}

export default function SqlQueryFormatterPage() {
  return <SqlQueryFormatterClient />
}