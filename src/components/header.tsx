"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu, Coffee } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { tools } from "@/data/tools";
import { MobileNav } from "@/components/mobile-nav";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const matchingTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);
  const searchResults = matchingTools.slice(0, 10);
  const totalResults = matchingTools.length;
  const isSearching = Boolean(searchQuery.trim());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchItemClick = (path: string) => {
    setSearchQuery("");
    router.push(path);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-white/10 bg-black/78 backdrop-blur-xl transition-shadow duration-200 ${
        isScrolled ? "shadow-[0_18px_70px_-54px_rgba(0,0,0,1)]" : ""
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2 text-xl font-black text-white">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-primary-foreground shadow-[0_16px_42px_-20px_var(--az-green)]">
            <Image
              src="/favicon-32x32.png"
              alt="AZ Tools Logo"
              width={32}
              height={32}
              className="h-7 w-7 transition-transform group-hover:scale-110"
              priority
            />
          </span>
          <span>
            <span className="text-primary">AZ</span>
            <span>Tools</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                placeholder="Search tools..."
                className="h-10 w-full rounded-full border border-white/10 bg-white/[0.08] px-9 py-2 text-sm font-semibold text-white shadow-inner placeholder:text-white/42 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-[240px] lg:w-[360px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-primary-foreground"
              >
                GO
              </button>

              {isSearching && searchResults.length > 0 && (
                <div className="az-chrome absolute left-0 right-0 top-full z-50 mt-2 max-h-[430px] overflow-auto rounded-lg p-2 text-popover-foreground">
                  {searchResults.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      className="group w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-white/10"
                      onClick={() => handleSearchItemClick(tool.path)}
                    >
                      <div className="font-bold group-hover:text-primary">{tool.name}</div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{tool.description}</div>
                    </button>
                  ))}
                  {totalResults > 10 && (
                    <button
                      type="button"
                      className="mt-2 w-full rounded-full bg-primary px-4 py-3 text-center text-sm font-black text-primary-foreground transition-colors hover:bg-primary/90"
                      onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                        setSearchQuery("");
                      }}
                    >
                      View all {totalResults} results →
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          <a
            href="https://www.buymeacoffee.com/kshitijkorz"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex"
          >
            <Button variant="outline" size="sm" className="gap-1 rounded-full border-white/10 bg-white/[0.06] font-bold text-white hover:bg-white/12 hover:text-white">
              <Coffee className="h-4 w-4" />
              <span>Support</span>
            </Button>
          </a>

          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
