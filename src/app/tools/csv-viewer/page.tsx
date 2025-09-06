import { Metadata } from 'next'
import { CsvViewerClient } from './client'

export const metadata: Metadata = {
  title: 'CSV Viewer - View & Analyze CSV Files Online | AZ Tools',
  description: 'Upload and view CSV files with advanced search, filtering, and pagination. Analyze tabular data with professional CSV viewer tool.',
  keywords: ['csv viewer', 'csv analyzer', 'data table', 'spreadsheet viewer', 'csv parser'],
  openGraph: {
    title: 'CSV Viewer - View & Analyze CSV Files Online | AZ Tools',
    description: 'Upload and view CSV files with advanced search, filtering, and pagination.',
    type: 'website',
  }
}

export default function CsvViewerPage() {
  return <CsvViewerClient />
}