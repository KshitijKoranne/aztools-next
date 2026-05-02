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
      <div className="az-card h-full p-4 text-card-foreground">
        <div className="relative z-10 mb-8 flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[linear-gradient(135deg,var(--az-green),var(--az-green-soft))] text-black shadow-[0_18px_50px_-26px_var(--az-green)]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-black uppercase text-muted-foreground">
            {toolCount} {toolCount === 1 ? "tool" : "tools"}
          </div>
        </div>
        <h3 className="relative z-10 mb-2 text-xl font-black leading-tight transition-colors group-hover:text-primary">
          {name}
        </h3>
        <p className="relative z-10 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="relative z-10 mt-6 flex items-center gap-1">
          <span className="h-1.5 w-8 rounded-full bg-primary" />
          <span className="h-1.5 w-4 rounded-full bg-white/20" />
          <span className="h-1.5 w-2 rounded-full bg-white/12" />
        </div>
      </div>
    </Link>
  );
}
