
export type SupportedCurrency = 
  | "INR" 
  | "USD" 
  | "EUR" 
  | "GBP" 
  | "JPY" 
  | "AUD" 
  | "CAD" 
  | "CNY" 
  | "SGD";

export interface CurrencyOption {
  code: SupportedCurrency;
  symbol: string;
  name: string;
}

export const currencyOptions: CurrencyOption[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" }
];

export const formatCurrency = (
  amount: number, 
  currency: SupportedCurrency = "INR",
  options: Intl.NumberFormatOptions = {}
): string => {
  const currencyObj = currencyOptions.find(c => c.code === currency);
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(amount);
};

export const getCurrencySymbol = (currencyCode: SupportedCurrency = "INR"): string => {
  const currency = currencyOptions.find(c => c.code === currencyCode);
  return currency?.symbol || "₹";
};
