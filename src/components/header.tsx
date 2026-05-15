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
  { label: "Tools", href: "/search" },
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
      className={`sticky top-0 z-50 w-full border-b bg-background/82 text-foreground backdrop-blur-2xl transition-shadow duration-200 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2 text-xl font-black tracking-[-0.03em] text-foreground">
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl border bg-card shadow-sm">
            <Image
              src="/favicon-32x32.png"
              alt="AZ Tools Logo"
              width={32}
              height={32}
              className="h-7 w-7 transition-transform group-hover:scale-110"
              priority
            />
          </span>
          <span>AZTools</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border bg-card p-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
                className="h-10 w-full rounded-full border bg-card px-9 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 md:w-[230px] xl:w-[340px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-black text-background transition-opacity hover:opacity-90"
              >
                GO
              </button>

              {isSearching && searchResults.length > 0 && (
                <div className="az-chrome absolute left-0 right-0 top-full z-50 mt-2 max-h-[430px] overflow-auto rounded-2xl p-2 text-popover-foreground">
                  {searchResults.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      className="group w-full rounded-xl px-3 py-2 text-left transition-colors hover:bg-accent"
                      onClick={() => handleSearchItemClick(tool.path)}
                    >
                      <div className="font-bold text-popover-foreground">{tool.name}</div>
                      <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{tool.description}</div>
                    </button>
                  ))}
                  {totalResults > 10 && (
                    <button
                      type="button"
                      className="mt-2 w-full rounded-full bg-foreground px-4 py-3 text-center text-sm font-black text-background transition-opacity hover:opacity-90"
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
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
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
