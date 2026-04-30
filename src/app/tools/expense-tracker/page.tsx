import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track expenses, category totals, and simple budgets locally in your browser.",
  alternates: { canonical: "https://aztools.in/tools/expense-tracker" },
};

export default function ExpenseTrackerPage() {
  return <Client />;
}
