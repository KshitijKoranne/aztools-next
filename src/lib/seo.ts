export const siteUrl = "https://aztools.in";
export const siteName = "AZ Tools";
export const publisherName = "KJR Labs";

export function jsonLd(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
