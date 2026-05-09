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
      <div className="grid h-full grid-cols-[auto_1fr_auto] items-start gap-4 rounded-2xl border border-white/10 bg-[#201f1f]/60 p-4 text-[#e5e2e1] transition-all duration-300 hover:-translate-y-1 hover:border-white/22 hover:bg-[#242424]">
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white transition-colors group-hover:bg-white group-hover:text-black">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="relative z-10 mb-1 text-lg font-semibold leading-tight">
            {name}
          </h3>
          <p className="relative z-10 text-sm leading-6 text-[#c1c6d7]/80">{description}</p>
        </div>
        <span className="relative z-10 mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-semibold text-white/60 opacity-0 transition-all group-hover:opacity-100">
          Go
        </span>
      </div>
    </Link>
  );
}
