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

      <div className="min-h-[70vh] bg-background text-foreground">
        <section className="border-b">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
              <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              {category && (
                <>
                  <span>/</span>
                  <Link href={`/category/${category.id}`} className="transition-colors hover:text-foreground">
                    {category.name}
                  </Link>
                </>
              )}
              {tool && (
                <>
                  <span>/</span>
                  <span className="text-foreground/72">{tool.name}</span>
                </>
              )}
            </div>

            <div className="rounded-3xl border bg-card p-5 shadow-sm md:p-8">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    {category && (
                      <Link
                        href={`/category/${category.id}`}
                        className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-foreground hover:text-background"
                      >
                        {category.name}
                      </Link>
                    )}
                    <span className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Free · No login
                    </span>
                  </div>

                  <div className="flex items-start gap-5">
                    {Icon && (
                      <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-3xl border bg-background text-foreground sm:flex">
                        <Icon className="h-7 w-7" />
                      </div>
                    )}
                    <div>
                      <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-6xl">
                        {tool?.name ?? "Tool"}
                      </h1>
                      <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                        {tool?.description ?? "A simple, useful browser tool from AZ Tools."}
                      </p>
                    </div>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-fit rounded-full">
                  <Link href={category ? `/category/${category.id}` : "/"}>
                    <ArrowLeft className="h-4 w-4" /> Back to {category?.name ?? "home"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="rounded-3xl border bg-card p-3 shadow-sm md:p-5">
            <div className="rounded-[1.35rem] border bg-background p-4 md:p-6">{children}</div>
          </div>

          {relatedTools.length > 0 && (
            <section className="mt-10 rounded-3xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold tracking-[-0.03em]">Related tools</h2>
                {category && (
                  <Link href={`/category/${category.id}`} className="hidden text-sm font-semibold text-muted-foreground hover:text-foreground sm:inline-flex">
                    View all
                  </Link>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedTools.map((item) => {
                  const RelatedIcon = item.icon;
                  return (
                    <Link key={item.id} href={item.path} className="group flex items-center gap-3 rounded-2xl border bg-background p-3 transition-all hover:border-foreground/25">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-card text-foreground">
                        <RelatedIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-sm font-semibold text-foreground">{item.name}</span>
                        <span className="line-clamp-1 text-xs text-muted-foreground">{item.description}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
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
