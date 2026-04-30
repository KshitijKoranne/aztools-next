import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  toolCount: number;
}

export function CategoryCard({
  id,
  name,
  description,
  icon: Icon,
  toolCount,
}: CategoryCardProps) {
  return (
    <Link href={`/category/${id}`} className="block group">
      <div className="rounded-lg border bg-card text-card-foreground p-5 h-full transition-all hover:border-primary/50 hover:shadow-md">
        <div className="flex justify-between items-start mb-3">
          <div className="bg-primary/10 rounded-md p-2 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="text-xs bg-muted inline-block px-2 py-1 rounded-md text-muted-foreground">
            {toolCount} {toolCount === 1 ? "tool" : "tools"}
          </div>
        </div>
        <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
