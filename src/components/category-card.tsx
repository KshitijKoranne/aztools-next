import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  toolCount: number;
}

export function CategoryCard({ id, name, description, icon: Icon, toolCount }: CategoryCardProps) {
  return (
    <Link href={`/category/${id}`} className="group block h-full">
      <article className="az-card h-full p-5 text-card-foreground md:p-6">
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-primary/12 text-primary shadow-[0_18px_60px_-36px_color-mix(in_oklch,var(--primary)_80%,#000)]">
            <Icon className="h-6 w-6" />
          </div>
          <div className="rounded-full border bg-background/55 px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] text-muted-foreground">
            {toolCount} {toolCount === 1 ? "tool" : "tools"}
          </div>
        </div>

        <h3 className="relative z-10 mt-8 text-2xl font-black leading-tight tracking-[-0.03em] text-card-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>
        <p className="relative z-10 mt-3 text-sm leading-6 text-muted-foreground">{description}</p>

        <div className="relative z-10 mt-7 inline-flex items-center gap-2 text-sm font-black text-primary opacity-80 transition-all group-hover:gap-3 group-hover:opacity-100">
          Browse category <ArrowRight className="h-4 w-4" />
        </div>
      </article>
    </Link>
  );
}
