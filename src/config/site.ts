import type { Localized, OpeningHours } from "@/data/types";

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "https://restaurant.ahmadkhajeh.com";
}

export const siteConfig = {
  name: "Ember & Saffron",
  shortName: "Ember & Saffron",
  url: resolveSiteUrl(),
  tagline: {
    en: "Middle Eastern fusion, cooked over fire",
    ar: "مطبخ شرق أوسطي مُبتكر، على نار الجمر",
  } satisfies Localized,
  description: {
    en: "Ember & Saffron is a modern Middle Eastern fusion restaurant in DIFC, Dubai. Wood-fired grills, saffron-scented mezze and an open kitchen built around the flame.",
    ar: "إمبر آند سافرون مطعم شرق أوسطي عصري في مركز دبي المالي العالمي. مشاوي على الحطب، مقبلات بنكهة الزعفران، ومطبخ مفتوح يدور حول اللهب.",
  } satisfies Localized,
  cuisine: ["Middle Eastern", "Fusion", "Grill", "Emirati"],
  priceRange: "AED 150–350",
  copyrightYear: 2026,
  currency: "AED",
  contact: {
    phone: "+971 4 555 0142",
    phoneHref: "tel:+97145550142",
    email: "hello@emberandsaffron.ae",
    whatsapp: "971505550142",
  },
  address: {
    street: {
      en: "Gate Village 4, Dubai International Financial Centre",
      ar: "جيت فيليج 4، مركز دبي المالي العالمي",
    } satisfies Localized,
    city: { en: "Dubai", ar: "دبي" } satisfies Localized,
    country: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" } satisfies Localized,
    postalCode: "507211",
    countryCode: "AE",
    region: "Dubai",
    geo: { lat: 25.2131, lng: 55.2797 },
    mapsUrl: "https://maps.google.com/?q=Gate+Village+DIFC+Dubai",
    embedUrl: "https://www.google.com/maps?q=Gate+Village+DIFC+Dubai&z=15&output=embed",
  },
  hours: [
    {
      days: { en: "Sunday – Wednesday", ar: "الأحد – الأربعاء" },
      schemaDays: ["Sunday", "Monday", "Tuesday", "Wednesday"],
      opens: "12:00",
      closes: "23:30",
    },
    {
      days: { en: "Thursday – Saturday", ar: "الخميس – السبت" },
      schemaDays: ["Thursday", "Friday", "Saturday"],
      opens: "12:00",
      closes: "01:00",
    },
  ] satisfies OpeningHours[],
  social: {
    instagram: "https://instagram.com/emberandsaffron",
    instagramHandle: "@emberandsaffron",
    tiktok: "https://tiktok.com/@emberandsaffron",
  },
  author: {
    name: "Ahmad Khajeh",
    url: "https://ahmadkhajeh.com",
    label: "ahmadkhajeh.com",
  },
  ordering: {
    deliveryFee: 15,
    freeDeliveryThreshold: 250,
    minimumOrder: 60,
    vatRate: 0.05,
    promoCodes: { WELCOME10: 0.1 } as Record<string, number>,
  },
} as const;

export type SiteConfig = typeof siteConfig;
