import { ArrowRight, FileText, ImageIcon, Play, Search, ShieldCheck, Sparkles, TerminalSquare } from "lucide-react";
import Link from "next/link";

import { categories, tools } from "@/data/tools";
import { Button } from "@/components/ui/button";

export function HomeHero() {
  const marquee = categories.map((category) => category.name).join("  •  ");
  const stats = [
    [String(tools.length), "tools live"],
    ["15", "categories"],
    ["0", "server uploads"],
  ];
  const featured = [
    { icon: FileText, label: "PDF", href: "/category/pdf-tools", category: "pdf-tools", color: "var(--az-green)" },
    { icon: TerminalSquare, label: "Dev", href: "/category/developer-tools", category: "developer-tools", color: "var(--az-cyan)" },
    { icon: ImageIcon, label: "Image", href: "/category/image-tools", category: "image-tools", color: "var(--az-rose)" },
    { icon: ShieldCheck, label: "Secure", href: "/category/security-tools", category: "security-tools", color: "var(--az-warm)" },
  ];

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,#1f3f2d_0%,#121212_38%,#050505_100%)]">
      <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_50%_0%,rgba(30,215,96,0.38),transparent_48%)]" />
      <div className="container relative mx-auto grid min-h-[650px] items-center gap-10 px-4 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.86fr)] lg:py-20">
        <div>
          <div className="az-section-label mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
            <Sparkles className="h-3.5 w-3.5" />
            Free online tools, arranged like playlists
          </div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.9] text-white md:text-7xl lg:text-8xl">
            Your daily tools,
            <span className="block text-primary">queued up fast.</span>
          </h1>
          <div className="mt-6 max-w-2xl text-base font-semibold leading-7 text-white/68 md:text-lg">
            Choose PDFs, images, code, text, and more. Finish common tasks in your browser, fast.
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-primary px-6 font-black text-primary-foreground hover:bg-primary/90">
              <Link href="/category/pdf-tools">
                <Play className="h-4 w-4 fill-current" />
                Start with PDF tools
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-white/20 bg-white/5 px-6 font-black text-white hover:bg-white/12 hover:text-white">
              <Link href="/category/developer-tools">Browse developer tools</Link>
            </Button>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="mt-1 text-xs font-bold uppercase text-white/48">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="az-float">
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#121212]/92 shadow-[0_34px_100px_-48px_rgba(0,0,0,1)]">
            <div className="grid gap-4 p-5">
              <div className="relative min-h-52 overflow-hidden rounded-lg bg-[linear-gradient(135deg,#1ed760,#0f7f37_52%,#163b25)] p-5 text-[#071108]">
                <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full az-vinyl az-spin-slow shadow-2xl" />
                <div className="relative z-10 flex h-full max-w-[15rem] flex-col justify-end">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-black text-primary shadow-lg">
                    <Play className="h-5 w-5 fill-current" />
                  </div>
                  <div className="text-xs font-black uppercase tracking-[0.18em]">Featured mix</div>
                  <div className="mt-2 text-4xl font-black leading-none">Work faster today</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-3">
                <Search className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-white/58">Search {tools.length} tools...</span>
              </div>
              <div className="grid gap-2">
                {featured.map(({ icon: Icon, label, href, category, color }) => (
                  <Link key={label} href={href} className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md p-3 transition-colors hover:bg-white/10">
                    <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white/10" style={{ color }}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-bold text-white">{label} tools</span>
                      <span className="text-xs font-semibold text-white/46">{tools.filter((tool) => tool.category === category).length} workflows</span>
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="overflow-hidden border-t border-white/10 bg-black py-3 text-white">
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
