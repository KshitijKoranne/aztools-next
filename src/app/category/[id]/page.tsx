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

      <div className="min-h-[70vh] bg-[#131313] text-[#e5e2e1]">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <section className="mb-8 rounded-3xl border border-white/10 bg-[#201f1f]/70 p-5 shadow-sm md:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <Button variant="ghost" size="sm" asChild className="mb-8 rounded-full text-white/62 hover:bg-white/[0.08] hover:text-white">
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    Home
                  </Link>
                </Button>
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-6xl">{category.name}</h1>
                  </div>
                </div>
                <p className="max-w-3xl text-base leading-7 text-[#c1c6d7] md:text-lg">{category.description}</p>
              </div>

              <div className="min-w-44 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-3xl font-semibold tracking-[-0.04em]">{tools.length}</div>
                <div className="mt-1 text-sm text-white/48">{tools.length === 1 ? "tool" : "tools"}</div>
              </div>
            </div>
          </section>

          <div className="mb-6 flex flex-wrap gap-2">
            {categories.slice(0, 12).map((item) => (
              <Link
                key={item.id}
                href={`/category/${item.id}`}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  item.id === category.id
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-[#201f1f]/60 text-white/54 hover:border-white/24 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {tools.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#201f1f]/70 p-8 text-white/56">No tools in this category yet.</div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.id} name={tool.name} description={tool.description} icon={tool.icon} path={tool.path} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
