import { Metadata } from 'next';
import CompoundInterestCalculator from './client';

export const metadata: Metadata = {
  title: "Compound Interest Calculator - AZ Tools",
  description: "Calculate compound interest with different compounding frequencies, annual contributions, and contribution timings. Visualize growth over time with interactive charts.",
  keywords: ["compound interest calculator", "compound growth", "investment calculator", "interest calculator", "compounding frequency", "annual contributions"],
};

export default function CompoundInterestCalculatorPage() {
  return <CompoundInterestCalculator />;
}