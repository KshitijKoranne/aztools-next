import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Enter a country name or ISO code." }, { status: 400 });
  }

  const fields = [
    "name",
    "capital",
    "region",
    "subregion",
    "population",
    "area",
    "currencies",
    "languages",
    "flags",
    "maps",
    "timezones",
    "cca2",
    "cca3",
    "borders",
    "latlng",
  ].join(",");

  try {
    const isCode = /^[a-z]{2,3}$/i.test(query);
    const endpoint = isCode
      ? `https://restcountries.com/v3.1/alpha/${encodeURIComponent(query)}`
      : `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}`;
    const url = new URL(endpoint);
    url.searchParams.set("fields", fields);

    const response = await fetch(url, { next: { revalidate: 604800 } });
    if (response.status === 404) {
      return NextResponse.json({ error: "No country found for that search." }, { status: 404 });
    }
    if (!response.ok) throw new Error("Country lookup failed.");

    const data = await response.json();
    const countries = Array.isArray(data) ? data.slice(0, 8) : [data];

    return NextResponse.json({ countries });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not fetch country data right now." },
      { status: 502 }
    );
  }
}
