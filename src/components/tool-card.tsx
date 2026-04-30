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
      <div className="rounded-lg border bg-card text-card-foreground p-5 h-full transition-all hover:border-primary/50 hover:shadow-md">
        <div className="bg-primary/10 rounded-md p-2 text-primary inline-flex mb-3">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-medium text-lg mb-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
