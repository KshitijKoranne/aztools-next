import { MainLayout } from "@/components/layouts/main-layout";
import { CategoryCard } from "@/components/category-card";
import { HomeHero } from "@/components/home-hero";
import { categories, getToolsByCategory } from "@/data/tools";

export default function Home() {
  return (
    <MainLayout>
      <HomeHero />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Categories</h2>
            <p className="text-muted-foreground">Browse our tools by category</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
