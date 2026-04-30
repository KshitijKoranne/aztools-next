"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Calculator, Copy } from "lucide-react";
import { toast } from "sonner";
import { ToolLayout } from "@/components/layouts/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UnitType = "length" | "weight" | "volume" | "temperature" | "area" | "time" | "speed" | "data";

type LinearUnit = {
  value: string;
  label: string;
  symbol: string;
  factor: number;
};

type TemperatureUnit = {
  value: "c" | "f" | "k";
  label: string;
  symbol: string;
};

type Unit = LinearUnit | TemperatureUnit;

type UnitGroup = {
  label: string;
  shortLabel: string;
  units: Unit[];
};

const unitGroups = {
  length: {
    label: "Length",
    shortLabel: "Len",
    units: [
      { value: "mm", label: "Millimeters (mm)", symbol: "mm", factor: 0.001 },
      { value: "cm", label: "Centimeters (cm)", symbol: "cm", factor: 0.01 },
      { value: "m", label: "Meters (m)", symbol: "m", factor: 1 },
      { value: "km", label: "Kilometers (km)", symbol: "km", factor: 1000 },
      { value: "in", label: "Inches (in)", symbol: "in", factor: 0.0254 },
      { value: "ft", label: "Feet (ft)", symbol: "ft", factor: 0.3048 },
      { value: "yd", label: "Yards (yd)", symbol: "yd", factor: 0.9144 },
      { value: "mi", label: "Miles (mi)", symbol: "mi", factor: 1609.34 },
    ],
  },
  weight: {
    label: "Weight",
    shortLabel: "Wt",
    units: [
      { value: "mg", label: "Milligrams (mg)", symbol: "mg", factor: 0.001 },
      { value: "g", label: "Grams (g)", symbol: "g", factor: 1 },
      { value: "kg", label: "Kilograms (kg)", symbol: "kg", factor: 1000 },
      { value: "oz", label: "Ounces (oz)", symbol: "oz", factor: 28.3495 },
      { value: "lb", label: "Pounds (lb)", symbol: "lb", factor: 453.592 },
      { value: "ton", label: "Metric Tons (t)", symbol: "t", factor: 1000000 },
    ],
  },
  volume: {
    label: "Volume",
    shortLabel: "Vol",
    units: [
      { value: "ml", label: "Milliliters (ml)", symbol: "ml", factor: 1 },
      { value: "l", label: "Liters (l)", symbol: "l", factor: 1000 },
      { value: "cup", label: "Cups", symbol: "cup", factor: 236.588 },
      { value: "pt", label: "Pints (pt)", symbol: "pt", factor: 473.176 },
      { value: "qt", label: "Quarts (qt)", symbol: "qt", factor: 946.353 },
      { value: "gal", label: "Gallons (gal)", symbol: "gal", factor: 3785.41 },
      { value: "floz", label: "Fluid Ounces (fl oz)", symbol: "fl oz", factor: 29.5735 },
    ],
  },
  temperature: {
    label: "Temperature",
    shortLabel: "Temp",
    units: [
      { value: "c", label: "Celsius (°C)", symbol: "°C" },
      { value: "f", label: "Fahrenheit (°F)", symbol: "°F" },
      { value: "k", label: "Kelvin (K)", symbol: "K" },
    ],
  },
  area: {
    label: "Area",
    shortLabel: "Area",
    units: [
      { value: "sqm", label: "Square Meters (m²)", symbol: "m²", factor: 1 },
      { value: "sqkm", label: "Square Kilometers (km²)", symbol: "km²", factor: 1000000 },
      { value: "sqft", label: "Square Feet (ft²)", symbol: "ft²", factor: 0.092903 },
      { value: "sqyd", label: "Square Yards (yd²)", symbol: "yd²", factor: 0.836127 },
      { value: "acre", label: "Acres", symbol: "acre", factor: 4046.86 },
      { value: "ha", label: "Hectares (ha)", symbol: "ha", factor: 10000 },
    ],
  },
  time: {
    label: "Time",
    shortLabel: "Time",
    units: [
      { value: "ms", label: "Milliseconds (ms)", symbol: "ms", factor: 1 },
      { value: "s", label: "Seconds (s)", symbol: "s", factor: 1000 },
      { value: "min", label: "Minutes (min)", symbol: "min", factor: 60000 },
      { value: "h", label: "Hours (h)", symbol: "h", factor: 3600000 },
      { value: "day", label: "Days", symbol: "day", factor: 86400000 },
      { value: "week", label: "Weeks", symbol: "week", factor: 604800000 },
      { value: "month", label: "Months (avg)", symbol: "month", factor: 2629800000 },
      { value: "year", label: "Years", symbol: "year", factor: 31557600000 },
    ],
  },
  speed: {
    label: "Speed",
    shortLabel: "Spd",
    units: [
      { value: "mps", label: "Meters per second (m/s)", symbol: "m/s", factor: 1 },
      { value: "kph", label: "Kilometers per hour (km/h)", symbol: "km/h", factor: 1 / 3.6 },
      { value: "mph", label: "Miles per hour (mph)", symbol: "mph", factor: 1 / 2.23694 },
      { value: "fps", label: "Feet per second (ft/s)", symbol: "ft/s", factor: 0.3048 },
      { value: "knot", label: "Knots", symbol: "kn", factor: 0.514444 },
    ],
  },
  data: {
    label: "Data",
    shortLabel: "Data",
    units: [
      { value: "b", label: "Bytes (B)", symbol: "B", factor: 1 },
      { value: "kb", label: "Kilobytes (KB)", symbol: "KB", factor: 1024 },
      { value: "mb", label: "Megabytes (MB)", symbol: "MB", factor: 1024 ** 2 },
      { value: "gb", label: "Gigabytes (GB)", symbol: "GB", factor: 1024 ** 3 },
      { value: "tb", label: "Terabytes (TB)", symbol: "TB", factor: 1024 ** 4 },
      { value: "pb", label: "Petabytes (PB)", symbol: "PB", factor: 1024 ** 5 },
    ],
  },
} satisfies Record<UnitType, UnitGroup>;

const unitTypes = Object.keys(unitGroups) as UnitType[];

function isLinearUnit(unit: Unit): unit is LinearUnit {
  return "factor" in unit;
}

function convertTemperature(value: number, from: TemperatureUnit["value"], to: TemperatureUnit["value"]) {
  const celsius = from === "c" ? value : from === "f" ? ((value - 32) * 5) / 9 : value - 273.15;
  if (to === "c") return celsius;
  if (to === "f") return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "";
  if (value !== 0 && (Math.abs(value) < 0.000001 || Math.abs(value) >= 1000000)) {
    return value.toExponential(6);
  }
  return Number.parseFloat(value.toFixed(8)).toString();
}

export default function Client() {
  const [unitType, setUnitType] = useState<UnitType>("length");
  const [inputValue, setInputValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");

  const group = unitGroups[unitType];
  const fromOption = group.units.find((unit) => unit.value === fromUnit) ?? group.units[0];
  const toOption = group.units.find((unit) => unit.value === toUnit) ?? group.units[1] ?? group.units[0];

  const result = useMemo(() => {
    const numericValue = Number.parseFloat(inputValue);
    if (!inputValue.trim() || Number.isNaN(numericValue) || !fromOption || !toOption) return "";

    if (unitType === "temperature") {
      return formatNumber(
        convertTemperature(
          numericValue,
          fromOption.value as TemperatureUnit["value"],
          toOption.value as TemperatureUnit["value"],
        ),
      );
    }

    if (!isLinearUnit(fromOption) || !isLinearUnit(toOption)) return "";
    return formatNumber((numericValue * fromOption.factor) / toOption.factor);
  }, [fromOption, inputValue, toOption, unitType]);

  const handleTypeChange = (value: string) => {
    const nextType = value as UnitType;
    const nextUnits = unitGroups[nextType].units;
    setUnitType(nextType);
    setFromUnit(nextUnits[0]?.value ?? "");
    setToUnit(nextUnits[1]?.value ?? nextUnits[0]?.value ?? "");
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyResult = async () => {
    if (!result || !fromOption || !toOption) return;
    await navigator.clipboard.writeText(`${inputValue} ${fromOption.symbol} = ${result} ${toOption.symbol}`);
    toast.success("Conversion copied");
  };

  return (
    <ToolLayout toolId="unit-converter">
      <div className="mx-auto max-w-4xl space-y-6">
        <Tabs value={unitType} onValueChange={handleTypeChange}>
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            {unitTypes.map((type) => (
              <TabsTrigger key={type} value={type} className="h-8 grow sm:grow-0 sm:px-3">
                <span className="hidden sm:inline">{unitGroups[type].label}</span>
                <span className="sm:hidden">{unitGroups[type].shortLabel}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                {group.label} Converter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
                <div className="space-y-2">
                  <Label htmlFor="from-value">Value</Label>
                  <Input
                    id="from-value"
                    inputMode="decimal"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Enter value"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={swapUnits}
                  aria-label="Swap units"
                  className="mx-auto md:mb-0"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="result">Result</Label>
                  <div className="relative">
                    <Input id="result" readOnly value={result} placeholder="Conversion result" className="pr-10" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                      onClick={copyResult}
                      disabled={!result}
                      aria-label="Copy result"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {group.units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>To</Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {group.units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Input</p>
                <p className="text-2xl font-bold break-words">
                  {inputValue || "0"} {fromOption?.symbol}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Output</p>
                <p className="text-2xl font-bold break-words">
                  {result || "0"} {toOption?.symbol}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Time month and year conversions use average durations, matching standard calculator behavior.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
