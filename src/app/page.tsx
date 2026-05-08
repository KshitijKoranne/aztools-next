import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryCard } from "@/components/category-card";
import { HomeHero } from "@/components/home-hero";
import { MainLayout } from "@/components/layouts/main-layout";
import { categories, getToolsByCategory, tools, type Tool } from "@/data/tools";
import { jsonLd, siteUrl } from "@/lib/seo";

function getFeaturedTools(): Tool[] {
  const featuredIds = [
    "json-formatter",
    "image-compressor",
    "text-statistics",
    "pdf-merger",
    "qr-code-generator",
    "unit-converter",
  ];

  const picked = featuredIds.flatMap((id) => {
    const tool = tools.find((item) => item.id === id);
    return tool ? [tool] : [];
  });

  const fillers = tools.filter((tool) => !featuredIds.includes(tool.id));
  return [...picked, ...fillers].slice(0, 6);
}

export default function Home() {
  const featuredTools = getFeaturedTools();
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

      <section id="featured-tools" className="bg-[#131313] px-6 py-12 text-[#e5e2e1] md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-12 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-[#e5e2e1]">
            Featured Tools
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => {
              const Icon = tool.icon;
              const category = categories.find((item) => item.id === tool.category);

              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group relative flex min-h-[230px] cursor-pointer flex-col gap-4 overflow-hidden rounded-3xl border border-[#414755]/25 bg-[#201f1f]/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#adc6ff]/30 hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#adc6ff]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a2a2a] text-[#adc6ff] transition-colors group-hover:bg-[#adc6ff] group-hover:text-[#002e69]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-lg bg-[#353534] px-2 py-1 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#c1c6d7]">
                      {category?.name ?? "Tool"}
                    </span>
                  </div>
                  <div className="relative z-10 mt-auto">
                    <h3 className="mb-1 text-2xl font-semibold leading-snug tracking-[-0.01em] text-[#e5e2e1]">
                      {tool.name}
                    </h3>
                    <p className="text-sm leading-6 text-[#c1c6d7]">{tool.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="categories" className="bg-[#131313] px-6 py-12 text-[#e5e2e1] md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] text-[#e5e2e1]">
                Browse by Category
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-[#c1c6d7]">
                Tools grouped with care so you can reach the right utility quickly.
              </p>
            </div>
            <Link
              href="#more-tools"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#414755]/35 bg-[#201f1f]/70 px-4 py-2 text-sm font-semibold text-[#adc6ff] transition-colors hover:bg-[#2a2a2a]"
            >
              See more tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

      <section id="more-tools" className="bg-[#131313] px-6 py-12 text-[#e5e2e1] md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-12 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-[#e5e2e1]">
            More Tools
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {moreTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group rounded-2xl border border-[#414755]/25 bg-[#201f1f]/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#adc6ff]/35 hover:bg-[#2a2a2a]"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a2a2a] text-[#adc6ff] transition-colors group-hover:bg-[#adc6ff] group-hover:text-[#002e69]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#e5e2e1]">
                    {tool.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#c1c6d7]/80">{tool.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
