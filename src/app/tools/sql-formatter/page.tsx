import type { Metadata } from "next";
import SqlFormatterClient from "./client";
export const metadata: Metadata = {
  title: "SQL Formatter",
  description: "Free online SQL formatter. Format and beautify SQL queries with keyword uppercase, configurable indentation, and dialect support for MySQL, PostgreSQL, SQLite, and more.",
  keywords: ["sql formatter","format sql","sql beautifier","sql pretty print","sql query formatter"],
  alternates: { canonical: "https://aztools.in/tools/sql-formatter" },
  openGraph: { title: "SQL Formatter - AZ Tools", description: "Format SQL queries with uppercase keywords, configurable indent, and dialect support.", url: "https://aztools.in/tools/sql-formatter", type: "website" },
};
export default function Page() { return <SqlFormatterClient />; }
