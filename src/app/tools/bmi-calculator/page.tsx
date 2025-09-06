import { Metadata } from 'next';
import BmiCalculator from './client';

export const metadata: Metadata = {
  title: "BMI Calculator - AZ Tools",
  description: "Calculate your Body Mass Index (BMI) with both metric and imperial units. Get BMI categories, healthy weight ranges, and health insights.",
  keywords: ["BMI calculator", "body mass index", "weight calculator", "health calculator", "BMI categories", "healthy weight range", "metric", "imperial"],
};

export default function BmiCalculatorPage() {
  return <BmiCalculator />;
}