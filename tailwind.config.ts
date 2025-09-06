import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-in": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(10px)", opacity: "0" },
        },
        "color-shift": {
          "0%": { color: "rgb(59 130 246)" }, // blue-500
          "14%": { color: "rgb(168 85 247)" }, // purple-500
          "28%": { color: "rgb(236 72 153)" }, // pink-500
          "42%": { color: "rgb(34 197 94)" }, // green-500
          "56%": { color: "rgb(249 115 22)" }, // orange-500
          "70%": { color: "rgb(239 68 68)" }, // red-500
          "84%": { color: "rgb(99 102 241)" }, // indigo-500
          "100%": { color: "rgb(20 184 166)" }, // teal-500
        },
        "zoom-click": {
          "0%": { 
            transform: "scale(1) translateY(0)",
          },
          "50%": { 
            transform: "scale(1.05) translateY(-2px)",
          },
          "100%": { 
            transform: "scale(1.02) translateY(-1px)",
          },
        },
        "zoom-click-mobile": {
          "0%": { 
            transform: "scale(1)",
          },
          "50%": { 
            transform: "scale(1.03)",
          },
          "100%": { 
            transform: "scale(1.01)",
          },
        },
        "icon-pulse": {
          "0%": { 
            transform: "scale(1)",
          },
          "50%": { 
            transform: "scale(1.1)",
          },
          "100%": { 
            transform: "scale(1.05)",
          },
        },
        "zoom-glow": {
          "0%": { 
            transform: "scale(1) translateY(0)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1), 0 0 0 1px transparent, 0 0 0 0 transparent",
          },
          "50%": { 
            transform: "scale(1.05) translateY(-2px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px var(--glow-color-border), 0 0 25px var(--glow-color-shadow)",
          },
          "100%": { 
            transform: "scale(1.02) translateY(-1px)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.15), 0 0 0 1px var(--glow-color-border), 0 0 15px var(--glow-color-outer)",
          },
        },
        "zoom-glow-mobile": {
          "0%": { 
            transform: "scale(1)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1), 0 0 0 1px transparent, 0 0 0 0 transparent",
          },
          "50%": { 
            transform: "scale(1.03)",
            boxShadow: "0 15px 30px rgba(0,0,0,0.15), 0 0 0 1px var(--glow-color-border), 0 0 20px var(--glow-color-shadow)",
          },
          "100%": { 
            transform: "scale(1.01)",
            boxShadow: "0 12px 25px rgba(0,0,0,0.12), 0 0 0 1px var(--glow-color-border), 0 0 12px var(--glow-color-outer)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out",
        "color-shift": "color-shift 16s linear infinite",
        "zoom-click": "zoom-click 0.3s ease-out forwards",
        "zoom-click-mobile": "zoom-click-mobile 0.25s ease-out forwards",
        "icon-pulse": "icon-pulse 0.3s ease-out forwards",
        "glow-pulse": "glow-pulse 0.3s ease-out forwards",
        "zoom-glow": "zoom-glow 0.3s ease-out forwards",
        "zoom-glow-mobile": "zoom-glow-mobile 0.25s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;