import { Metadata } from 'next';
import Base64Converter from './client';

export const metadata: Metadata = {
  title: "Base64 Converter - AZ Tools",
  description: "Encode and decode Base64 strings, and convert files to and from Base64.",
  keywords: ["base64", "converter", "encoder", "decoder", "file to base64", "base64 to file"],
};

const Base64ConverterPage = () => {
  return <Base64Converter />;
};

export default Base64ConverterPage;