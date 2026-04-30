"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Coffee, Search } from "lucide-react";
import { categories } from "@/data/tools";

export function MobileNav() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Image
            src="/favicon-32x32.png"
            alt="AZ Tools"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span>
            <span className="text-primary">AZ</span>
            <span>Tools</span>
          </span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search tools..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </form>

      <nav className="flex-1 overflow-auto px-3 py-4">
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Categories
        </p>
        <ul className="space-y-1">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/category/${c.id}`}
                className="block px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-6 py-4 border-t">
        <a
          href="https://www.buymeacoffee.com/kshitijkorz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
        >
          <Coffee className="h-4 w-4" />
          <span>Support the project</span>
        </a>
      </div>
    </div>
  );
}
