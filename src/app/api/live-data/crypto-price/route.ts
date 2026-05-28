import { NextResponse } from "next/server";

const supportedAssets = new Set(["BTC", "ETH", "SOL", "DOGE", "ADA", "AVAX", "LINK", "LTC", "BCH", "DOT", "MATIC", "ATOM", "XLM"]);
const supportedFiat = new Set(["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "SGD"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const asset = (searchParams.get("asset") ?? "BTC").trim().toUpperCase();
  const fiat = (searchParams.get("fiat") ?? "USD").trim().toUpperCase();

  if (!supportedAssets.has(asset)) {
    return NextResponse.json({ error: "Unsupported crypto asset." }, { status: 400 });
  }

  if (!supportedFiat.has(fiat)) {
    return NextResponse.json({ error: "Unsupported fiat currency." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${asset}`, {
      next: { revalidate: 60 },
    });
    const data = await response.json();
    const amount = Number(data?.data?.rates?.[fiat]);

    if (!response.ok || !Number.isFinite(amount)) {
      return NextResponse.json({ error: "Price not available for this asset or currency." }, { status: 404 });
    }

    return NextResponse.json({
      asset,
      fiat,
      amount,
      base: data.data.currency,
      currency: fiat,
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Could not fetch crypto price." }, { status: 502 });
  }
}
