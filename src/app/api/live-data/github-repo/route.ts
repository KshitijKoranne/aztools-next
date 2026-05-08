import { NextResponse } from "next/server";

function parseRepo(value: string) {
  const cleaned = value
    .trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/\/$/, "");
  const [owner, repo] = cleaned.split("/");
  if (!owner || !repo || cleaned.split("/").length !== 2) return null;
  return { owner, repo };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("repo") ?? "";
  const parsed = parseRepo(input);

  if (!parsed) {
    return NextResponse.json({ error: "Enter a GitHub repo like vercel/next.js." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 600 },
    });

    if (response.status === 404) {
      return NextResponse.json({ error: "Repository not found or not public." }, { status: 404 });
    }

    if (response.status === 403) {
      return NextResponse.json({ error: "GitHub rate limit reached. Try again later." }, { status: 429 });
    }

    if (!response.ok) throw new Error("GitHub lookup failed.");

    const repo = await response.json();
    return NextResponse.json({
      name: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.subscribers_count,
      openIssues: repo.open_issues_count,
      license: repo.license?.spdx_id ?? "No license",
      defaultBranch: repo.default_branch,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      topics: repo.topics ?? [],
      archived: repo.archived,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not fetch repository data right now." },
      { status: 502 }
    );
  }
}
