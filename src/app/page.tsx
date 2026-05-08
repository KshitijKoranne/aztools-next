import Link from "next/link";
import { ArrowRight, BadgeCheck, Cloud, FileText, ImageIcon, TerminalSquare, WandSparkles } from "lucide-react";

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

const bentoBlocks = [
  {
    title: "File work without friction",
    description: "Merge PDFs, compress images, extract text, inspect metadata, and keep files moving.",
    href: "/category/pdf-tools",
    icon: FileText,
    className: "lg:col-span-2",
    glow: "from-[var(--az-mint)]/24",
  },
  {
    title: "Developer utilities",
    description: "Format JSON, test regex, inspect repos, build schemas, and clean up code.",
    href: "/category/developer-tools",
    icon: TerminalSquare,
    className: "",
    glow: "from-[var(--az-cyan)]/22",
  },
  {
    title: "Image studio",
    description: "Resize, crop, convert, compress, pick colors, and read EXIF data.",
    href: "/category/image-tools",
    icon: ImageIcon,
    className: "",
    glow: "from-[var(--az-rose)]/20",
  },
  {
    title: "Live data lookups",
    description: "Weather, holidays, country info, GitHub repo stats, SSL, DNS, IP, and more.",
    href: "/category/live-data-tools",
    icon: Cloud,
    className: "lg:col-span-2",
    glow: "from-[var(--az-violet)]/22",
  },
];

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

      <section id="featured-tools" className="relative overflow-hidden bg-background px-4 py-16 md:py-24">
        <div className="absolute inset-0 az-grid opacity-25" />
        <div className="container relative mx-auto">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="az-section-label mb-3">Quick launch</div>
              <h2 className="max-w-3xl text-4xl font-black tracking-[-0.055em] md:text-6xl">
                Tools that feel one click away.
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex w-fit items-center gap-2 rounded-full border bg-card/70 px-5 py-3 text-sm font-black text-foreground shadow-sm backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Open directory <ArrowRight className="h-4 w-4" />
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
                  className={`group az-card min-h-[230px] p-5 ${index === 0 || index === 3 ? "lg:col-span-2" : ""}`}
                >
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_24px_80px_-45px_color-mix(in_oklch,var(--primary)_80%,#000)]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full border bg-background/55 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                        {category?.name ?? "Tool"}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="text-2xl font-black tracking-[-0.04em] transition-colors group-hover:text-primary">{tool.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="grid gap-4 lg:grid-cols-3">
            {bentoBlocks.map(({ title, description, href, icon: Icon, className, glow }) => (
              <Link key={title} href={href} className={`group relative min-h-[270px] overflow-hidden rounded-[2rem] border bg-card p-7 shadow-[0_30px_120px_-82px_rgba(0,0,0,0.9)] ${className}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${glow} via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100`} />
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-foreground/10" />
                <div className="absolute -right-4 top-10 h-24 w-24 rounded-full border border-foreground/10" />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-background/60 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-auto">
                    <h3 className="max-w-md text-3xl font-black tracking-[-0.05em]">{title}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">
                      Browse block <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="az-section-label mb-3">The map</div>
              <h2 className="max-w-3xl text-4xl font-black tracking-[-0.055em] md:text-6xl">
                A whole workshop, organized.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                Categories are built for repeated use: clear names, scannable cards, and tools that actually do the job.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] border bg-card/64 p-2 shadow-sm backdrop-blur">
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
            <div className="az-section-label mb-3">Tool wall</div>
            <h2 className="text-4xl font-black tracking-[-0.055em] md:text-6xl">Bookmark bait.</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {moreTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="group rounded-[1.4rem] border bg-card/70 p-4 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:bg-card"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5 tracking-[-0.02em]">{tool.name}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{tool.description}</p>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_22%,var(--card)),var(--card)_48%,color-mix(in_oklch,var(--chart-4)_16%,var(--card)))] p-8 shadow-[0_34px_140px_-82px_rgba(0,0,0,0.9)] md:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-background/50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-primary">
                  <WandSparkles className="h-3.5 w-3.5" />
                  Made for return visits
                </div>
                <h2 className="max-w-3xl text-4xl font-black tracking-[-0.055em] md:text-6xl">One tab. Dozens of useful outcomes.</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                  Keep AZ Tools close for file fixes, content work, developer chores, live lookups, and everyday calculations.
                </p>
              </div>
              <Link href="/search" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-black text-primary-foreground transition-transform hover:scale-[1.02]">
                Find your tool <BadgeCheck className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
