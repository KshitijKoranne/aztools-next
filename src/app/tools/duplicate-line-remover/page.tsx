import { Metadata } from 'next'
import { RefreshCw } from 'lucide-react'
import { DuplicateLineRemoverClient } from './client'

export const metadata: Metadata = {
  title: 'Duplicate Line Remover - Remove Duplicate Text Lines | AZ Tools',
  description: 'Remove duplicate lines from text with advanced processing options, case sensitivity settings, and detailed statistics.',
  keywords: 'duplicate line remover, remove duplicates, text processing, line deduplication, text cleaner',
  openGraph: {
    title: 'Duplicate Line Remover - Remove Duplicate Text Lines | AZ Tools',
    description: 'Remove duplicate lines from text with advanced processing options, case sensitivity settings, and detailed statistics.',
  },
}

export default function DuplicateLineRemoverPage() {
  return <DuplicateLineRemoverClient />
}