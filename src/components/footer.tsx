import Link from "next/link";
import Image from "next/image";
import { Coffee, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t bg-background text-foreground">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="rounded-[2rem] border bg-card p-6 shadow-sm md:p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
            <div>
              <Link href="/" className="flex items-center gap-3 text-2xl font-black tracking-[-0.03em]">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-background">
                  <Image src="/favicon-32x32.png" alt="AZ Tools Logo" width={32} height={32} className="h-7 w-7" />
                </span>
                <span>
                  <span>AZTools</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                A carefully crafted toolbox for PDFs, images, code, text, security, finance, and everyday browser work.
              </p>
            </div>

            <div className="grid gap-3 text-sm md:justify-end md:text-right">
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Links</h3>
              <Link href="/privacy-policy" className="text-muted-foreground transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
              <a
                href="https://www.buymeacoffee.com/kshitijkorz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground md:justify-end"
              >
                <span>Support the Project</span>
                <Coffee className="h-4 w-4" />
              </a>
              <a
                href="mailto:kshitij.koranne@live.com?subject=AZ%20Tools%20-%20Problem%20Report"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Report a Problem
              </a>
            </div>
          </div>

          <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
            <p className="flex flex-wrap items-center justify-center gap-1">
              Made in INDIA with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> by{" "}
              <a href="https://kjrlabs.in" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
                KJR Labs
              </a>
              . © {year}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
