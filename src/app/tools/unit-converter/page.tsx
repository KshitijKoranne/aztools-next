
import { Metadata } from 'next';
import UnitConverter from './client';

export const metadata: Metadata = {
  title: "Unit Converter - AZ Tools",
  description: "Convert between various units of length, weight, volume, temperature, and more.",
  keywords: ["unit converter", "conversion", "length", "weight", "volume", "temperature", "area", "time", "speed", "data", "currency"],
};

const UnitConverterPage = () => {
  return <UnitConverter />;
};

export default UnitConverterPage;
