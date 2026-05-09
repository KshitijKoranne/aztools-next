import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layouts/main-layout";
import { getCategoryById, getToolById, getToolsByCategory } from "@/data/tools";
import { jsonLd, siteName, siteUrl } from "@/lib/seo";

interface ToolLayoutProps {
  toolId: string;
  children: React.ReactNode;
}

export function ToolLayout({ toolId, children }: ToolLayoutProps) {
  const tool = getToolById(toolId);
  const category = tool ? getCategoryById(tool.category) : null;
  const relatedTools = category ? getToolsByCategory(category.id).filter((item) => item.id !== toolId).slice(0, 4) : [];
  const Icon = tool?.icon;

  return (
    <MainLayout>
      {tool && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: siteName, item: siteUrl },
                ...(category
                  ? [{ "@type": "ListItem", position: 2, name: category.name, item: `${siteUrl}/category/${category.id}` }]
                  : []),
                { "@type": "ListItem", position: category ? 3 : 2, name: tool.name, item: `${siteUrl}${tool.path}` },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: tool.name,
              description: tool.description,
              url: `${siteUrl}${tool.path}`,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Any",
              isAccessibleForFree: true,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
          ])}
        />
      )}

      <div className="min-h-[70vh] bg-[#131313] text-[#e5e2e1]">
        <section className="border-b border-white/10">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-medium text-white/48">
              <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-white">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              {category && (
                <>
                  <span>/</span>
                  <Link href={`/category/${category.id}`} className="transition-colors hover:text-white">
                    {category.name}
                  </Link>
                </>
              )}
              {tool && (
                <>
                  <span>/</span>
                  <span className="text-white/72">{tool.name}</span>
                </>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#201f1f]/70 p-5 shadow-sm md:p-8">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    {category && (
                      <Link
                        href={`/category/${category.id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/70 transition-colors hover:bg-white hover:text-black"
                      >
                        {category.name}
                      </Link>
                    )}
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/70">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Free · No login
                    </span>
                  </div>

                  <div className="flex items-start gap-5">
                    {Icon && (
                      <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] text-white sm:flex">
                        <Icon className="h-7 w-7" />
                      </div>
                    )}
                    <div>
                      <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-6xl">
                        {tool?.name ?? "Tool"}
                      </h1>
                      <p className="mt-4 max-w-3xl text-base leading-7 text-[#c1c6d7] md:text-lg">
                        {tool?.description ?? "A simple, useful browser tool from AZ Tools."}
                      </p>
                    </div>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-fit rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white hover:text-black">
                  <Link href={category ? `/category/${category.id}` : "/"}>
                    <ArrowLeft className="h-4 w-4" /> Back to {category?.name ?? "home"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="rounded-3xl border border-white/10 bg-[#201f1f]/70 p-3 shadow-sm md:p-5">
            <div className="rounded-[1.35rem] border border-white/10 bg-[#0e0e0e] p-4 md:p-6">{children}</div>
          </div>

          {relatedTools.length > 0 && (
            <section className="mt-10 rounded-3xl border border-white/10 bg-[#201f1f]/60 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Related tools</h2>
                {category && (
                  <Link href={`/category/${category.id}`} className="hidden text-sm font-semibold text-white/60 hover:text-white sm:inline-flex">
                    View all
                  </Link>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedTools.map((item) => {
                  const RelatedIcon = item.icon;
                  return (
                    <Link key={item.id} href={item.path} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition-all hover:border-white/22 hover:bg-[#242424]">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white">
                        <RelatedIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-sm font-semibold text-white">{item.name}</span>
                        <span className="line-clamp-1 text-xs text-white/45">{item.description}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-white/28 group-hover:text-white" />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
