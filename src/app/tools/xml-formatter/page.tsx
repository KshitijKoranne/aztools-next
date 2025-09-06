
import { Metadata } from 'next';
import XmlFormatter from './client';

export const metadata: Metadata = {
  title: "XML Formatter - AZ Tools",
  description: "Format, validate, and beautify your XML code.",
  keywords: ["xml formatter", "xml beautifier", "format xml", "xml validator"],
};

const XmlFormatterPage = () => {
  return <XmlFormatter />;
};

export default XmlFormatterPage;
