import Link from "next/link";
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container flex flex-col items-center justify-center gap-4 py-10 md:py-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm leading-loose text-muted-foreground">
            Made with{" "}
            <Heart className="inline-block h-4 w-4 text-red-500" fill="currentColor" />
            {" "}by{" "}
            <span className="font-semibold text-foreground">KJR Labs</span>
            {" "}in India 🇮🇳
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/privacy-policy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <span>© 2025 AZ Tools</span>
          </div>
        </div>
      </div>
    </footer>
  );
};