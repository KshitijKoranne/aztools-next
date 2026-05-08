import { Search } from "lucide-react";

export function HomeHero() {
  return (
    <section className="mx-auto flex min-h-[614px] max-w-[1200px] flex-col items-center justify-center gap-12 px-6 py-20 text-center text-[#e5e2e1]">
      <div className="max-w-3xl space-y-2">
        <h1 className="text-5xl font-bold leading-[1.1] tracking-[-0.04em] text-[#e5e2e1] md:text-6xl">
          We have a tool for that!
        </h1>
        <p className="text-lg leading-[1.6] text-[#c1c6d7]">
          Free, simple, and useful tools for everyday tasks.
        </p>
      </div>

      <form action="/search" className="relative w-full max-w-2xl">
        <div className="relative z-10 flex items-center rounded-full border border-[#8b90a0]/10 bg-[#201f1f]/40 p-1 shadow-lg backdrop-blur-2xl transition-all duration-300 focus-within:border-[#adc6ff] focus-within:ring-2 focus-within:ring-[#adc6ff]">
          <Search className="ml-4 h-5 w-5 shrink-0 text-[#8b90a0]" />
          <input
            name="q"
            type="search"
            placeholder="Search for a tool..."
            className="w-full border-none bg-transparent px-4 py-3 text-base text-[#e5e2e1] outline-none placeholder:text-[#414755] focus:ring-0"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-full bg-[#adc6ff] px-6 py-3 text-base font-medium text-[#002e69] transition-opacity hover:opacity-90"
          >
            Explore Tools
          </button>
        </div>
        <div className="absolute inset-0 -z-10 translate-y-4 rounded-full bg-[#adc6ff]/10 blur-3xl" />
      </form>
    </section>
  );
}
