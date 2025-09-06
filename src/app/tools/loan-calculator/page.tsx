import { Metadata } from 'next';
import LoanCalculator from './client';

export const metadata: Metadata = {
  title: "Loan Calculator - AZ Tools",
  description: "Calculate loan payments, amortization schedules, and total interest. Support for different currencies and payment frequencies with interactive charts.",
  keywords: ["loan calculator", "mortgage calculator", "payment calculator", "amortization", "interest calculator", "EMI calculator", "loan payment"],
};

export default function LoanCalculatorPage() {
  return <LoanCalculator />;
}