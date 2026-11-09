/**
 * The site's public URL. Set NEXT_PUBLIC_SITE_URL in production (see
 * .env.example); on Vercel the production domain is used automatically.
 */
function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "NEXT_PUBLIC_SITE_URL is not set: canonical and social URLs will point to localhost.",
    );
  }
  return "http://localhost:3000";
}

/** Site config — name, URLs and SEO defaults. all of these are placeholder for now do change these later */
export const siteConfig = {
  name: "TeamTrace",
  title: "TeamTrace: Stop measuring motion. Start measuring focus.",
  description:
    "TeamTrace shows you how much of each person's day was focused, how much was fragmented, and when focus broke.",
  url: siteUrl(),
  locale: "en_US",
} as const;
