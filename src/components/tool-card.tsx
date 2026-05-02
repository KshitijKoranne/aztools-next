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
      <div className="az-card grid h-full grid-cols-[auto_1fr_auto] items-start gap-4 p-4 text-card-foreground">
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-md bg-white/8 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="relative z-10 mb-1 text-lg font-black leading-tight transition-colors group-hover:text-primary">
            {name}
          </h3>
          <p className="relative z-10 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <span className="relative z-10 mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground opacity-0 transition-all group-hover:opacity-100">
          Go
        </span>
      </div>
    </Link>
  );
}
