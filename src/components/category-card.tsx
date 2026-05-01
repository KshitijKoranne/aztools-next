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
      <div className="az-card h-full p-5 text-card-foreground">
        <div className="relative z-10 flex justify-between items-start mb-5">
          <div className="rounded-md border bg-background/70 p-2 text-primary shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
          <div className="rounded-full border bg-background/70 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase text-muted-foreground">
            {toolCount} {toolCount === 1 ? "tool" : "tools"}
          </div>
        </div>
        <h3 className="relative z-10 mb-2 text-xl font-black leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="relative z-10 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="relative z-10 mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,var(--az-mint),var(--az-blue),var(--az-coral))]" />
        </div>
      </div>
    </Link>
  );
}
