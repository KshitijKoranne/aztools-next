"use client";

import { TypeAnimation } from "react-type-animation";
import { categories } from "@/data/tools";

export function HomeHero() {
  const sequence: (string | number)[] = categories.flatMap((c) => [c.name, 2000]);

  return (
    <section className="bg-gradient-to-b from-primary/20 via-primary/10 to-background pt-16 pb-20">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
          All the{" "}
          <span className="inline-block min-w-[300px] text-primary">
            <TypeAnimation
              sequence={sequence}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              cursor={false}
            />
          </span>
          <br />
          <span className="inline-block mt-2">you need in one place</span>
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 font-medium">
          Transform your workflow with professional-grade online tools. From PDF
          processing to image editing, text formatting to data conversion —
          everything you need, beautifully crafted and lightning fast.
        </p>
      </div>
    </section>
  );
}
