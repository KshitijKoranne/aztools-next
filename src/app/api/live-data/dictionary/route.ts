import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word")?.trim().toLowerCase();

  if (!word) {
    return NextResponse.json({ error: "Word is required." }, { status: 400 });
  }

  if (!/^[a-z][a-z\s'-]{0,60}$/.test(word)) {
    return NextResponse.json({ error: "Enter a valid English word." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
      next: { revalidate: 604800 },
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: "No definition found." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Could not fetch dictionary data." }, { status: 502 });
  }
}
