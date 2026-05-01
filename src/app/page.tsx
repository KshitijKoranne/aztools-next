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

      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="az-section-label mb-3">Tool map</div>
            <h2 className="text-4xl font-black leading-tight md:text-5xl">Pick a lane. Ship the task.</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Organized utilities for PDFs, images, text, code, SEO, security, finance, and daily operations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

      <section className="border-t py-14">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="az-section-label mb-3">Fast openers</div>
            <h2 className="text-3xl font-black leading-tight md:text-4xl">Start where the work usually starts.</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">A quick wall of high-use tools, kept browser-friendly and direct.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className="az-card group p-4"
              >
                <h3 className="relative z-10 font-black group-hover:text-primary">{tool.name}</h3>
                <p className="relative z-10 mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
