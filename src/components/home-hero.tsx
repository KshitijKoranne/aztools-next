"use client";

import { TypeAnimation } from "react-type-animation";
import { ArrowRight, Command, FileText, ImageIcon, Search, ShieldCheck, TerminalSquare } from "lucide-react";
import Link from "next/link";

import { categories, tools } from "@/data/tools";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  const sequence: (string | number)[] = categories.flatMap((c) => [c.name, 2000]);
  const marquee = categories.map((category) => category.name).join("  /  ");
  const stats = [
    [String(tools.length), "tools live"],
    ["15", "categories"],
    ["0", "server uploads"],
  ];
  const featured = [
    { icon: FileText, label: "PDF", href: "/category/pdf-tools", category: "pdf-tools", color: "var(--az-coral)" },
    { icon: TerminalSquare, label: "Dev", href: "/category/developer-tools", category: "developer-tools", color: "var(--az-mint)" },
    { icon: ImageIcon, label: "Image", href: "/category/image-tools", category: "image-tools", color: "var(--az-blue)" },
    { icon: ShieldCheck, label: "Secure", href: "/category/security-tools", category: "security-tools", color: "var(--az-amber)" },
  ];

  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,color-mix(in_oklch,var(--az-mint)_18%,transparent),transparent_26%,color-mix(in_oklch,var(--az-coral)_16%,transparent)_48%,transparent_72%,color-mix(in_oklch,var(--az-blue)_16%,transparent))]" />
      <div className="absolute inset-0 -z-10 az-scanline opacity-35" />
      <div className="container mx-auto grid min-h-[620px] items-center gap-10 px-4 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:py-20">
        <div>
          <div className="az-section-label mb-5">Browser tools, tuned fast</div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.92] md:text-7xl lg:text-8xl">
            Utility work should feel
            <span className="block text-primary">electric.</span>
          </h1>
          <div className="mt-6 min-h-10 font-mono text-base font-semibold text-muted-foreground md:text-lg">
            <span>Open a </span>
            <span className="text-foreground">
              <TypeAnimation sequence={sequence} wrapper="span" speed={48} repeat={Infinity} cursor={false} />
            </span>
            <span> tool and finish the job.</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-md font-bold">
              <Link href="/category/pdf-tools">
                Start with PDF tools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-md font-bold">
              <Link href="/category/developer-tools">Browse developer tools</Link>
            </Button>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div key={label} className="az-chrome rounded-lg p-4">
                <div className="font-mono text-2xl font-black">{value}</div>
                <div className="mt-1 text-xs font-medium uppercase text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="az-float">
          <div className="az-chrome overflow-hidden rounded-lg">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-muted-foreground">
                <Command className="h-4 w-4 text-primary" />
                AZ launcher
              </div>
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--az-coral)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--az-amber)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--az-mint)]" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 rounded-md border bg-background/70 px-3 py-3">
                <Search className="h-4 w-4 text-primary" />
                <span className="font-mono text-sm text-muted-foreground">Search 113 tools...</span>
              </div>
              <div className="mt-4 grid gap-3">
                {featured.map(({ icon: Icon, label, href, category, color }) => (
                  <Link key={label} href={href} className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border bg-card/74 p-3 transition-colors hover:bg-accent/70">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border" style={{ color }}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold">{label} tools</span>
                      <span className="text-xs text-muted-foreground">{tools.filter((tool) => tool.category === category).length} workflows</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="overflow-hidden border-t bg-foreground py-3 text-background">
              <div className="az-marquee flex w-max gap-8 font-mono text-xs font-bold uppercase">
                <span>{marquee}</span>
                <span>{marquee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
