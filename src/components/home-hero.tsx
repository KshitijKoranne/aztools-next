"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Command, MousePointer2, Search, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { AuroraToolShader } from "@/components/aurora-tool-shader";
import { categories, tools } from "@/data/tools";

const featuredIds = ["pdf-merger", "image-compressor", "json-formatter", "weather-forecast", "password-generator", "qr-code-generator"];

const orbitCards = [
  { label: "PDF", className: "left-[6%] top-[24%] rotate-[-7deg]", tone: "text-[var(--az-mint)]" },
  { label: "Image", className: "right-[8%] top-[18%] rotate-[6deg]", tone: "text-[var(--az-rose)]" },
  { label: "JSON", className: "left-[12%] bottom-[18%] rotate-[5deg]", tone: "text-[var(--az-cyan)]" },
  { label: "Live API", className: "right-[11%] bottom-[21%] rotate-[-5deg]", tone: "text-[var(--az-gold)]" },
];

export function HomeHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  const featuredTools = useMemo(
    () => featuredIds.flatMap((id) => {
      const tool = tools.find((item) => item.id === id);
      return tool ? [tool] : [];
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

  const openTool = (path: string) => {
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
      <div className="absolute inset-0 az-grid opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />

      {orbitCards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
          transition={{ delay: 0.35 + index * 0.08, y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut" } }}
          className={`pointer-events-none absolute z-10 hidden rounded-3xl border border-white/10 bg-white/[0.07] px-5 py-4 text-sm font-black uppercase tracking-[0.16em] shadow-2xl backdrop-blur-2xl lg:block ${card.className}`}
        >
          <span className={card.tone}>{card.label}</span>
        </motion.div>
      ))}

      <div className="container relative z-20 mx-auto grid min-h-[760px] items-center gap-10 px-4 py-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-24">
        <div className="mx-auto max-w-5xl text-center lg:mx-0 lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/72 backdrop-blur-2xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built for people who just need it done
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="text-balance text-5xl font-black leading-[0.88] tracking-[-0.075em] md:text-7xl lg:text-[6.7rem]"
          >
            Every tool you need.
            <span className="block bg-gradient-to-r from-[var(--az-mint)] via-[var(--az-cyan)] to-[var(--az-rose)] bg-clip-text text-transparent">
              One unforgettable place.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55 }}
            className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-8 text-white/68 lg:mx-0"
          >
            Search, convert, compress, inspect, calculate, and generate without bouncing between random sites.
            AZ Tools is a fast utility cockpit for daily work.
          </motion.p>

          <motion.form
            ref={searchRef}
            onSubmit={submitSearch}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.55 }}
            className="relative z-30 mx-auto mt-9 w-full max-w-2xl lg:mx-0"
          >
            <div className="relative z-10 flex items-center rounded-[2rem] border border-white/12 bg-[#080a16]/72 p-2 shadow-[0_32px_140px_-68px_rgba(38,245,167,0.75)] backdrop-blur-2xl transition-all duration-300 focus-within:border-primary/70 focus-within:ring-4 focus-within:ring-primary/15">
              <Search className="ml-4 h-5 w-5 shrink-0 text-primary" />
              <input
                name="q"
                type="search"
                placeholder="Search PDF, image, JSON, weather..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full border-none bg-transparent px-4 py-4 text-base font-semibold text-white outline-none placeholder:text-white/36 focus:ring-0"
                autoComplete="off"
              />
              <button
                type="submit"
                className="hidden whitespace-nowrap rounded-[1.35rem] bg-primary px-6 py-4 text-sm font-black text-primary-foreground transition-transform hover:scale-[1.02] md:inline-flex"
              >
                Open tools
              </button>
            </div>

            <div className="absolute inset-0 -z-10 translate-y-6 rounded-[2rem] bg-primary/20 blur-3xl" />

            {isSearching && (
            <div className="absolute left-0 right-0 top-full z-30 mt-4 max-h-[430px] overflow-auto rounded-[1.7rem] border border-white/10 bg-[#080a16]/92 p-2 text-left shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-white/42">
                <span>{isSearching ? `${totalResults} matches` : "Try these"}</span>
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
                      onClick={() => openTool(tool.path)}
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
            className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-2 lg:mx-0 lg:justify-start"
          >
            {featuredTools.slice(0, 5).map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => openTool(tool.path)}
                className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black text-white/62 backdrop-blur transition-colors hover:border-primary/50 hover:bg-primary/12 hover:text-primary"
              >
                {tool.name}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.55 }}
            className="mt-8 grid max-w-2xl grid-cols-3 gap-3"
          >
            {[
              [String(tools.length), "tools"],
              [String(categories.length), "categories"],
              ["0", "forced logins"],
            ].map(([value, label]) => (
              <div key={label} className="az-glass rounded-3xl px-4 py-5">
                <div className="text-3xl font-black tracking-[-0.05em]">{value}</div>
                <div className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-white/44">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 32, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-primary/24 via-[var(--az-violet)]/18 to-[var(--az-rose)]/16 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0d1a]/82 p-4 shadow-[0_50px_160px_-80px_rgba(0,0,0,1)] backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between rounded-[1.3rem] border border-white/10 bg-white/[0.05] px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/52">
                <MousePointer2 className="h-4 w-4 text-primary" />
                Live cockpit
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-primary-foreground">
                Free
              </span>
            </div>

            <div className="grid gap-3">
              {featuredTools.slice(0, 5).map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    animate={{ x: index % 2 === 0 ? [0, 8, 0] : [0, -7, 0] }}
                    transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.35rem] border border-white/10 bg-white/[0.055] p-3"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-black">{tool.name}</span>
                      <span className="line-clamp-1 text-xs text-white/42">{tool.description}</span>
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.07] text-white/42">
                      <Zap className="h-4 w-4" />
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-primary/20 bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-sm font-black text-primary">
                <ShieldCheck className="h-4 w-4" />
                Useful first, beautiful second. Both matter.
              </div>
              <p className="mt-2 text-sm leading-6 text-white/52">
                Every card opens a real tool. No fake demos, no dead ends.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
