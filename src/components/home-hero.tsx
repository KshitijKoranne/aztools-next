import { ArrowRight, FileText, ImageIcon, Search, ShieldCheck, Sparkles, TerminalSquare } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { categories, tools } from "@/data/tools";

export function HomeHero() {
  const stats = [
    [String(tools.length), "working tools"],
    [String(categories.length), "clean categories"],
    ["0", "login required"],
  ];
  const featured = [
    { icon: FileText, label: "PDF tools", href: "/category/pdf-tools", category: "pdf-tools" },
    { icon: TerminalSquare, label: "Developer tools", href: "/category/developer-tools", category: "developer-tools" },
    { icon: ImageIcon, label: "Image tools", href: "/category/image-tools", category: "image-tools" },
    { icon: ShieldCheck, label: "Security tools", href: "/category/security-tools", category: "security-tools" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_50%_-16%,rgba(173,198,255,0.28),transparent_52%)]" />
      <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-[#1ed760]/10 blur-3xl" />

      <div className="container relative mx-auto grid min-h-[760px] items-center gap-12 px-4 py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.82fr)] lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-[#adc6ff]" />
            Handcrafted utility hub
          </div>

          <h1 className="max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white md:text-7xl lg:text-8xl">
            We have a tool
            <span className="block bg-[linear-gradient(90deg,#ffffff,#adc6ff,#3de96f)] bg-clip-text text-transparent">
              for that.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-white/64 md:text-xl md:leading-8">
            Free, simple, and useful browser tools for PDFs, images, code, text, SEO, finance, and daily work.
          </p>

          <form action="/search" className="mt-9 max-w-2xl">
            <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] p-2 shadow-[0_24px_100px_-60px_rgba(173,198,255,0.65)] backdrop-blur-xl transition-all focus-within:border-[#adc6ff]/60 focus-within:bg-white/[0.11]">
              <Search className="ml-3 h-5 w-5 shrink-0 text-[#adc6ff]" />
              <input
                name="q"
                type="search"
                placeholder={`Search ${tools.length} tools...`}
                className="h-12 min-w-0 flex-1 bg-transparent text-base font-semibold text-white outline-none placeholder:text-white/36"
              />
              <Button type="submit" className="rounded-xl bg-[#adc6ff] px-5 font-black text-[#002e69] hover:bg-white">
                Search
              </Button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-white px-6 font-black text-black hover:bg-[#adc6ff]">
              <Link href="#featured-tools">
                Explore tools <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-white/15 bg-white/[0.04] px-6 font-black text-white hover:bg-white/[0.1] hover:text-white">
              <Link href="#categories">Browse categories</Link>
            </Button>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
                <div className="text-2xl font-black text-white md:text-3xl">{value}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/42">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -inset-10 rounded-[3rem] bg-[#adc6ff]/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#131313]/88 p-4 shadow-[0_34px_140px_-70px_rgba(0,0,0,1)] backdrop-blur-2xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#0e0e0e] p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#adc6ff]">AzTools workspace</p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">Start faster</h2>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {featured.map(({ icon: Icon, label, href, category }) => (
                  <Link key={label} href={href} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition-all hover:-translate-y-0.5 hover:border-[#adc6ff]/50 hover:bg-white/[0.08]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#adc6ff]/10 text-[#adc6ff]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-black text-white">{label}</span>
                      <span className="text-xs font-semibold text-white/42">{tools.filter((tool) => tool.category === category).length} working utilities</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/28 transition-all group-hover:translate-x-1 group-hover:text-[#adc6ff]" />
                  </Link>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#3de96f]/20 bg-[#3de96f]/10 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#69ff89]">Built with care</div>
                <p className="mt-2 text-sm leading-6 text-white/64">Small details, real tools, quick actions, and a calm interface for repeat daily use.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
