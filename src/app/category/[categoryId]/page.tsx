import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryPageClient } from './client'
import { categories, getCategoryById } from '@/data/tools'

interface CategoryPageProps {
  params: {
    categoryId: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = getCategoryById(resolvedParams.categoryId)
  
  if (!category) {
    return {
      title: 'Category Not Found | AZ Tools',
      description: 'The requested category was not found.'
    }
  }

  return {
    title: `${category.name} - Professional Tools | AZ Tools`,
    description: `${category.description} Explore our collection of ${category.name.toLowerCase()} to boost your productivity.`,
    keywords: [category.name, 'tools', 'online tools', 'productivity', 'web tools'],
    openGraph: {
      title: `${category.name} - Professional Tools | AZ Tools`,
      description: `${category.description} Explore our collection of ${category.name.toLowerCase()}.`
    }
  }
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    categoryId: category.id
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const category = getCategoryById(resolvedParams.categoryId)
  
  if (!category) {
    notFound()
  }

  return <CategoryPageClient categoryId={resolvedParams.categoryId} />
}