import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryCard } from "@/components/category-card";
import { HomeHero } from "@/components/home-hero";
import { MainLayout } from "@/components/layouts/main-layout";
import { categories, getToolsByCategory, tools } from "@/data/tools";
import { jsonLd, siteUrl } from "@/lib/seo";

export default function Home() {
  const featuredIds = [
    "json-formatter",
    "image-compressor",
    "text-statistics",
    "pdf-merger",
    "qr-code-generator",
    "unit-converter",
  ];
  const featuredTools = featuredIds
    .map((id) => tools.find((tool) => tool.id === id))
    .filter(Boolean)
    .concat(tools.filter((tool) => !featuredIds.includes(tool.id)).slice(0, 6))
    .slice(0, 9);
  const moreTools = tools.slice(0, 25);

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

      <section id="featured-tools" className="border-t border-white/10 bg-[#050505] py-16 text-white md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="az-section-label mb-3">Featured tools</div>
              <h2 className="max-w-3xl text-3xl font-black tracking-[-0.03em] md:text-5xl">
                Carefully picked tools for everyday work.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/58 md:text-base">
              Fast, practical utilities with real functionality. No login, no needless steps, no mock workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredTools.map((tool) => {
              if (!tool) return null;
              const Icon = tool.icon;
              const category = categories.find((item) => item.id === tool.category);
              return (
                <Link key={tool.id} href={tool.path} className="group block">
                  <article className="az-card h-full p-5 text-card-foreground md:p-6">
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-[#adc6ff]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-bold text-white/60">
                        {category?.name ?? "Tool"}
                      </span>
                    </div>
                    <h3 className="relative z-10 mt-8 text-2xl font-black tracking-[-0.02em] text-white transition-colors group-hover:text-[#adc6ff]">
                      {tool.name}
                    </h3>
                    <p className="relative z-10 mt-3 text-sm leading-6 text-white/62">{tool.description}</p>
                    <div className="relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#adc6ff] opacity-80 transition-all group-hover:gap-3 group-hover:opacity-100">
                      Open tool <ArrowRight className="h-4 w-4" />
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="categories" className="bg-[#050505] py-16 text-white md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="az-section-label mb-3">Browse by category</div>
              <h2 className="max-w-3xl text-3xl font-black tracking-[-0.03em] md:text-5xl">
                Organized like a serious toolbox.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/58 md:text-base">
              Find the right workspace quickly, from text and PDFs to developer, image, SEO, finance, and productivity tools.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <section id="more-tools" className="border-t border-white/10 bg-[#050505] py-16 text-white md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="az-section-label mb-3">More tools</div>
              <h2 className="text-3xl font-black tracking-[-0.03em] md:text-5xl">A quick wall of useful utilities.</h2>
            </div>
            <Link
              href="/search"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/[0.12] hover:text-[#adc6ff]"
            >
              View all tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {moreTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-all hover:-translate-y-1 hover:border-[#adc6ff]/50 hover:bg-white/[0.07]"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.07] text-white/70 transition-colors group-hover:text-[#adc6ff]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5 text-white transition-colors group-hover:text-[#adc6ff]">
                    {tool.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/48">{tool.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
