"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { generateDifferentGlowColor, createGlowColorVariables, type RandomColor } from "@/utils/colors";

import { Tool } from "@/data/tools";

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const { id, name, description, icon: Icon, path } = tool;
  const router = useRouter();
  const [isClicking, setIsClicking] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const previousColorRef = useRef<RandomColor | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Prevent multiple clicks
    if (isClicking || isNavigating) return;
    
    setIsClicking(true);
    
    // Generate a random glow color different from the previous one
    if (!prefersReducedMotion) {
      const newColor = generateDifferentGlowColor(previousColorRef.current);
      previousColorRef.current = newColor;
      
      // Set CSS custom properties for the glow effect
      if (cardRef.current) {
        const colorVars = createGlowColorVariables(newColor);
        Object.entries(colorVars).forEach(([property, value]) => {
          cardRef.current!.style.setProperty(property, value);
        });
        
        // Optional: Log the color for debugging
        console.log(`🌈 Random glow color: ${newColor.name} (${newColor.rgb})`);
      }
    }
    
    // Navigate immediately for reduced motion users, with delay for others
    const navigationDelay = prefersReducedMotion ? 50 : 300;
    
    setTimeout(() => {
      setIsNavigating(true);
      router.push(path);
    }, navigationDelay);
  }, [path, router, isClicking, isNavigating, prefersReducedMotion]);

  // Combine all classes dynamically
  const cardClasses = `
    h-full border bg-card
    ${prefersReducedMotion 
      ? 'category-card-reduced-motion transition-colors duration-200' 
      : 'transition-all duration-200'
    }
    ${isClicking && !prefersReducedMotion
      ? 'animate-zoom-glow-mobile md:animate-zoom-glow border-primary/30' 
      : isClicking && prefersReducedMotion
        ? 'bg-primary/5 border-primary/40'
        : prefersReducedMotion
          ? 'border-border hover:border-primary/30'
          : 'hover:shadow-lg hover:-translate-y-1 border-border hover:border-primary/20'
    }
    ${isNavigating ? 'opacity-90' : ''}
  `.trim();

  const iconClasses = `
    h-5 w-5 transition-all duration-200
    ${isClicking && !prefersReducedMotion ? 'animate-icon-pulse' : ''}
  `.trim();

  const iconContainerClasses = `
    p-2 rounded-lg bg-primary/10 text-primary transition-colors flex-shrink-0
    ${isClicking 
      ? 'bg-primary text-primary-foreground shadow-lg' 
      : 'group-hover:bg-primary group-hover:text-primary-foreground'
    }
  `.trim();

  return (
    <div 
      ref={cardRef}
      onClick={handleClick}
      className="group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
      aria-label={`Open ${name} tool`}
    >
      <Card className={cardClasses}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={iconContainerClasses}>
              <Icon className={iconClasses} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`text-lg font-semibold mb-2 transition-colors line-clamp-1 ${
                isClicking 
                  ? 'text-primary' 
                  : 'text-foreground group-hover:text-primary'
              }`}>
                {name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};