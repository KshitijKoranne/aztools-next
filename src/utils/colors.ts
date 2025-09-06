/**
 * Random Color Generation Utility for Dynamic Glow Effects
 * Generates vibrant colors that work well for glow effects in both light and dark themes
 */

export interface RandomColor {
  rgb: string;
  rgba: (opacity: number) => string;
  hsl: string;
  name: string;
}

// Predefined vibrant colors that work well for glow effects
const VIBRANT_COLORS = [
  { name: 'Electric Blue', rgb: '59, 130, 246', hsl: '213, 94%, 68%' },
  { name: 'Purple Magic', rgb: '168, 85, 247', hsl: '271, 91%, 65%' },
  { name: 'Pink Fusion', rgb: '236, 72, 153', hsl: '328, 85%, 70%' },
  { name: 'Emerald Glow', rgb: '34, 197, 94', hsl: '142, 71%, 45%' },
  { name: 'Orange Burst', rgb: '249, 115, 22', hsl: '25, 95%, 53%' },
  { name: 'Red Flame', rgb: '239, 68, 68', hsl: '0, 84%, 60%' },
  { name: 'Indigo Dream', rgb: '99, 102, 241', hsl: '239, 84%, 67%' },
  { name: 'Teal Wave', rgb: '20, 184, 166', hsl: '174, 83%, 40%' },
  { name: 'Violet Storm', rgb: '139, 69, 193', hsl: '276, 48%, 51%' },
  { name: 'Cyan Lightning', rgb: '34, 211, 238', hsl: '186, 86%, 53%' },
  { name: 'Lime Spark', rgb: '132, 204, 22', hsl: '84, 81%, 44%' },
  { name: 'Rose Gold', rgb: '244, 114, 182', hsl: '329, 86%, 70%' },
  { name: 'Sky Blue', rgb: '56, 189, 248', hsl: '199, 93%, 60%' },
  { name: 'Amber Fire', rgb: '245, 158, 11', hsl: '38, 92%, 50%' },
  { name: 'Fuchsia Pop', rgb: '217, 70, 239', hsl: '292, 84%, 61%' },
];

/**
 * Generates a random vibrant color suitable for glow effects
 */
export function generateRandomGlowColor(): RandomColor {
  const color = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
  
  return {
    rgb: color.rgb,
    rgba: (opacity: number) => `rgba(${color.rgb}, ${opacity})`,
    hsl: color.hsl,
    name: color.name,
  };
}

/**
 * Generates multiple random colors ensuring no duplicates in the current set
 */
export function generateRandomGlowColors(count: number): RandomColor[] {
  const shuffled = [...VIBRANT_COLORS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, VIBRANT_COLORS.length)).map(color => ({
    rgb: color.rgb,
    rgba: (opacity: number) => `rgba(${color.rgb}, ${opacity})`,
    hsl: color.hsl,
    name: color.name,
  }));
}

/**
 * Gets a random color that's different from the previous one
 */
export function generateDifferentGlowColor(previousColor?: RandomColor): RandomColor {
  if (!previousColor) {
    return generateRandomGlowColor();
  }
  
  let newColor: RandomColor;
  let attempts = 0;
  
  do {
    newColor = generateRandomGlowColor();
    attempts++;
  } while (newColor.rgb === previousColor.rgb && attempts < 10);
  
  return newColor;
}

/**
 * Creates CSS custom property values for a glow color
 */
export function createGlowColorVariables(color: RandomColor) {
  return {
    '--glow-color-rgb': color.rgb,
    '--glow-color-border': color.rgba(0.3),
    '--glow-color-shadow': color.rgba(0.4),
    '--glow-color-outer': color.rgba(0.3),
  };
}