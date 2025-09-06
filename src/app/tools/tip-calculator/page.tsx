import { Metadata } from 'next';
import TipCalculator from './client';

export const metadata: Metadata = {
  title: "Tip Calculator - AZ Tools",
  description: "Calculate tips and split bills among multiple people. Choose from preset tip percentages or enter a custom amount.",
  keywords: ["tip calculator", "bill calculator", "gratuity calculator", "split bill", "tip percentage", "restaurant tip", "service tip"],
};

export default function TipCalculatorPage() {
  return <TipCalculator />;
}