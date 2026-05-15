import type { Metadata } from "next";
import UserAgentParserClient from "./client";

export const metadata: Metadata = {
  title: "User Agent Parser",
  description: "Parse browser, operating system, device type, and engine from user agent strings.",
  alternates: { canonical: "https://aztools.in/tools/user-agent-parser" },
};

export default function UserAgentParserPage() {
  return <UserAgentParserClient />;
}
