import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layouts/main-layout";
import { ToolCard } from "@/components/tool-card";
import { categories, getCategoryById, getToolsByCategory } from "@/data/tools";
import { jsonLd, siteName, siteUrl } from "@/lib/seo";

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
  if (!category) return { title: "Category Not Found" };

  const count = getToolsByCategory(id).length;
  return {
    title: category.name,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd([
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: siteName, item: siteUrl },
              {
                "@type": "ListItem",
                position: 2,
                name: category.name,
                item: `${siteUrl}/category/${category.id}`,
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${category.name} - AZ Tools`,
            description: category.description,
            url: `${siteUrl}/category/${category.id}`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: tools.map((tool, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: tool.name,
                url: `${siteUrl}${tool.path}`,
              })),
            },
          },
        ])}
      />
      <div className="min-h-[70vh] bg-[#050505] text-white">
        <div className="container mx-auto px-4 py-10">
        <div className="mb-8 rounded-lg border border-white/10 bg-[linear-gradient(135deg,#253f2e,#121212_58%,#0a0a0a)] p-4 md:p-8">
          <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-4 rounded-full text-white hover:bg-white/10 hover:text-white">
            <Link href="/" aria-label="Back to home">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="az-section-label mb-2">Category</div>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">{category.name}</h1>
            <p className="mt-2 max-w-2xl text-white/62">{category.description}</p>
          </div>
          </div>
        </div>

        {tools.length === 0 ? (
          <p className="text-muted-foreground">No tools in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
      </div>
    </MainLayout>
  );
}
