import { Metadata } from 'next'
import { GitignoreGeneratorClient } from './client'

export const metadata: Metadata = {
  title: 'Gitignore Generator - Create .gitignore Files Online | AZ Tools',
  description: 'Generate .gitignore files for various project types including Node.js, Python, Java, React, and more. Customize with templates and add your own rules.',
  keywords: ['gitignore generator', 'git ignore', 'gitignore file', 'git templates', 'version control'],
  openGraph: {
    title: 'Gitignore Generator - Create .gitignore Files Online | AZ Tools',
    description: 'Generate .gitignore files for various project types including Node.js, Python, Java, React, and more.',
    type: 'website',
  }
}

export default function GitignoreGeneratorPage() {
  return <GitignoreGeneratorClient />
}