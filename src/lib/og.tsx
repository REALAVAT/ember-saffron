import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";
export const ogAlt = `${siteConfig.name} — Middle Eastern fusion restaurant in Dubai`;

interface OgInput {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export async function renderOgImage({ eyebrow, title, subtitle }: OgInput) {
  const fraunces = await readFile(join(process.cwd(), "src/assets/fonts/Fraunces-Medium.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b0907",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(232,87,42,0.45), transparent 45%), radial-gradient(circle at 10% 100%, rgba(226,169,63,0.25), transparent 50%)",
          color: "#f4ece0",
          fontFamily: "Fraunces",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="#f4ece0" strokeOpacity="0.35" />
            <path
              d="M20 7c1.8 4.2 6.8 7 6.8 13.2A6.8 6.8 0 0 1 20 27a6.8 6.8 0 0 1-6.8-6.8c0-3 1.6-4.9 3.1-6.5.2 2 1.1 3.3 2.4 3.9C18.2 13.8 18.6 10.4 20 7Z"
              fill="#E8572A"
            />
            <path d="M12 32h16" stroke="#f4ece0" strokeOpacity="0.6" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 30, letterSpacing: 1 }}>{siteConfig.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#e2a93f",
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </span>
          <span style={{ fontSize: 84, lineHeight: 1.02, maxWidth: 960 }}>{title}</span>
          <span style={{ fontSize: 30, marginTop: 28, color: "#b9ab98", maxWidth: 900 }}>{subtitle}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#b9ab98" }}>
          <span>DIFC · Dubai</span>
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [{ name: "Fraunces", data: fraunces, style: "normal", weight: 500 }],
    },
  );
}
