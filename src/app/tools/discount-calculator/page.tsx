import { Metadata } from 'next';
import DiscountCalculator from './client';

export const metadata: Metadata = {
  title: "Discount Calculator - AZ Tools",
  description: "Calculate discounts, final prices, and compare multiple discount scenarios with simple, multiple, reverse, and comparison modes.",
  keywords: ["discount calculator", "price calculator", "savings calculator", "discount percentage", "final price", "multiple discounts", "reverse discount"],
};

export default function DiscountCalculatorPage() {
  return <DiscountCalculator />;
}