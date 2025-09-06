
'use client'

import { useState } from 'react';
import { ToolLayout } from "@/components/layouts/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRightLeft, Copy } from 'lucide-react';
import { toast } from 'sonner';

type UnitType = "length" | "weight" | "volume" | "temperature" | "area" | "time" | "speed" | "data";

interface UnitOption {
  value: string;
  label: string;
  convertTo: (value: number, targetUnit: string) => number;
}

export default function UnitConverter() {
  const [unitType, setUnitType] = useState<UnitType>("length");
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("ft");
  const [result, setResult] = useState<string>("");

  // Unit conversion data
  const unitOptions: Record<UnitType, UnitOption[]> = {
    length: [
      { 
        value: "mm", 
        label: "Millimeters (mm)", 
        convertTo: (value, target) => {
          const inMeters = value / 1000;
          switch(target) {
            case "mm": return value;
            case "cm": return value / 10;
            case "m": return value / 1000;
            case "km": return value / 1000000;
            case "in": return inMeters * 39.3701;
            case "ft": return inMeters * 3.28084;
            case "yd": return inMeters * 1.09361;
            case "mi": return inMeters / 1609.34;
            default: return value;
          }
        }
      },
      { 
        value: "cm", 
        label: "Centimeters (cm)", 
        convertTo: (value, target) => {
          const inMeters = value / 100;
          switch(target) {
            case "mm": return value * 10;
            case "cm": return value;
            case "m": return value / 100;
            case "km": return value / 100000;
            case "in": return inMeters * 39.3701;
            case "ft": return inMeters * 3.28084;
            case "yd": return inMeters * 1.09361;
            case "mi": return inMeters / 1609.34;
            default: return value;
          }
        }
      },
      { 
        value: "m", 
        label: "Meters (m)", 
        convertTo: (value, target) => {
          switch(target) {
            case "mm": return value * 1000;
            case "cm": return value * 100;
            case "m": return value;
            case "km": return value / 1000;
            case "in": return value * 39.3701;
            case "ft": return value * 3.28084;
            case "yd": return value * 1.09361;
            case "mi": return value / 1609.34;
            default: return value;
          }
        }
      },
      { 
        value: "km", 
        label: "Kilometers (km)", 
        convertTo: (value, target) => {
          const inMeters = value * 1000;
          switch(target) {
            case "mm": return inMeters * 1000;
            case "cm": return inMeters * 100;
            case "m": return inMeters;
            case "km": return value;
            case "in": return inMeters * 39.3701;
            case "ft": return inMeters * 3.28084;
            case "yd": return inMeters * 1.09361;
            case "mi": return value / 1.60934;
            default: return value;
          }
        }
      },
      { 
        value: "in", 
        label: "Inches (in)", 
        convertTo: (value, target) => {
          const inMeters = value * 0.0254;
          switch(target) {
            case "mm": return inMeters * 1000;
            case "cm": return inMeters * 100;
            case "m": return inMeters;
            case "km": return inMeters / 1000;
            case "in": return value;
            case "ft": return value / 12;
            case "yd": return value / 36;
            case "mi": return value / 63360;
            default: return value;
          }
        }
      },
      { 
        value: "ft", 
        label: "Feet (ft)", 
        convertTo: (value, target) => {
          const inMeters = value * 0.3048;
          switch(target) {
            case "mm": return inMeters * 1000;
            case "cm": return inMeters * 100;
            case "m": return inMeters;
            case "km": return inMeters / 1000;
            case "in": return value * 12;
            case "ft": return value;
            case "yd": return value / 3;
            case "mi": return value / 5280;
            default: return value;
          }
        }
      },
      { 
        value: "yd", 
        label: "Yards (yd)", 
        convertTo: (value, target) => {
          const inMeters = value * 0.9144;
          switch(target) {
            case "mm": return inMeters * 1000;
            case "cm": return inMeters * 100;
            case "m": return inMeters;
            case "km": return inMeters / 1000;
            case "in": return value * 36;
            case "ft": return value * 3;
            case "yd": return value;
            case "mi": return value / 1760;
            default: return value;
          }
        }
      },
      { 
        value: "mi", 
        label: "Miles (mi)", 
        convertTo: (value, target) => {
          const inMeters = value * 1609.34;
          switch(target) {
            case "mm": return inMeters * 1000;
            case "cm": return inMeters * 100;
            case "m": return inMeters;
            case "km": return inMeters / 1000;
            case "in": return value * 63360;
            case "ft": return value * 5280;
            case "yd": return value * 1760;
            case "mi": return value;
            default: return value;
          }
        }
      }
    ],
    weight: [
      { 
        value: "mg", 
        label: "Milligrams (mg)", 
        convertTo: (value, target) => {
          const inGrams = value / 1000;
          switch(target) {
            case "mg": return value;
            case "g": return inGrams;
            case "kg": return inGrams / 1000;
            case "oz": return inGrams * 0.035274;
            case "lb": return inGrams * 0.00220462;
            case "ton": return inGrams / 1000000;
            default: return value;
          }
        }
      },
      { 
        value: "g", 
        label: "Grams (g)", 
        convertTo: (value, target) => {
          switch(target) {
            case "mg": return value * 1000;
            case "g": return value;
            case "kg": return value / 1000;
            case "oz": return value * 0.035274;
            case "lb": return value * 0.00220462;
            case "ton": return value / 1000000;
            default: return value;
          }
        }
      },
      { 
        value: "kg", 
        label: "Kilograms (kg)", 
        convertTo: (value, target) => {
          const inGrams = value * 1000;
          switch(target) {
            case "mg": return inGrams * 1000;
            case "g": return inGrams;
            case "kg": return value;
            case "oz": return inGrams * 0.035274;
            case "lb": return inGrams * 0.00220462;
            case "ton": return value / 1000;
            default: return value;
          }
        }
      },
      { 
        value: "oz", 
        label: "Ounces (oz)", 
        convertTo: (value, target) => {
          const inGrams = value * 28.3495;
          switch(target) {
            case "mg": return inGrams * 1000;
            case "g": return inGrams;
            case "kg": return inGrams / 1000;
            case "oz": return value;
            case "lb": return value / 16;
            case "ton": return inGrams / 1000000;
            default: return value;
          }
        }
      },
      { 
        value: "lb", 
        label: "Pounds (lb)", 
        convertTo: (value, target) => {
          const inGrams = value * 453.592;
          switch(target) {
            case "mg": return inGrams * 1000;
            case "g": return inGrams;
            case "kg": return inGrams / 1000;
            case "oz": return value * 16;
            case "lb": return value;
            case "ton": return inGrams / 1000000;
            default: return value;
          }
        }
      },
      { 
        value: "ton", 
        label: "Metric Tons (t)", 
        convertTo: (value, target) => {
          const inGrams = value * 1000000;
          switch(target) {
            case "mg": return inGrams * 1000;
            case "g": return inGrams;
            case "kg": return value * 1000;
            case "oz": return inGrams * 0.035274;
            case "lb": return inGrams * 0.00220462;
            case "ton": return value;
            default: return value;
          }
        }
      }
    ],
    volume: [
      { 
        value: "ml", 
        label: "Milliliters (ml)", 
        convertTo: (value, target) => {
          switch(target) {
            case "ml": return value;
            case "l": return value / 1000;
            case "cup": return value / 236.588;
            case "pt": return value / 473.176;
            case "qt": return value / 946.353;
            case "gal": return value / 3785.41;
            case "floz": return value / 29.5735;
            default: return value;
          }
        }
      },
      { 
        value: "l", 
        label: "Liters (l)", 
        convertTo: (value, target) => {
          const inMl = value * 1000;
          switch(target) {
            case "ml": return inMl;
            case "l": return value;
            case "cup": return inMl / 236.588;
            case "pt": return inMl / 473.176;
            case "qt": return inMl / 946.353;
            case "gal": return inMl / 3785.41;
            case "floz": return inMl / 29.5735;
            default: return value;
          }
        }
      },
      { 
        value: "cup", 
        label: "Cups", 
        convertTo: (value, target) => {
          const inMl = value * 236.588;
          switch(target) {
            case "ml": return inMl;
            case "l": return inMl / 1000;
            case "cup": return value;
            case "pt": return value / 2;
            case "qt": return value / 4;
            case "gal": return value / 16;
            case "floz": return value * 8;
            default: return value;
          }
        }
      },
      { 
        value: "pt", 
        label: "Pints (pt)", 
        convertTo: (value, target) => {
          const inMl = value * 473.176;
          switch(target) {
            case "ml": return inMl;
            case "l": return inMl / 1000;
            case "cup": return value * 2;
            case "pt": return value;
            case "qt": return value / 2;
            case "gal": return value / 8;
            case "floz": return value * 16;
            default: return value;
          }
        }
      },
      { 
        value: "qt", 
        label: "Quarts (qt)", 
        convertTo: (value, target) => {
          const inMl = value * 946.353;
          switch(target) {
            case "ml": return inMl;
            case "l": return inMl / 1000;
            case "cup": return value * 4;
            case "pt": return value * 2;
            case "qt": return value;
            case "gal": return value / 4;
            case "floz": return value * 32;
            default: return value;
          }
        }
      },
      { 
        value: "gal", 
        label: "Gallons (gal)", 
        convertTo: (value, target) => {
          const inMl = value * 3785.41;
          switch(target) {
            case "ml": return inMl;
            case "l": return inMl / 1000;
            case "cup": return value * 16;
            case "pt": return value * 8;
            case "qt": return value * 4;
            case "gal": return value;
            case "floz": return value * 128;
            default: return value;
          }
        }
      },
      { 
        value: "floz", 
        label: "Fluid Ounces (fl oz)", 
        convertTo: (value, target) => {
          const inMl = value * 29.5735;
          switch(target) {
            case "ml": return inMl;
            case "l": return inMl / 1000;
            case "cup": return value / 8;
            case "pt": return value / 16;
            case "qt": return value / 32;
            case "gal": return value / 128;
            case "floz": return value;
            default: return value;
          }
        }
      }
    ],
    temperature: [
      { 
        value: "c", 
        label: "Celsius (°C)", 
        convertTo: (value, target) => {
          switch(target) {
            case "c": return value;
            case "f": return (value * 9/5) + 32;
            case "k": return value + 273.15;
            default: return value;
          }
        }
      },
      { 
        value: "f", 
        label: "Fahrenheit (°F)", 
        convertTo: (value, target) => {
          switch(target) {
            case "c": return (value - 32) * 5/9;
            case "f": return value;
            case "k": return (value - 32) * 5/9 + 273.15;
            default: return value;
          }
        }
      },
      { 
        value: "k", 
        label: "Kelvin (K)", 
        convertTo: (value, target) => {
          switch(target) {
            case "c": return value - 273.15;
            case "f": return (value - 273.15) * 9/5 + 32;
            case "k": return value;
            default: return value;
          }
        }
      }
    ],
    area: [
      { 
        value: "sqm", 
        label: "Square Meters (m²)", 
        convertTo: (value, target) => {
          switch(target) {
            case "sqm": return value;
            case "sqkm": return value / 1000000;
            case "sqft": return value * 10.7639;
            case "sqyd": return value * 1.19599;
            case "acre": return value / 4046.86;
            case "ha": return value / 10000;
            default: return value;
          }
        }
      },
      { 
        value: "sqkm", 
        label: "Square Kilometers (km²)", 
        convertTo: (value, target) => {
          const inSqm = value * 1000000;
          switch(target) {
            case "sqm": return inSqm;
            case "sqkm": return value;
            case "sqft": return inSqm * 10.7639;
            case "sqyd": return inSqm * 1.19599;
            case "acre": return inSqm / 4046.86;
            case "ha": return value * 100;
            default: return value;
          }
        }
      },
      { 
        value: "sqft", 
        label: "Square Feet (ft²)", 
        convertTo: (value, target) => {
          const inSqm = value * 0.092903;
          switch(target) {
            case "sqm": return inSqm;
            case "sqkm": return inSqm / 1000000;
            case "sqft": return value;
            case "sqyd": return value / 9;
            case "acre": return value / 43560;
            case "ha": return inSqm / 10000;
            default: return value;
          }
        }
      },
      { 
        value: "sqyd", 
        label: "Square Yards (yd²)", 
        convertTo: (value, target) => {
          const inSqm = value * 0.836127;
          switch(target) {
            case "sqm": return inSqm;
            case "sqkm": return inSqm / 1000000;
            case "sqft": return value * 9;
            case "sqyd": return value;
            case "acre": return value / 4840;
            case "ha": return inSqm / 10000;
            default: return value;
          }
        }
      },
      { 
        value: "acre", 
        label: "Acres", 
        convertTo: (value, target) => {
          const inSqm = value * 4046.86;
          switch(target) {
            case "sqm": return inSqm;
            case "sqkm": return inSqm / 1000000;
            case "sqft": return value * 43560;
            case "sqyd": return value * 4840;
            case "acre": return value;
            case "ha": return value / 2.47105;
            default: return value;
          }
        }
      },
      { 
        value: "ha", 
        label: "Hectares (ha)", 
        convertTo: (value, target) => {
          const inSqm = value * 10000;
          switch(target) {
            case "sqm": return inSqm;
            case "sqkm": return value / 100;
            case "sqft": return inSqm * 10.7639;
            case "sqyd": return inSqm * 1.19599;
            case "acre": return value * 2.47105;
            case "ha": return value;
            default: return value;
          }
        }
      }
    ],
    time: [
      { 
        value: "ms", 
        label: "Milliseconds (ms)", 
        convertTo: (value, target) => {
          switch(target) {
            case "ms": return value;
            case "s": return value / 1000;
            case "min": return value / 60000;
            case "h": return value / 3600000;
            case "day": return value / 86400000;
            case "week": return value / 604800000;
            case "month": return value / 2629800000;
            case "year": return value / 31557600000;
            default: return value;
          }
        }
      },
      { 
        value: "s", 
        label: "Seconds (s)", 
        convertTo: (value, target) => {
          const inMs = value * 1000;
          switch(target) {
            case "ms": return inMs;
            case "s": return value;
            case "min": return value / 60;
            case "h": return value / 3600;
            case "day": return value / 86400;
            case "week": return value / 604800;
            case "month": return value / 2629800;
            case "year": return value / 31557600;
            default: return value;
          }
        }
      },
      { 
        value: "min", 
        label: "Minutes (min)", 
        convertTo: (value, target) => {
          const inMs = value * 60000;
          switch(target) {
            case "ms": return inMs;
            case "s": return value * 60;
            case "min": return value;
            case "h": return value / 60;
            case "day": return value / 1440;
            case "week": return value / 10080;
            case "month": return value / 43830;
            case "year": return value / 525960;
            default: return value;
          }
        }
      },
      { 
        value: "h", 
        label: "Hours (h)", 
        convertTo: (value, target) => {
          const inMs = value * 3600000;
          switch(target) {
            case "ms": return inMs;
            case "s": return value * 3600;
            case "min": return value * 60;
            case "h": return value;
            case "day": return value / 24;
            case "week": return value / 168;
            case "month": return value / 730.5;
            case "year": return value / 8766;
            default: return value;
          }
        }
      },
      { 
        value: "day", 
        label: "Days", 
        convertTo: (value, target) => {
          const inMs = value * 86400000;
          switch(target) {
            case "ms": return inMs;
            case "s": return value * 86400;
            case "min": return value * 1440;
            case "h": return value * 24;
            case "day": return value;
            case "week": return value / 7;
            case "month": return value / 30.44;
            case "year": return value / 365.25;
            default: return value;
          }
        }
      },
      { 
        value: "week", 
        label: "Weeks", 
        convertTo: (value, target) => {
          const inMs = value * 604800000;
          switch(target) {
            case "ms": return inMs;
            case "s": return value * 604800;
            case "min": return value * 10080;
            case "h": return value * 168;
            case "day": return value * 7;
            case "week": return value;
            case "month": return value / 4.345;
            case "year": return value / 52.18;
            default: return value;
          }
        }
      },
      { 
        value: "month", 
        label: "Months (avg)", 
        convertTo: (value, target) => {
          const inMs = value * 2629800000;
          switch(target) {
            case "ms": return inMs;
            case "s": return value * 2629800;
            case "min": return value * 43830;
            case "h": return value * 730.5;
            case "day": return value * 30.44;
            case "week": return value * 4.345;
            case "month": return value;
            case "year": return value / 12;
            default: return value;
          }
        }
      },
      { 
        value: "year", 
        label: "Years", 
        convertTo: (value, target) => {
          const inMs = value * 31557600000;
          switch(target) {
            case "ms": return inMs;
            case "s": return value * 31557600;
            case "min": return value * 525960;
            case "h": return value * 8766;
            case "day": return value * 365.25;
            case "week": return value * 52.18;
            case "month": return value * 12;
            case "year": return value;
            default: return value;
          }
        }
      }
    ],
    speed: [
      { 
        value: "mps", 
        label: "Meters per second (m/s)", 
        convertTo: (value, target) => {
          switch(target) {
            case "mps": return value;
            case "kph": return value * 3.6;
            case "mph": return value * 2.23694;
            case "fps": return value * 3.28084;
            case "knot": return value * 1.94384;
            default: return value;
          }
        }
      },
      { 
        value: "kph", 
        label: "Kilometers per hour (km/h)", 
        convertTo: (value, target) => {
          const inMps = value / 3.6;
          switch(target) {
            case "mps": return inMps;
            case "kph": return value;
            case "mph": return value * 0.621371;
            case "fps": return inMps * 3.28084;
            case "knot": return value * 0.539957;
            default: return value;
          }
        }
      },
      { 
        value: "mph", 
        label: "Miles per hour (mph)", 
        convertTo: (value, target) => {
          const inMps = value / 2.23694;
          switch(target) {
            case "mps": return inMps;
            case "kph": return value * 1.60934;
            case "mph": return value;
            case "fps": return value * 1.46667;
            case "knot": return value * 0.868976;
            default: return value;
          }
        }
      },
      { 
        value: "fps", 
        label: "Feet per second (ft/s)", 
        convertTo: (value, target) => {
          const inMps = value * 0.3048;
          switch(target) {
            case "mps": return inMps;
            case "kph": return inMps * 3.6;
            case "mph": return inMps * 2.23694;
            case "fps": return value;
            case "knot": return inMps * 1.94384;
            default: return value;
          }
        }
      },
      { 
        value: "knot", 
        label: "Knots", 
        convertTo: (value, target) => {
          const inMps = value * 0.514444;
          switch(target) {
            case "mps": return inMps;
            case "kph": return inMps * 3.6;
            case "mph": return inMps * 2.23694;
            case "fps": return inMps * 3.28084;
            case "knot": return value;
            default: return value;
          }
        }
      }
    ],
    data: [
      { 
        value: "b", 
        label: "Bytes (B)", 
        convertTo: (value, target) => {
          switch(target) {
            case "b": return value;
            case "kb": return value / 1024;
            case "mb": return value / (1024 * 1024);
            case "gb": return value / (1024 * 1024 * 1024);
            case "tb": return value / (1024 * 1024 * 1024 * 1024);
            case "pb": return value / (1024 * 1024 * 1024 * 1024 * 1024);
            default: return value;
          }
        }
      },
      { 
        value: "kb", 
        label: "Kilobytes (KB)", 
        convertTo: (value, target) => {
          const inBytes = value * 1024;
          switch(target) {
            case "b": return inBytes;
            case "kb": return value;
            case "mb": return value / 1024;
            case "gb": return value / (1024 * 1024);
            case "tb": return value / (1024 * 1024 * 1024);
            case "pb": return value / (1024 * 1024 * 1024 * 1024);
            default: return value;
          }
        }
      },
      { 
        value: "mb", 
        label: "Megabytes (MB)", 
        convertTo: (value, target) => {
          const inBytes = value * 1024 * 1024;
          switch(target) {
            case "b": return inBytes;
            case "kb": return value * 1024;
            case "mb": return value;
            case "gb": return value / 1024;
            case "tb": return value / (1024 * 1024);
            case "pb": return value / (1024 * 1024 * 1024);
            default: return value;
          }
        }
      },
      { 
        value: "gb", 
        label: "Gigabytes (GB)", 
        convertTo: (value, target) => {
          const inBytes = value * 1024 * 1024 * 1024;
          switch(target) {
            case "b": return inBytes;
            case "kb": return value * 1024 * 1024;
            case "mb": return value * 1024;
            case "gb": return value;
            case "tb": return value / 1024;
            case "pb": return value / (1024 * 1024);
            default: return value;
          }
        }
      },
      { 
        value: "tb", 
        label: "Terabytes (TB)", 
        convertTo: (value, target) => {
          const inBytes = value * 1024 * 1024 * 1024 * 1024;
          switch(target) {
            case "b": return inBytes;
            case "kb": return value * 1024 * 1024 * 1024;
            case "mb": return value * 1024 * 1024;
            case "gb": return value * 1024;
            case "tb": return value;
            case "pb": return value / 1024;
            default: return value;
          }
        }
      },
      { 
        value: "pb", 
        label: "Petabytes (PB)", 
        convertTo: (value, target) => {
          const inBytes = value * 1024 * 1024 * 1024 * 1024 * 1024;
          switch(target) {
            case "b": return inBytes;
            case "kb": return value * 1024 * 1024 * 1024 * 1024;
            case "mb": return value * 1024 * 1024 * 1024;
            case "gb": return value * 1024 * 1024;
            case "tb": return value * 1024;
            case "pb": return value;
            default: return value;
          }
        }
      }
    ]
  };

  const handleUnitTypeChange = (newType: UnitType) => {
    setUnitType(newType);
    if (unitOptions[newType].length > 0) {
      setFromUnit(unitOptions[newType][0].value);
      if (unitOptions[newType].length > 1) {
        setToUnit(unitOptions[newType][1].value);
      } else {
        setToUnit(unitOptions[newType][0].value);
      }
    }
    setResult("");
  };

  const handleConvert = () => {
    if (!inputValue || !fromUnit || !toUnit) {
      toast.error("Please enter a value and select both units.");
      return;
    }

    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      toast.error("Please enter a valid number.");
      return;
    }

    try {
      const fromOption = unitOptions[unitType].find(opt => opt.value === fromUnit);
      if (!fromOption) return;

      const converted = fromOption.convertTo(numValue, toUnit);
      let formattedResult: string;
      
      if (Math.abs(converted) < 0.000001 || Math.abs(converted) >= 1000000) {
        formattedResult = converted.toExponential(6);
      } else if (Number.isInteger(converted)) {
        formattedResult = converted.toString();
      } else {
        const decimalPlaces = Math.min(6, (converted.toString().split('.')[1] || '').length);
        formattedResult = converted.toFixed(decimalPlaces).replace(/\.?0+$/, '');
      }
      
      setResult(formattedResult);
      
      const unitLabel = getUnitLabel(fromUnit);
      const targetUnitLabel = getUnitLabel(toUnit);
      
      toast.success(`${numValue} ${unitLabel} = ${formattedResult} ${targetUnitLabel}`);
    } catch (error) {
      toast.error("Conversion failed. Please check your input.");
    }
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult("");
  };

  const copyResult = () => {
    if (!result) return;
    
    const unitLabel = getUnitLabel(fromUnit);
    const targetUnitLabel = getUnitLabel(toUnit);
    const textToCopy = `${inputValue} ${unitLabel} = ${result} ${targetUnitLabel}`;
    
    navigator.clipboard.writeText(textToCopy);
    toast.success("Conversion result copied to clipboard!");
  };

  const getUnitLabel = (unitValue: string): string => {
    const option = unitOptions[unitType].find(opt => opt.value === unitValue);
    return option ? option.label.split(' ')[0] : unitValue;
  };

  return (
    <ToolLayout toolId="unit-converter" categoryId="calculators">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              Unit Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={unitType} onValueChange={(value) => handleUnitTypeChange(value as UnitType)} className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                <TabsTrigger value="length">Length</TabsTrigger>
                <TabsTrigger value="weight">Weight</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="temperature">Temp</TabsTrigger>
                <TabsTrigger value="area">Area</TabsTrigger>
                <TabsTrigger value="time">Time</TabsTrigger>
                <TabsTrigger value="speed">Speed</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-value">Value</Label>
                <Input
                  id="from-value"
                  type="text"
                  placeholder="Enter value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <div className="relative">
                  <Input
                    id="result"
                    readOnly
                    placeholder="Conversion result"
                    value={result}
                  />
                  {result && (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                      onClick={copyResult}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="from-unit">From</Label>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSwapUnits}
                    className="rounded-full h-6 w-6"
                  >
                    <ArrowRightLeft className="h-3 w-3" />
                  </Button>
                </div>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions[unitType].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="to-unit">To</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions[unitType].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleConvert} className="w-full">
              Convert
            </Button>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
