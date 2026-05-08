"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Command, Search } from "lucide-react";

import { categories, tools } from "@/data/tools";

const featuredIds = [
  "pdf-merger",
  "image-compressor",
  "json-formatter",
  "weather-forecast",
  "password-generator",
  "qr-code-generator",
];

const categoryIds = ["pdf-tools", "image-tools", "developer-tools", "live-data-tools"];

export function HomeHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  const featuredTools = useMemo(
    () =>
      featuredIds.flatMap((id) => {
        const tool = tools.find((item) => item.id === id);
        return tool ? [tool] : [];
      }),
    []
  );

  const keyCategories = useMemo(
    () =>
      categoryIds.flatMap((id) => {
        const category = categories.find((item) => item.id === id);
        if (!category) return [];
        return [{ ...category, count: tools.filter((tool) => tool.category === category.id).length }];
      }),
    []
  );

  const matchingTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return featuredTools;

    return tools.filter((tool) => {
      const category = categories.find((item) => item.id === tool.category);
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        category?.name.toLowerCase().includes(q)
      );
    });
  }, [featuredTools, searchQuery]);

  const searchResults = matchingTools.slice(0, 8);
  const totalResults = matchingTools.length;
  const isSearching = Boolean(searchQuery.trim());

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openPath = (path: string) => {
    setSearchQuery("");
    router.push(path);
  };

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    setSearchQuery("");
  };

  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
        <div className="grid min-h-[650px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6 inline-flex rounded-full border border-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/60"
            >
              Free online tools
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.45 }}
              className="max-w-4xl text-balance text-5xl font-black leading-[0.94] tracking-[-0.055em] md:text-7xl lg:text-8xl"
            >
              Open a tool.
              <span className="block text-white/58">Finish the job.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/62 md:text-lg"
            >
              PDFs, images, text, code, SEO, calculators, and live lookups in one fast browser workspace.
              No account. No fake demos. Just tools that work.
            </motion.p>

            <motion.form
              ref={searchRef}
              onSubmit={submitSearch}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.45 }}
              className="relative z-30 mt-9 w-full max-w-3xl"
            >
              <div className="flex items-center rounded-[1.5rem] border border-white/16 bg-white/[0.06] p-2 shadow-[0_40px_120px_-80px_rgba(255,255,255,0.55)] backdrop-blur-xl transition-colors focus-within:border-white/40">
                <Search className="ml-4 h-5 w-5 shrink-0 text-white/58" />
                <input
                  name="q"
                  type="search"
                  placeholder="Search PDF, image, JSON, weather..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full border-none bg-transparent px-4 py-4 text-base font-semibold text-white outline-none placeholder:text-white/35 focus:ring-0"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="hidden whitespace-nowrap rounded-[1.1rem] bg-white px-6 py-4 text-sm font-black text-black transition-colors hover:bg-white/86 md:inline-flex"
                >
                  Search
                </button>
              </div>

              {isSearching && (
                <div className="absolute left-0 right-0 top-full z-30 mt-3 max-h-[430px] overflow-auto rounded-[1.25rem] border border-white/14 bg-black/94 p-2 text-left shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-white/42">
                    <span>{totalResults} matches</span>
                    <Command className="h-3.5 w-3.5" />
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((tool) => {
                      const Icon = tool.icon;
                      const category = categories.find((item) => item.id === tool.category);

                      return (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() => openPath(tool.path)}
                          className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-white/[0.08]"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] text-white">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-black text-white">{tool.name}</span>
                            <span className="block truncate text-xs font-medium text-white/45">
                              {category?.name ?? "Tool"} / {tool.description}
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 text-white/28 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl px-4 py-5 text-sm font-medium text-white/54">
                      No matching tools found. Press Enter to search all tools.
                    </div>
                  )}
                </div>
              )}
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.45 }}
              className="mt-5 flex max-w-3xl flex-wrap gap-2"
            >
              {featuredTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => openPath(tool.path)}
                  className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-2 text-xs font-black text-white/60 transition-colors hover:border-white/35 hover:bg-white hover:text-black"
                >
                  {tool.name}
                </button>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            className="rounded-[1.5rem] border border-white/14 bg-white/[0.045] p-3 backdrop-blur-xl"
          >
            <div className="grid grid-cols-3 gap-2 border-b border-white/10 pb-3">
              {[
                [String(tools.length), "tools"],
                [String(categories.length), "sets"],
                ["0", "logins"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white/[0.055] px-3 py-4 text-center">
                  <div className="text-2xl font-black tracking-[-0.04em]">{value}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/42">{label}</div>
                </div>
              ))}
            </div>

            <div className="pt-3">
              {keyCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-white/[0.08]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-black">{category.name}</span>
                      <span className="text-xs font-semibold text-white/42">{category.count} tools</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/26 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
