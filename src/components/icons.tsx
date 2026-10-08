import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 3c.4 2.3 1.8 3.9 4.1 4.1v3.1c-1.5.1-2.9-.4-4.1-1.2v6.1c0 3.6-2.6 6-5.9 6-3.2 0-5.7-2.5-5.7-5.6 0-3.5 3.1-6.1 6.7-5.5v3.2c-1.6-.4-3.4.6-3.4 2.3 0 1.3 1 2.4 2.4 2.4 1.5 0 2.6-1 2.6-2.9V3h3.3Z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.67.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeOpacity="0.35" />
      <path
        d="M20 7c1.8 4.2 6.8 7 6.8 13.2A6.8 6.8 0 0 1 20 27a6.8 6.8 0 0 1-6.8-6.8c0-3 1.6-4.9 3.1-6.5.2 2 1.1 3.3 2.4 3.9C18.2 13.8 18.6 10.4 20 7Z"
        fill="url(#ember-grad)"
      />
      <path d="M12 32h16" stroke="currentColor" strokeOpacity="0.6" strokeLinecap="round" />
      <defs>
        <linearGradient id="ember-grad" x1="20" y1="7" x2="20" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F3CF84" />
          <stop offset="1" stopColor="#E8572A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
