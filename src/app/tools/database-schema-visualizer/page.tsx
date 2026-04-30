import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Database Schema Visualizer",
  description: "Parse CREATE TABLE SQL and visualize tables, columns, keys, and relationships.",
  alternates: { canonical: "https://aztools.in/tools/database-schema-visualizer" },
};

export default function DatabaseSchemaVisualizerPage() {
  return <Client />;
}
