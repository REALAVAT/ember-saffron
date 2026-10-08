import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Private Events",
    title: "Gatherings around the fire",
    subtitle: "Private dining, corporate events and bespoke catering.",
  });
}
