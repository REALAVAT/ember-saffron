import { Fraunces, Manrope, Noto_Kufi_Arabic } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: "normal",
  display: "swap",
});

export const frauncesItalic = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces-italic",
  style: "italic",
  display: "swap",
  preload: false,
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const kufi = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-kufi",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});
