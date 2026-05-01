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
      <div className="az-card h-full p-5 text-card-foreground">
        <div className="relative z-10 mb-4 inline-flex rounded-md border bg-background/70 p-2 text-primary shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="relative z-10 mb-2 text-lg font-black leading-tight group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="relative z-10 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
