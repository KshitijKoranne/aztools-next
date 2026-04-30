import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layouts/main-layout";
import { ToolCard } from "@/components/tool-card";
import { categories, getCategoryById, getToolsByCategory } from "@/data/tools";

import type { Metadata } from "next";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return categories.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const category = getCategoryById(id);
  if (!category) return { title: "Category Not Found - AZ Tools" };

  const count = getToolsByCategory(id).length;
  return {
    title: `${category.name} - AZ Tools`,
    description: `${category.description} ${count} free online tools.`,
    alternates: {
      canonical: `https://aztools.in/category/${category.id}`,
    },
    openGraph: {
      title: `${category.name} - AZ Tools`,
      description: category.description,
      url: `https://aztools.in/category/${category.id}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { id } = await params;
  const category = getCategoryById(id);
  if (!category) notFound();

  const tools = getToolsByCategory(id);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" asChild className="mr-4">
            <Link href="/" aria-label="Back to home">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </div>

        {tools.length === 0 ? (
          <p className="text-muted-foreground">No tools in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                name={tool.name}
                description={tool.description}
                icon={tool.icon}
                path={tool.path}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
