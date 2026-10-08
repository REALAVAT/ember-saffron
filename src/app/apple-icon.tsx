import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0907",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 10c2.9 6.7 10.9 11.2 10.9 21.1A10.9 10.9 0 0 1 32 42a10.9 10.9 0 0 1-10.9-10.9c0-4.8 2.6-7.8 5-10.4.3 3.2 1.8 5.3 3.8 6.2C29.1 21.9 29.8 16.5 32 10Z"
            fill="#E8572A"
          />
          <path d="M20 51h24" stroke="#f4ece0" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
