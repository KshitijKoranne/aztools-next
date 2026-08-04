import { FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type DirectoryApp = {
  id: string;
  name: string;
  category: string;
  description: string;
  href: string;
  status: "Live";
  icon: LucideIcon;
};

export const directoryApps: DirectoryApp[] = [
  {
    id: "pdfworld",
    name: "PDF World",
    category: "PDF tools",
    description: "Work with PDF files in your browser.",
    href: "https://pdfworld.aztools.in/",
    status: "Live",
    icon: FileText,
  },
];
