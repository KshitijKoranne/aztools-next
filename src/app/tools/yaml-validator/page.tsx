
import { Metadata } from 'next';
import YamlValidator from './client';

export const metadata: Metadata = {
  title: "YAML Validator - AZ Tools",
  description: "Validate and format your YAML code.",
  keywords: ["yaml validator", "yaml formatter", "format yaml", "validate yaml"],
};

const YamlValidatorPage = () => {
  return <YamlValidator />;
};

export default YamlValidatorPage;
