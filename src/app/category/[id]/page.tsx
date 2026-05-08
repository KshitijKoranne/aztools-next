import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Layers3, Sparkles } from "lucide-react";

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

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const category = getCategoryById(id);
  if (!category) return { title: "Category Not Found" };

  const count = getToolsByCategory(id).length;
  return {
    title: category.name,
    description: `${category.description} ${count} free online tools.`,
    alternates: { canonical: `https://aztools.in/category/${category.id}` },
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
  const Icon = category.icon;

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
              { "@type": "ListItem", position: 2, name: category.name, item: `${siteUrl}/category/${category.id}` },
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

      <div className="relative min-h-[70vh] overflow-hidden bg-background">
        <div className="absolute inset-0 az-grid opacity-30" />
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_62%)]" />

        <div className="container relative mx-auto px-4 py-10 md:py-14">
          <section className="mb-8 overflow-hidden rounded-[2.2rem] border bg-card/74 p-5 shadow-[0_34px_140px_-82px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <Button variant="ghost" size="sm" asChild className="mb-8 rounded-full">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    Home
                  </Link>
                </Button>
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-[0_26px_100px_-52px_color-mix(in_oklch,var(--primary)_90%,#000)]">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="az-section-label mb-2">Category</div>
                    <h1 className="text-4xl font-black leading-tight tracking-[-0.055em] md:text-7xl">{category.name}</h1>
                  </div>
                </div>
                <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">{category.description}</p>
              </div>

              <div className="grid min-w-64 gap-3 rounded-[1.6rem] border bg-background/50 p-4">
                <div className="flex items-center gap-3">
                  <Layers3 className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-3xl font-black tracking-[-0.05em]">{tools.length}</div>
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">tools inside</div>
                  </div>
                </div>
                <div className="rounded-[1.1rem] bg-primary/10 px-4 py-3 text-sm font-bold text-primary">
                  Built for quick repeated use.
                </div>
              </div>
            </div>
          </section>

          <div className="mb-6 flex flex-wrap gap-2">
            {categories.slice(0, 12).map((item) => (
              <Link
                key={item.id}
                href={`/category/${item.id}`}
                className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition-colors ${
                  item.id === category.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card/60 text-muted-foreground hover:border-primary/55 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {tools.length === 0 ? (
            <div className="rounded-[2rem] border bg-card p-8 text-muted-foreground">No tools in this category yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.id} name={tool.name} description={tool.description} icon={tool.icon} path={tool.path} />
              ))}
            </div>
          )}

          <div className="mt-10 rounded-[2rem] border bg-card/74 p-6 backdrop-blur">
            <div className="flex items-center gap-3 text-sm font-black text-primary">
              <Sparkles className="h-4 w-4" />
              Tip: use the top search bar when you already know the task.
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
