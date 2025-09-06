"use client"

import { MainLayout } from "@/components/layouts/MainLayout";
import { CategoryCard } from "@/components/CategoryCard";
import { categories, getToolsByCategory } from "@/data/tools";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  // Create sequence for type animation - matching original exactly
  const sequence = [
    'Text Utilities',
    2000,
    'Developer Tools',
    2000,
    'Color Tools',
    2000,
    'Calculators',
    2000,
    'IT Tools',
    2000,
    'PDF Tools',
    2000,
    'Image Tools',
    2000,
    'SEO Tools',
    2000,
    'Time Tools',
    2000,
    'Security Tools',
    2000,
    'Content Tools',
    2000,
    'Data Tools',
    2000,
    'Finance Tools',
    2000,
    'Productivity Tools',
    2000,
    'Random Tools',
    2000,
  ];
  
  return (
    <MainLayout>
      <section className="bg-gradient-to-b from-primary/20 via-primary/10 to-background pt-16 pb-20">
        <div className="container text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
            All the{" "}
            <span className="inline-block min-w-[300px] animate-color-shift">
              <TypeAnimation
                sequence={sequence}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                cursor={false}
              />
            </span>
            <br />
            <span className="inline-block mt-2">you need in one place</span>
          </h1>
          <p className="text-xl text-foreground mb-8 animate-slide-in font-medium">
            Transform your workflow with professional-grade online tools. From PDF processing to image editing, 
            text formatting to data conversion - everything you need, beautifully crafted and lightning fast.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Categories</h2>
            <p className="text-muted-foreground">Browse our tools by category</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
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
