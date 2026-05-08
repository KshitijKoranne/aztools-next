import { NextResponse } from "next/server";

interface GeocodingResult {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

interface WeatherDay {
  date: string;
  max: number;
  min: number;
  rain: number;
  wind: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "Enter a city, area, or postal code." }, { status: 400 });
  }

  try {
    const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
    geoUrl.searchParams.set("name", query);
    geoUrl.searchParams.set("count", "1");
    geoUrl.searchParams.set("language", "en");
    geoUrl.searchParams.set("format", "json");

    const geoResponse = await fetch(geoUrl, { next: { revalidate: 86400 } });
    if (!geoResponse.ok) throw new Error("Location lookup failed.");

    const geoData = await geoResponse.json() as { results?: GeocodingResult[] };
    const place = geoData.results?.[0];
    if (!place) {
      return NextResponse.json({ error: "No matching location found." }, { status: 404 });
    }

    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", String(place.latitude));
    weatherUrl.searchParams.set("longitude", String(place.longitude));
    weatherUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m");
    weatherUrl.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max");
    weatherUrl.searchParams.set("timezone", "auto");
    weatherUrl.searchParams.set("forecast_days", "7");

    const weatherResponse = await fetch(weatherUrl, { next: { revalidate: 900 } });
    if (!weatherResponse.ok) throw new Error("Forecast lookup failed.");

    const weatherData = await weatherResponse.json();
    const daily: WeatherDay[] = weatherData.daily.time.map((date: string, index: number) => ({
      date,
      max: weatherData.daily.temperature_2m_max[index],
      min: weatherData.daily.temperature_2m_min[index],
      rain: weatherData.daily.precipitation_sum[index],
      wind: weatherData.daily.wind_speed_10m_max[index],
    }));

    return NextResponse.json({
      place: {
        name: place.name,
        region: place.admin1,
        country: place.country,
        latitude: place.latitude,
        longitude: place.longitude,
        timezone: weatherData.timezone ?? place.timezone,
      },
      current: weatherData.current,
      units: {
        temperature: weatherData.current_units.temperature_2m,
        wind: weatherData.current_units.wind_speed_10m,
        rain: weatherData.current_units.precipitation,
      },
      daily,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not fetch weather right now." },
      { status: 502 }
    );
  }
}
