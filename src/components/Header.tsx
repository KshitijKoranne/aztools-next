"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { tools } from "@/data/tools";
import Image from "next/image";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof tools>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = tools.filter(tool => 
        tool.name.toLowerCase().includes(lowerCaseQuery) || 
        tool.description.toLowerCase().includes(lowerCaseQuery) ||
        tool.category.toLowerCase().includes(lowerCaseQuery)
      );
      setTotalResults(results.length);
      setSearchResults(results.slice(0, 10));
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setTotalResults(0);
      setIsSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery("");
        setIsSearching(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchItemClick = (path: string) => {
    setSearchQuery("");
    setIsSearching(false);
    router.push(path);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsSearching(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm transition-shadow duration-200 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Image 
              src="/favicon-32x32.png" 
              alt="AZ Tools Logo" 
              width={32}
              height={32}
              className="h-8 w-8" 
            />
            <span>
              <span className="text-primary">AZ</span>
              <span>Tools</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="search"
                placeholder="Search tools..."
                className="md:w-[200px] lg:w-[300px] flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
              
              {isSearching && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-xl z-50 max-h-[400px] overflow-auto">
                  {searchResults.map((tool) => (
                    <div 
                      key={tool.id}
                      className="group px-4 py-2 text-foreground hover:bg-accent cursor-pointer transition-colors duration-150 border-b border-border last:border-b-0"
                      onClick={() => handleSearchItemClick(tool.path)}
                    >
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-muted-foreground">{tool.description}</div>
                    </div>
                  ))}
                  {totalResults > 10 && (
                    <div 
                      className="group px-4 py-3 text-center border-t border-border bg-muted hover:bg-accent cursor-pointer transition-colors duration-150"
                      onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                        setSearchQuery("");
                        setIsSearching(false);
                      }}
                    >
                      <div className="text-sm text-muted-foreground">
                        View all {totalResults} results →
                      </div>
                    </div>
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
            <Button variant="outline" size="sm" className="gap-1">
              <Coffee className="h-4 w-4" />
              <span>Support</span>
            </Button>
          </a>

          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left">
              <div className="flex flex-col gap-4 p-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                  <Image 
                    src="/favicon-32x32.png" 
                    alt="AZ Tools Logo" 
                    width={32}
                    height={32}
                    className="h-8 w-8" 
                  />
                  <span>
                    <span className="text-primary">AZ</span>
                    <span>Tools</span>
                  </span>
                </Link>
                <div className="flex flex-col gap-2">
                  <input
                    type="search"
                    placeholder="Search tools..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};