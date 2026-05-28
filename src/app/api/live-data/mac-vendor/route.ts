import { NextResponse } from "next/server";

function normalizeMac(value: string) {
  return value.trim().replace(/[^a-fA-F0-9]/g, "").toUpperCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("mac") ?? "";
  const normalized = normalizeMac(input);

  if (normalized.length < 6 || normalized.length > 12 || normalized.length % 2 !== 0) {
    return NextResponse.json({ error: "Enter a valid MAC address or OUI." }, { status: 400 });
  }

  const display = normalized.match(/.{1,2}/g)?.join(":") ?? normalized;

  try {
    const response = await fetch(`https://api.macvendors.com/${encodeURIComponent(display)}`, {
      next: { revalidate: 604800 },
    });
    const text = await response.text();

    if (!response.ok || !text.trim()) {
      return NextResponse.json({ error: "Vendor not found." }, { status: 404 });
    }

    return NextResponse.json({
      input,
      normalized: display,
      oui: normalized.slice(0, 6).match(/.{1,2}/g)?.join(":") ?? normalized.slice(0, 6),
      vendor: text.trim(),
    });
  } catch {
    return NextResponse.json({ error: "Could not fetch MAC vendor data." }, { status: 502 });
  }
}
