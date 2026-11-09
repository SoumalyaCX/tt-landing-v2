import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/*
 * Social sharing image (1200×630), generated at build time.
 * ImageResponse can't read CSS variables, so the four colours below mirror
 * --void, --text, --muted and --sky in src/styles/theme.css.
 */
const colors = { void: "#000000", text: "#f4f4f5", muted: "#a1a1aa", sky: "#4cc2f0" };

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-footer.png"), "base64");
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: `radial-gradient(60% 70% at 70% 40%, rgba(76,194,240,0.18), ${colors.void} 70%)`,
        color: colors.text,
      }}
    >
      <img src={`data:image/png;base64,${logo}`} height={64} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 28, color: colors.sky }}>Workforce management software</div>
        <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
          From planning work to measuring outcomes
        </div>
        <div style={{ fontSize: 28, color: colors.muted }}>{siteConfig.description}</div>
      </div>
    </div>,
    size,
  );
}
