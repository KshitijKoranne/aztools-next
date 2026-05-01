import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layouts/main-layout";
import { getToolById, getCategoryById } from "@/data/tools";
import { jsonLd, siteName, siteUrl } from "@/lib/seo";

interface ToolLayoutProps {
  toolId: string;
  children: React.ReactNode;
}

export function ToolLayout({ toolId, children }: ToolLayoutProps) {
  const tool = getToolById(toolId);
  const category = tool ? getCategoryById(tool.category) : null;

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
      <div className="container mx-auto px-4 py-10">
        <div className="az-chrome mb-8 rounded-lg p-4 md:p-6">
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" asChild className="mr-2 rounded-md">
              <Link
                href={category ? `/category/${category.id}` : "/"}
                aria-label={category ? `Back to ${category.name}` : "Back to home"}
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            {category && (
              <Link
                href={`/category/${category.id}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
            )}
          </div>
          <div className="az-section-label mb-2">Tool</div>
          <h1 className="text-4xl font-black leading-tight">{tool?.name}</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">{tool?.description}</p>
        </div>

        <div>{children}</div>
      </div>
    </MainLayout>
  );
}
