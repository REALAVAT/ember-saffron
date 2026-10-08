"use client";

import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { siteConfig } from "@/config/site";

/** Click-to-load map keeps third-party scripts and cookies off the initial page load. */
export function MapEmbed() {
  const t = useTranslations("Visit");
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={t("mapTitle")}
        src={siteConfig.address.embedUrl}
        className="absolute inset-0 size-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.6)_brightness(0.9)]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    );
  }

  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 600 400" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="600" height="400" fill="#131010" />
        <g stroke="#2a2420" strokeWidth="14" fill="none" strokeLinecap="round">
          <path d="M-20 300 C 120 260, 220 320, 360 250 S 560 180, 640 200" />
          <path d="M80 -20 L 200 420" />
          <path d="M420 -20 C 400 120, 470 260, 440 420" />
        </g>
        <g stroke="#1f1a17" strokeWidth="6" fill="none">
          <path d="M-20 120 L 640 160" />
          <path d="M-20 200 L 640 90" />
          <path d="M300 -20 L 280 420" />
          <path d="M520 -20 L 560 420" />
          <path d="M0 360 L 640 330" />
        </g>
        <g fill="#1b1715">
          <rect x="220" y="170" width="46" height="34" rx="4" />
          <rect x="320" y="120" width="60" height="40" rx="4" />
          <rect x="330" y="200" width="38" height="44" rx="4" />
          <rect x="150" y="60" width="50" height="40" rx="4" />
          <rect x="460" y="60" width="44" height="60" rx="4" />
        </g>
        <circle cx="300" cy="200" r="70" fill="url(#glow)" />
        <defs>
          <radialGradient id="glow">
            <stop offset="0" stopColor="#e8572a" stopOpacity="0.45" />
            <stop offset="1" stopColor="#e8572a" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
        <MapPin className="size-10 fill-ember text-ink drop-shadow-[0_8px_20px_rgb(232_87_42/0.6)]" aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-ink/80 px-5 py-2.5 text-sm font-medium text-cream backdrop-blur transition-colors hover:border-saffron hover:text-saffron"
      >
        {t("loadMap")}
      </button>
    </div>
  );
}
