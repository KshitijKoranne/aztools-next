import Link from "next/link";
import Image from "next/image";
import { Coffee, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-white/10 bg-black text-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-black">
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
            <p className="mt-2 max-w-md text-sm text-white/56">
              Fast browser tools for PDFs, images, code, text, security, finance, and everyday work.
            </p>
          </div>

          <div className="md:text-right">
            <h3 className="mb-3 font-mono text-xs font-bold uppercase text-primary">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-primary transition-colors inline-flex items-center gap-2 md:justify-end"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://www.buymeacoffee.com/kshitijkorz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-2 md:justify-end"
                >
                  <span>Support the Project</span>
                  <Coffee className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:kshitij.koranne@live.com?subject=AZ%20Tools%20-%20Problem%20Report"
                  className="hover:text-primary transition-colors inline-flex items-center gap-2 md:justify-end"
                >
                  Report a Problem
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-white/56">
          <p className="flex items-center justify-center gap-1">
            Made in INDIA with{" "}
            <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by{" "}
            <a
              href="https://kjrlabs.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              KJR Labs
            </a>
            .
            © {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
