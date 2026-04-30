import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = {
  title: "Password Strength Checker",
  description: "Analyze password strength and get security recommendations.",
  alternates: { canonical: "https://aztools.in/tools/password-strength-checker" },
};

export default function PasswordStrengthCheckerPage() {
  return <Client />;
}
