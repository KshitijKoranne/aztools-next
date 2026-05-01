import Link from "next/link";
import { MainLayout } from "@/components/layouts/main-layout";
import { CategoryCard } from "@/components/category-card";
import { HomeHero } from "@/components/home-hero";
import { categories, getToolsByCategory, tools } from "@/data/tools";
import { jsonLd, siteUrl } from "@/lib/seo";

export default function Home() {
  const featuredTools = tools.slice(0, 12);

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "AZ Tools categories",
          itemListElement: categories.map((category, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: category.name,
            url: `${siteUrl}/category/${category.id}`,
          })),
        })}
      />
      <HomeHero />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Categories</h2>
            <p className="text-muted-foreground">Browse our tools by category</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                description={category.description}
                icon={category.icon}
                toolCount={getToolsByCategory(category.id).length}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-3">Popular Free Online Tools</h2>
            <p className="text-muted-foreground">
              Fast browser-friendly utilities for PDFs, images, text, code, SEO, security, finance, and everyday work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="rounded-md border p-4 transition-colors hover:bg-accent"
              >
                <h3 className="font-medium">{tool.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
