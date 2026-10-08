import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Dubai · DIFC",
    title: "Fire, spice & saffron",
    subtitle: "Middle Eastern fusion cooked over open flame.",
  });
}
