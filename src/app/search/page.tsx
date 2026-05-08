import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";

import { MainLayout } from "@/components/layouts/main-layout";
import { categories, tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Search Tools - AZ Tools",
  description: "Search free online tools on AZ Tools.",
  alternates: { canonical: "https://aztools.in/search" },
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const normalizedQuery = query.toLowerCase();

  const results = normalizedQuery
    ? tools.filter((tool) => {
        const category = categories.find((item) => item.id === tool.category);
        return (
          tool.name.toLowerCase().includes(normalizedQuery) ||
          tool.description.toLowerCase().includes(normalizedQuery) ||
          tool.category.toLowerCase().includes(normalizedQuery) ||
          category?.name.toLowerCase().includes(normalizedQuery)
        );
      })
    : tools;

  return (
    <MainLayout>
      <main className="min-h-[70vh] bg-[#131313] px-6 py-12 text-[#e5e2e1] md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#414755]/35 bg-[#201f1f]/70 px-4 py-2 text-sm font-semibold text-[#adc6ff] transition-colors hover:bg-[#2a2a2a]"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>

          <section className="mb-12 rounded-[2rem] border border-[#414755]/25 bg-[#201f1f]/70 p-6 shadow-sm backdrop-blur-xl md:p-10">
            <div className="mb-6 max-w-3xl">
              <h1 className="text-4xl font-bold leading-tight tracking-[-0.04em] text-[#e5e2e1] md:text-5xl">
                Search tools
              </h1>
              <p className="mt-3 text-base leading-7 text-[#c1c6d7]">
                {query
                  ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query}”.`
                  : `Search or browse all ${tools.length} tools.`}
              </p>
            </div>

            <form action="/search" className="relative max-w-2xl">
              <div className="flex items-center rounded-full border border-[#8b90a0]/10 bg-[#131313]/70 p-1 shadow-lg backdrop-blur-2xl transition-all duration-300 focus-within:border-[#adc6ff] focus-within:ring-2 focus-within:ring-[#adc6ff]">
                <Search className="ml-4 h-5 w-5 shrink-0 text-[#8b90a0]" />
                <input
                  name="q"
                  type="search"
                  defaultValue={query}
                  placeholder="Search for a tool..."
                  className="w-full border-none bg-transparent px-4 py-3 text-base text-[#e5e2e1] outline-none placeholder:text-[#414755] focus:ring-0"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-full bg-[#adc6ff] px-6 py-3 text-base font-medium text-[#002e69] transition-opacity hover:opacity-90"
                >
                  Search
                </button>
              </div>
            </form>
          </section>

          {results.length > 0 ? (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((tool) => {
                const Icon = tool.icon;
                const category = categories.find((item) => item.id === tool.category);
                return (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className="group relative flex min-h-[210px] flex-col gap-4 overflow-hidden rounded-3xl border border-[#414755]/25 bg-[#201f1f]/70 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#adc6ff]/30 hover:shadow-md"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#adc6ff]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a2a2a] text-[#adc6ff] transition-colors group-hover:bg-[#adc6ff] group-hover:text-[#002e69]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-lg bg-[#353534] px-2 py-1 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#c1c6d7]">
                        {category?.name ?? "Tool"}
                      </span>
                    </div>
                    <div className="relative z-10 mt-auto">
                      <h2 className="mb-1 text-2xl font-semibold leading-snug tracking-[-0.01em] text-[#e5e2e1]">
                        {tool.name}
                      </h2>
                      <p className="text-sm leading-6 text-[#c1c6d7]">{tool.description}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#adc6ff] transition-all group-hover:gap-3">
                        Open tool <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </section>
          ) : (
            <section className="rounded-[2rem] border border-[#414755]/25 bg-[#201f1f]/70 p-8 text-center shadow-sm backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-[#e5e2e1]">No tools found</h2>
              <p className="mt-2 text-[#c1c6d7]">Try a different keyword like PDF, image, JSON, text, calculator, or SEO.</p>
            </section>
          )}
        </div>
      </main>
    </MainLayout>
  );
}
