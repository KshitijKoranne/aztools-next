import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layouts/main-layout";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-sm font-semibold text-primary mb-2">404</p>
        <h1 className="text-4xl font-black mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We couldn&apos;t find the page you&apos;re looking for. It may have been
          moved, renamed, or never existed.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/category/text-utilities">Browse tools</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
