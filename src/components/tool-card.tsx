import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface ToolCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

export function ToolCard({ name, description, icon: Icon, path }: ToolCardProps) {
  return (
    <Link href={path} className="block group">
      <div className="grid h-full grid-cols-[auto_1fr_auto] items-start gap-4 rounded-2xl border bg-card p-4 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25">
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border bg-background text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="relative z-10 mb-1 text-lg font-semibold leading-tight">
            {name}
          </h3>
          <p className="relative z-10 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <span className="relative z-10 mt-1 flex h-9 w-9 items-center justify-center rounded-full border bg-background text-xs font-semibold text-muted-foreground opacity-0 transition-all group-hover:opacity-100">
          Go
        </span>
      </div>
    </Link>
  );
}
