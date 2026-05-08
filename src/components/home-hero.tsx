"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { categories, tools } from "@/data/tools";

export function HomeHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();

  const matchingTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return tools.filter((tool) => {
      const category = categories.find((item) => item.id === tool.category);
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        category?.name.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

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

    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/search");
    }

    setSearchQuery("");
  };

  return (
    <section className="mx-auto flex min-h-[614px] max-w-[1200px] flex-col items-center justify-center gap-10 px-6 py-20 text-center text-[#e5e2e1]">
      <div className="max-w-3xl space-y-2">
        <h1 className="text-5xl font-bold leading-[1.1] tracking-[-0.04em] text-[#e5e2e1] md:text-6xl">
          We have a tool for that!
        </h1>
        <p className="text-lg leading-[1.6] text-[#c1c6d7]">
          Free, simple, and useful tools for everyday tasks.
        </p>
      </div>

      <form ref={searchRef} onSubmit={submitSearch} className="relative z-20 w-full max-w-2xl">
        <div className="relative z-10 flex items-center rounded-full border border-white/10 bg-white/[0.055] p-1 shadow-sm backdrop-blur-xl transition-all duration-300 focus-within:border-white/28 focus-within:ring-2 focus-within:ring-white/10">
          <Search className="ml-4 h-5 w-5 shrink-0 text-white/45" />
          <input
            name="q"
            type="search"
            placeholder="Search for a tool..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full border-none bg-transparent px-4 py-3 text-base text-[#e5e2e1] outline-none placeholder:text-white/28 focus:ring-0"
            autoComplete="off"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-full bg-white px-6 py-3 text-base font-semibold text-black transition-opacity hover:opacity-90"
          >
            Explore Tools
          </button>
        </div>

        {isSearching && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-30 mt-3 overflow-hidden rounded-3xl border border-white/10 bg-[#201f1f]/95 p-2 text-left shadow-2xl backdrop-blur-2xl">
            {searchResults.map((tool) => {
              const Icon = tool.icon;
              const category = categories.find((item) => item.id === tool.category);

              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => openTool(tool.path)}
                  className="group grid w-full grid-cols-[auto_1fr] items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-white/[0.07]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] text-white transition-colors group-hover:bg-white group-hover:text-black">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#e5e2e1]">
                      {tool.name}
                    </span>
                    <span className="block truncate text-xs text-[#c1c6d7]/75">
                      {category?.name ?? "Tool"} · {tool.description}
                    </span>
                  </span>
                </button>
              );
            })}

            {totalResults > searchResults.length && (
              <button
                type="button"
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery("");
                }}
                className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black transition-opacity hover:opacity-90"
              >
                View all {totalResults} results
              </button>
            )}
          </div>
        )}

        {isSearching && searchResults.length === 0 && (
          <div className="absolute left-0 right-0 top-full z-30 mt-3 rounded-3xl border border-white/10 bg-[#201f1f]/95 p-5 text-left text-sm text-[#c1c6d7] shadow-2xl backdrop-blur-2xl">
            No matching tools found. Press Enter to search all tools.
          </div>
        )}
      </form>
    </section>
  );
}
