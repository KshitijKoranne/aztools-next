import { NextResponse } from "next/server";

interface NpmPackage {
  name: string;
  description?: string;
  license?: string;
  homepage?: string;
  repository?: string | { url?: string };
  "dist-tags"?: { latest?: string };
  time?: Record<string, string>;
  versions?: Record<string, unknown>;
  maintainers?: { name: string }[];
}

function repositoryUrl(repository: NpmPackage["repository"]) {
  if (!repository) return null;
  const value = typeof repository === "string" ? repository : repository.url;
  return value?.replace(/^git\+/, "").replace(/^git:/, "https:").replace(/\.git$/, "") ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name) {
    return NextResponse.json({ error: "Package name is required." }, { status: 400 });
  }

  try {
    const encodedName = encodeURIComponent(name);
    const metadataResponse = await fetch(`https://registry.npmjs.org/${encodedName}`, {
      next: { revalidate: 3600 },
    });

    if (!metadataResponse.ok) {
      return NextResponse.json({ error: "Package not found on npm." }, { status: metadataResponse.status });
    }

    const data = (await metadataResponse.json()) as NpmPackage;
    const latest = data["dist-tags"]?.latest ?? null;
    const downloadsResponse = await fetch(`https://api.npmjs.org/downloads/point/last-week/${encodedName}`, {
      next: { revalidate: 3600 },
    });
    const downloads = downloadsResponse.ok ? await downloadsResponse.json() : null;

    return NextResponse.json({
      name: data.name,
      description: data.description ?? null,
      latest,
      license: data.license ?? null,
      homepage: data.homepage ?? null,
      repository: repositoryUrl(data.repository),
      versions: data.versions ? Object.keys(data.versions).length : 0,
      maintainers: data.maintainers?.map((item) => item.name).slice(0, 8) ?? [],
      createdAt: data.time?.created ?? null,
      modifiedAt: data.time?.modified ?? null,
      lastWeekDownloads: downloads?.downloads ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Could not fetch npm package data." }, { status: 502 });
  }
}
