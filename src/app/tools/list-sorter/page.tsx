import type { Metadata } from "next";
import ListSorterClient from "./client";

export const metadata: Metadata = {
  title: "List Sorter",
  description: "Sort, reverse, deduplicate, and clean newline-separated lists in your browser.",
  alternates: { canonical: "https://aztools.in/tools/list-sorter" },
};

export default function ListSorterPage() {
  return <ListSorterClient />;
}
