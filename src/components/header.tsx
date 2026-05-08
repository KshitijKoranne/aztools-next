"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { tools } from "@/data/tools";
import { MobileNav } from "@/components/mobile-nav";

const navLinks = [
  { label: "Tools", href: "/#featured-tools" },
  { label: "Categories", href: "/#categories" },
];

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
      className={`sticky top-0 z-50 w-full border-b border-white/10 bg-black/82 text-white backdrop-blur-xl transition-shadow duration-200 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2 text-lg font-bold tracking-[-0.03em] text-white">
          <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
            <Image
              src="/favicon-32x32.png"
              alt="AZ Tools Logo"
              width={32}
              height={32}
              className="h-7 w-7 transition-transform group-hover:scale-110"
              priority
            />
          </span>
          <span>AZ Tools</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-white/58 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                placeholder="Search tools..."
                className="h-10 w-full rounded-full border border-white/10 bg-white/[0.045] px-9 py-2 text-sm font-medium text-white placeholder:text-white/36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 md:w-[230px] xl:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/44" />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/42 transition-colors hover:text-white"
              >
                <Search className="h-4 w-4" />
              </button>

              {isSearching && searchResults.length > 0 && (
                <div className="az-chrome absolute left-0 right-0 top-full z-50 mt-2 max-h-[430px] overflow-auto rounded-2xl p-2 text-popover-foreground">
                  {searchResults.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      className="group w-full rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/10"
                      onClick={() => handleSearchItemClick(tool.path)}
                    >
                      <div className="font-bold text-white">{tool.name}</div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-white/48">{tool.description}</div>
                    </button>
                  ))}
                  {totalResults > 10 && (
                    <button
                      type="button"
                      className="mt-2 w-full rounded-full bg-white px-4 py-3 text-center text-sm font-black text-black transition-opacity hover:opacity-85"
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

          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white lg:hidden" aria-label="Open menu">
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
