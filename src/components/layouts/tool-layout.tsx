import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Home, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layouts/main-layout";
import { getToolById, getCategoryById, getToolsByCategory } from "@/data/tools";
import { jsonLd, siteName, siteUrl } from "@/lib/seo";

interface ToolLayoutProps {
  toolId: string;
  children: React.ReactNode;
}

export function ToolLayout({ toolId, children }: ToolLayoutProps) {
  const tool = getToolById(toolId);
  const category = tool ? getCategoryById(tool.category) : null;
  const relatedTools = category
    ? getToolsByCategory(category.id).filter((item) => item.id !== toolId).slice(0, 4)
    : [];
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
                  ? [
                      {
                        "@type": "ListItem",
                        position: 2,
                        name: category.name,
                        item: `${siteUrl}/category/${category.id}`,
                      },
                    ]
                  : []),
                {
                  "@type": "ListItem",
                  position: category ? 3 : 2,
                  name: tool.name,
                  item: `${siteUrl}${tool.path}`,
                },
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

      <div className="min-h-[70vh] bg-[#050505] text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_-20%,rgba(173,198,255,0.24),transparent_58%)]" />
          <div className="container relative mx-auto px-4 py-10 md:py-14">
            <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-white/50">
              <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-[#adc6ff]">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              {category && (
                <>
                  <span>/</span>
                  <Link href={`/category/${category.id}`} className="transition-colors hover:text-[#adc6ff]">
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

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  {category && (
                    <Link
                      href={`/category/${category.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#adc6ff] transition-colors hover:bg-white/[0.1]"
                    >
                      {category.name}
                    </Link>
                  )}
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#3de96f]/20 bg-[#3de96f]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#69ff89]">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Free · No login
                  </span>
                </div>

                <div className="flex items-start gap-5">
                  {Icon && (
                    <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] text-[#adc6ff] shadow-[0_24px_80px_-52px_rgba(173,198,255,0.8)] sm:flex">
                      <Icon className="h-7 w-7" />
                    </div>
                  )}
                  <div>
                    <div className="az-section-label mb-3">Tool workspace</div>
                    <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] md:text-6xl">
                      {tool?.name ?? "Tool"}
                    </h1>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-white/62 md:text-lg">
                      {tool?.description ?? "A simple, useful browser tool from AzTools."}
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild variant="outline" className="w-fit rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.1] hover:text-white">
                <Link href={category ? `/category/${category.id}` : "/"}>
                  <ArrowLeft className="h-4 w-4" /> Back to {category?.name ?? "home"}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="rounded-[2rem] border border-white/10 bg-[#131313]/86 p-3 shadow-[0_34px_140px_-80px_rgba(0,0,0,1)] backdrop-blur-xl md:p-5">
            <div className="rounded-[1.45rem] border border-white/10 bg-[#0e0e0e] p-4 md:p-6">
              {children}
            </div>
          </div>

          <section className="mt-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#adc6ff]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#adc6ff]">
                <Sparkles className="h-3.5 w-3.5" /> How to use
              </div>
              <ol className="space-y-3 text-sm leading-6 text-white/62">
                <li><strong className="text-white">1.</strong> Add your input in the tool area above.</li>
                <li><strong className="text-white">2.</strong> Adjust options only if the tool needs them.</li>
                <li><strong className="text-white">3.</strong> Run the tool, then copy or download the result.</li>
              </ol>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="az-section-label mb-2">Related tools</div>
                  <h2 className="text-2xl font-black tracking-[-0.03em]">Keep working faster.</h2>
                </div>
                {category && (
                  <Link href={`/category/${category.id}`} className="hidden text-sm font-bold text-[#adc6ff] hover:text-white sm:inline-flex">
                    View all
                  </Link>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedTools.map((item) => {
                  const RelatedIcon = item.icon;
                  return (
                    <Link key={item.id} href={item.path} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition-all hover:border-[#adc6ff]/50 hover:bg-white/[0.08]">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-white/60 group-hover:text-[#adc6ff]">
                        <RelatedIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 text-sm font-black text-white group-hover:text-[#adc6ff]">{item.name}</span>
                        <span className="line-clamp-1 text-xs text-white/42">{item.description}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-white/24 group-hover:text-[#adc6ff]" />
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
