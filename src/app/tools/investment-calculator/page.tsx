import { Metadata } from 'next';
import InvestmentCalculator from './client';

export const metadata: Metadata = {
  title: "Investment Calculator - AZ Tools",
  description: "Calculate compound interest and investment growth over time. Support for different currencies, monthly contributions, and investment strategies with interactive charts.",
  keywords: ["investment calculator", "compound interest", "portfolio calculator", "retirement calculator", "savings calculator", "SIP calculator", "investment growth"],
};

export default function InvestmentCalculatorPage() {
  return <InvestmentCalculator />;
}