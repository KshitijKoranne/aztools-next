"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Command, Search, ShieldCheck, Sparkles, WandSparkles, Zap } from "lucide-react";

import { AuroraToolShader } from "@/components/aurora-tool-shader";
import { categories, tools } from "@/data/tools";

const featuredIds = [
  "pdf-merger",
  "image-compressor",
  "json-formatter",
  "weather-forecast",
  "password-generator",
  "qr-code-generator",
];

const categoryIds = [
  "pdf-tools",
  "image-tools",
  "developer-tools",
  "live-data-tools",
  "calculators",
  "security-tools",
];

const categoryPositions = [
  "lg:left-0 lg:top-[17%]",
  "lg:right-0 lg:top-[19%]",
  "lg:left-[6%] lg:bottom-[25%]",
  "lg:right-[4%] lg:bottom-[28%]",
  "lg:left-[24%] lg:bottom-[8%]",
  "lg:right-[22%] lg:bottom-[8%]",
];

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

  const constellationCategories = useMemo(
    () =>
      categoryIds.flatMap((id, index) => {
        const category = categories.find((item) => item.id === id);
        if (!category) return [];

        return [
          {
            ...category,
            count: tools.filter((tool) => tool.category === category.id).length,
            position: categoryPositions[index],
          },
        ];
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
    <section className="relative isolate overflow-hidden bg-[var(--az-void)] text-white">
      <AuroraToolShader />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.16),transparent_28rem),linear-gradient(180deg,rgba(5,6,16,0.22),rgba(5,6,16,0.92)_78%)]" />
      <div className="absolute inset-0 az-grid opacity-20" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-background" />

      <div className="container relative z-20 mx-auto min-h-[calc(100vh-4rem)] px-4 py-16 md:py-20">
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center justify-center">
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <div className="absolute left-[13%] right-[13%] top-1/2 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
            <div className="absolute left-1/2 top-[12%] h-[72%] w-px bg-gradient-to-b from-transparent via-white/14 to-transparent" />
            <div className="absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
          </div>

          {constellationCategories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.button
                key={category.id}
                type="button"
                onClick={() => openPath(`/category/${category.id}`)}
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                animate={{ opacity: 1, y: [0, -8, 0], scale: 1 }}
                transition={{
                  delay: 0.34 + index * 0.07,
                  y: { duration: 5.5 + index * 0.35, repeat: Infinity, ease: "easeInOut" },
                }}
                className={`absolute z-10 hidden w-[220px] rounded-[1.4rem] border border-white/10 bg-[#090b18]/72 p-4 text-left shadow-[0_30px_110px_-68px_rgba(0,0,0,1)] backdrop-blur-2xl transition-all hover:border-primary/55 hover:bg-[#101323]/86 lg:block ${category.position}`}
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/14 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="block text-sm font-black tracking-[-0.01em]">{category.name}</span>
                <span className="mt-1 block text-xs font-semibold text-white/42">{category.count} working tools</span>
              </motion.button>
            );
          })}

          <div className="relative z-20 mx-auto w-full max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur-2xl"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Utility command center
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55 }}
              className="mx-auto max-w-4xl text-balance text-5xl font-black leading-[0.9] tracking-[-0.06em] md:text-7xl lg:text-8xl"
            >
              Open a tool.
              <span className="block bg-gradient-to-r from-[var(--az-mint)] via-[var(--az-cyan)] to-[var(--az-gold)] bg-clip-text text-transparent">
                Finish the job.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="mx-auto mt-7 max-w-2xl text-base font-medium leading-8 text-white/64 md:text-lg"
            >
              A fast, beautiful workspace for PDF fixes, image work, developer utilities, live lookups,
              calculators, and everyday browser tasks.
            </motion.p>

            <motion.form
              ref={searchRef}
              onSubmit={submitSearch}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55 }}
              className="relative z-30 mx-auto mt-9 w-full max-w-3xl"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#070914]/82 p-2 shadow-[0_38px_150px_-76px_rgba(38,245,167,0.8)] backdrop-blur-2xl transition-all duration-300 focus-within:border-primary/70 focus-within:ring-4 focus-within:ring-primary/15">
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
                <div className="relative flex items-center">
                  <Search className="ml-4 h-5 w-5 shrink-0 text-primary" />
                  <input
                    name="q"
                    type="search"
                    placeholder="Search PDF, image, JSON, weather..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full border-none bg-transparent px-4 py-4 text-base font-semibold text-white outline-none placeholder:text-white/34 focus:ring-0"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="hidden whitespace-nowrap rounded-[1.35rem] bg-primary px-6 py-4 text-sm font-black text-primary-foreground transition-transform hover:scale-[1.02] md:inline-flex"
                  >
                    Search tools
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 -z-10 translate-y-7 rounded-[2rem] bg-primary/18 blur-3xl" />

              {isSearching && (
                <div className="absolute left-0 right-0 top-full z-30 mt-4 max-h-[430px] overflow-auto rounded-[1.7rem] border border-white/10 bg-[#080a16]/94 p-2 text-left shadow-2xl backdrop-blur-2xl">
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
                          className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.2rem] px-3 py-3 text-left transition-colors hover:bg-white/[0.08]"
                        >
                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.07] text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-black text-white group-hover:text-primary">
                              {tool.name}
                            </span>
                            <span className="block truncate text-xs font-medium text-white/45">
                              {category?.name ?? "Tool"} / {tool.description}
                            </span>
                          </span>
                          <ArrowRight className="h-4 w-4 text-white/24 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-[1.2rem] px-4 py-5 text-sm font-medium text-white/54">
                      No matching tools found. Press Enter to search all tools.
                    </div>
                  )}
                </div>
              )}
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2"
            >
              {featuredTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => openPath(tool.path)}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-xs font-black text-white/62 backdrop-blur transition-colors hover:border-primary/50 hover:bg-primary/12 hover:text-primary"
                >
                  <Zap className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
                  {tool.name}
                </button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.55 }}
              className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3"
            >
              {[
                [String(tools.length), "real tools"],
                [String(categories.length), "categories"],
                ["0", "forced logins"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.4rem] border border-white/10 bg-white/[0.055] px-4 py-4 backdrop-blur-2xl">
                  <div className="text-2xl font-black tracking-[-0.04em] md:text-3xl">{value}</div>
                  <div className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/42">{label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.55 }}
              className="mx-auto mt-5 flex max-w-xl items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-3 text-xs font-bold text-primary backdrop-blur-2xl md:text-sm"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Every shortcut opens a working tool. No demos, no dead ends.
            </motion.div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/38 lg:flex">
        <WandSparkles className="h-3.5 w-3.5 text-primary" />
        Built for repeat visits
      </div>
    </section>
  );
}
