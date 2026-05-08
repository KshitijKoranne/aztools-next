import Link from "next/link";
import { ArrowRight, BadgeCheck, WandSparkles } from "lucide-react";

import { CategoryCard } from "@/components/category-card";
import { HomeHero } from "@/components/home-hero";
import { MainLayout } from "@/components/layouts/main-layout";
import { categories, getToolsByCategory, tools, type Tool } from "@/data/tools";
import { jsonLd, siteUrl } from "@/lib/seo";

function getFeaturedTools(): Tool[] {
  const featuredIds = [
    "pdf-merger",
    "image-compressor",
    "json-formatter",
    "weather-forecast",
    "country-info-lookup",
    "password-generator",
    "qr-code-generator",
    "unit-converter",
  ];

  return featuredIds.flatMap((id) => {
    const tool = tools.find((item) => item.id === id);
    return tool ? [tool] : [];
  });
}

export default function Home() {
  const featuredTools = getFeaturedTools();
  const moreTools = tools.slice(0, 30);

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

      <section id="featured-tools" className="bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="az-section-label mb-3">Start here</div>
              <h2 className="max-w-3xl text-3xl font-black tracking-[-0.04em] md:text-5xl">
                Common tools, ready.
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-sm font-black text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool, index) => {
              const Icon = tool.icon;
              const category = categories.find((item) => item.id === tool.category);

              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className={`group min-h-[230px] rounded-[1.25rem] border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 ${index === 0 || index === 3 ? "lg:col-span-2" : ""}`}
                >
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-background text-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full border bg-background/55 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                        {category?.name ?? "Tool"}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-2xl font-black tracking-[-0.04em]">{tool.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="categories" className="bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="az-section-label mb-3">Categories</div>
              <h2 className="max-w-3xl text-3xl font-black tracking-[-0.04em] md:text-5xl">
                Everything has a place.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Clear groups, scannable names, and tools that do what they say.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-[1.25rem] border bg-card p-2 shadow-sm">
              {[
                [String(tools.length), "tools"],
                [String(categories.length), "sets"],
                ["free", "access"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1rem] bg-background/56 px-4 py-3 text-center">
                  <div className="text-xl font-black tracking-[-0.04em]">{value}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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

      <section id="more-tools" className="bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="mb-10">
            <div className="az-section-label mb-3">More tools</div>
            <h2 className="text-3xl font-black tracking-[-0.04em] md:text-5xl">Useful extras.</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {moreTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group rounded-[1.25rem] border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border bg-background text-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5 tracking-[-0.02em]">{tool.name}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.description}</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 overflow-hidden rounded-[1.5rem] border bg-card p-8 shadow-sm md:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                  <WandSparkles className="h-3.5 w-3.5" />
                  Made for return visits
                </div>
                <h2 className="max-w-3xl text-3xl font-black tracking-[-0.04em] md:text-5xl">One tab. Many small wins.</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                  Keep AZ Tools close for file fixes, content work, developer chores, live lookups, and everyday calculations.
                </p>
              </div>
              <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-black text-background transition-opacity hover:opacity-85">
                Find your tool <BadgeCheck className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
