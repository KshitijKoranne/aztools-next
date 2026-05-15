import { CategoryCard } from "@/components/category-card";
import { HomeHero } from "@/components/home-hero";
import { MainLayout } from "@/components/layouts/main-layout";
import { categories, getToolsByCategory } from "@/data/tools";
import { jsonLd, siteUrl } from "@/lib/seo";

export default function Home() {
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

      <section id="categories" className="bg-background px-6 py-12 text-foreground md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12">
            <div>
              <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.02em] text-foreground">
                Choose a category
              </h2>
              <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
                Convert, compress, calculate, inspect, generate, and clean up everyday work from one place.
              </p>
            </div>
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
    </MainLayout>
  );
}
