import { ReactNode } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getToolById } from "@/data/tools";

interface ToolLayoutProps {
  toolId: string;
  categoryId: string;
  children: ReactNode;
}

export function ToolLayout({ toolId, categoryId, children }: ToolLayoutProps) {
  const tool = getToolById(toolId);
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-4">
              <Link href={`/category/${categoryId}`}>
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Category</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{tool?.name}</h1>
              <p className="text-muted-foreground">{tool?.description}</p>
            </div>
          </div>
        </div>
        
        {children}
      </div>
    </MainLayout>
  );
}