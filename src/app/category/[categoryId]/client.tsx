'use client'

import { getCategoryById, getToolsByCategory } from '@/data/tools'
import { ToolCard } from '@/components/ToolCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MainLayout } from '@/components/layouts/MainLayout'

interface CategoryPageClientProps {
  categoryId: string
}

export function CategoryPageClient({ categoryId }: CategoryPageClientProps) {
  const category = getCategoryById(categoryId)
  const tools = getToolsByCategory(categoryId)

  if (!category) {
    notFound()
  }

  const IconComponent = category.icon

  return (
    <MainLayout>
      <div className="container py-8 space-y-8">
        {/* Back to Home */}
        <Button variant="ghost" asChild>
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Category Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl">
              {category.name}
            </CardTitle>
            <p className="text-lg text-muted-foreground mt-2">
              {category.description}
            </p>
            <Badge variant="secondary" className="w-fit mx-auto mt-4">
              {tools.length} {tools.length === 1 ? 'Tool' : 'Tools'}
            </Badge>
          </CardHeader>
        </Card>

        {/* Tools Grid */}
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                <IconComponent className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No tools available in this category yet.</p>
                <p className="text-sm mt-2">We&apos;re working on adding more tools. Check back soon!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}