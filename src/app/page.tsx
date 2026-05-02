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

      <section className="bg-[#050505] py-14 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="az-section-label mb-3">Tool playlists</div>
              <h2 className="text-4xl font-black leading-tight md:text-5xl">Pick a category. Press play.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/58">PDFs, images, text, code, SEO, security, finance, and daily operations grouped for quick action.</p>
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

      <section className="border-t border-white/10 bg-[#050505] py-14 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="az-section-label mb-3">Recently useful</div>
              <h2 className="text-3xl font-black leading-tight md:text-4xl">Start where the work usually starts.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/58">A quick wall of high-use tools, kept browser-friendly and direct.</p>
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
