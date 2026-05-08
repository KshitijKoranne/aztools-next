import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, Home, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layouts/main-layout";
import { getToolById, getCategoryById, getToolsByCategory } from "@/data/tools";
import { jsonLd, siteName, siteUrl } from "@/lib/seo";

interface ToolLayoutProps {
  toolId: string;
  children: React.ReactNode;
}

function toolSignal(categoryId?: string) {
  if (!categoryId) return "Browser tool";
  if (categoryId === "live-data-tools" || categoryId === "it-tools") return "Uses live data";
  if (categoryId === "pdf-tools" || categoryId === "image-tools") return "File stays in browser";
  if (categoryId === "security-tools") return "Privacy-focused";
  return "Runs instantly";
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

      <div className="relative min-h-[70vh] overflow-hidden bg-background">
        <div className="absolute inset-0 az-grid opacity-25" />
        <div className="absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_50%_-12%,color-mix(in_oklch,var(--primary)_25%,transparent),transparent_60%)]" />

        <section className="relative border-b">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              {category && (
                <>
                  <span>/</span>
                  <Link href={`/category/${category.id}`} className="transition-colors hover:text-primary">
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

            <div className="overflow-hidden rounded-[2.2rem] border bg-card/74 p-5 shadow-[0_34px_140px_-82px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:p-8">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    {category && (
                      <Link
                        href={`/category/${category.id}`}
                        className="inline-flex items-center gap-2 rounded-full border bg-background/55 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        {category.name}
                      </Link>
                    )}
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {toolSignal(category?.id)}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border bg-background/55 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                      <BadgeCheck className="h-3.5 w-3.5" /> Free
                    </span>
                  </div>

                  <div className="flex items-start gap-5">
                    {Icon && (
                      <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-[0_24px_90px_-52px_color-mix(in_oklch,var(--primary)_90%,#000)] sm:flex">
                        <Icon className="h-7 w-7" />
                      </div>
                    )}
                    <div>
                      <div className="az-section-label mb-3">Tool workspace</div>
                      <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] md:text-6xl">
                        {tool?.name ?? "Tool"}
                      </h1>
                      <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                        {tool?.description ?? "A simple, useful browser tool from AZ Tools."}
                      </p>
                    </div>
                  </div>
                </div>

                <Button asChild variant="outline" className="w-fit rounded-full bg-background/50">
                  <Link href={category ? `/category/${category.id}` : "/"}>
                    <ArrowLeft className="h-4 w-4" /> Back to {category?.name ?? "home"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container relative mx-auto px-4 py-8 md:py-12">
          <div className="rounded-[2rem] border bg-card/80 p-3 shadow-[0_34px_140px_-80px_rgba(0,0,0,0.9)] backdrop-blur-xl md:p-5">
            <div className="rounded-[1.45rem] border bg-background/50 p-4 md:p-6">{children}</div>
          </div>

          <section className="mt-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.5rem] border bg-card/70 p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Workflow
              </div>
              <ol className="space-y-3 text-sm leading-6 text-muted-foreground">
                <li><strong className="text-foreground">1.</strong> Add your input in the tool area above.</li>
                <li><strong className="text-foreground">2.</strong> Adjust options only if the tool needs them.</li>
                <li><strong className="text-foreground">3.</strong> Run the tool, then copy or download the result.</li>
              </ol>
            </div>

            <div className="rounded-[1.5rem] border bg-card/70 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="az-section-label mb-2">Related tools</div>
                  <h2 className="text-2xl font-black tracking-[-0.04em]">Keep the flow going.</h2>
                </div>
                {category && (
                  <Link href={`/category/${category.id}`} className="hidden text-sm font-black text-primary hover:text-foreground sm:inline-flex">
                    View all
                  </Link>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedTools.map((item) => {
                  const RelatedIcon = item.icon;
                  return (
                    <Link key={item.id} href={item.path} className="group flex items-center gap-3 rounded-2xl border bg-background/44 p-3 transition-all hover:border-primary/50 hover:bg-primary/10">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <RelatedIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-sm font-black group-hover:text-primary">{item.name}</span>
                        <span className="line-clamp-1 text-xs text-muted-foreground">{item.description}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
