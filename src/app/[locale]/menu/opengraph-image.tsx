import { ogAlt, ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "The Menu",
    title: "Mezze to the oak-fired grill",
    subtitle: "Order online for delivery or pickup across Dubai.",
  });
}
