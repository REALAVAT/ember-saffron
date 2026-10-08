import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Reservations",
    title: "Reserve your table",
    subtitle: "Lunch and dinner, seven days a week in DIFC.",
  });
}
