import { Metadata } from 'next';
import PercentageCalculator from './client';

export const metadata: Metadata = {
  title: "Percentage Calculator - AZ Tools",
  description: "Calculate percentages, percentage changes, and percentage of values with multiple calculation methods.",
  keywords: ["percentage calculator", "percent", "percentage change", "discount", "increase", "decrease", "calculator"],
};

export default function PercentageCalculatorPage() {
  return <PercentageCalculator />;
}