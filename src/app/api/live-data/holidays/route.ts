import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.trim().toUpperCase();
  const year = Number(searchParams.get("year"));
  const currentYear = new Date().getFullYear();

  if (!country || !/^[A-Z]{2}$/.test(country)) {
    return NextResponse.json({ error: "Enter a two-letter country code like IN, US, or GB." }, { status: 400 });
  }

  if (!Number.isInteger(year) || year < 1970 || year > currentYear + 5) {
    return NextResponse.json({ error: `Enter a year from 1970 to ${currentYear + 5}.` }, { status: 400 });
  }

  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`, {
      next: { revalidate: 86400 },
    });

    if (response.status === 404) {
      return NextResponse.json({ error: "No holiday data found for that country/year." }, { status: 404 });
    }

    if (!response.ok) throw new Error("Holiday lookup failed.");

    const text = await response.text();
    if (!text.trim()) {
      return NextResponse.json({ error: "No holiday data returned for that country/year." }, { status: 404 });
    }

    return NextResponse.json({ country, year, holidays: JSON.parse(text) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not fetch holidays right now." },
      { status: 502 }
    );
  }
}
