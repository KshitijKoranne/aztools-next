
import { Metadata } from 'next';
import SqlFormatter from './client';

export const metadata: Metadata = {
  title: "SQL Formatter - AZ Tools",
  description: "Format and beautify your SQL queries with various options.",
  keywords: ["sql formatter", "sql beautifier", "format sql", "sql query formatter"],
};

const SqlFormatterPage = () => {
  return <SqlFormatter />;
};

export default SqlFormatterPage;
