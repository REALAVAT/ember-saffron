import { siteConfig } from "@/config/site";
import { dishes, menuCategories } from "@/data/menu";
import { images } from "@/data/images";
import type { AppLocale } from "@/i18n/routing";
import { localize } from "./i18n-data";
import { absoluteUrl, localizedPath } from "./seo";

const dietMap = {
  vegan: "https://schema.org/VeganDiet",
  vegetarian: "https://schema.org/VegetarianDiet",
  "gluten-free": "https://schema.org/GlutenFreeDiet",
} as const;

export function menuJsonLd(locale: AppLocale) {
  return {
    "@type": "Menu",
    "@id": `${absoluteUrl(localizedPath(locale, "/menu"))}#menu`,
    name: locale === "ar" ? "قائمة إمبر آند سافرون" : "Ember & Saffron Menu",
    url: absoluteUrl(localizedPath(locale, "/menu")),
    inLanguage: locale,
    hasMenuSection: menuCategories.map((category) => ({
      "@type": "MenuSection",
      name: localize(category.name, locale),
      description: localize(category.tagline, locale),
      hasMenuItem: dishes
        .filter((dish) => dish.category === category.id)
        .map((dish) => {
          const diets = dish.dietary
            .filter((d): d is keyof typeof dietMap => d in dietMap)
            .map((d) => dietMap[d]);
          return {
            "@type": "MenuItem",
            name: localize(dish.name, locale),
            description: localize(dish.description, locale),
            image: dish.image,
            offers: {
              "@type": "Offer",
              price: dish.price.toFixed(2),
              priceCurrency: siteConfig.currency,
            },
            ...(diets.length ? { suitableForDiet: diets } : {}),
          };
        }),
    })),
  };
}

export function restaurantJsonLd(locale: AppLocale, { includeMenu = true } = {}) {
  const { address, contact, hours } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteConfig.url}/#restaurant`,
    name: siteConfig.name,
    description: localize(siteConfig.description, locale),
    url: absoluteUrl(localizedPath(locale)),
    image: [images.hero, images.feast, images.grillFire],
    logo: absoluteUrl("/icon.svg"),
    telephone: contact.phone,
    email: contact.email,
    priceRange: siteConfig.priceRange,
    servesCuisine: siteConfig.cuisine,
    acceptsReservations: absoluteUrl(localizedPath(locale, "/reservations")),
    currenciesAccepted: siteConfig.currency,
    paymentAccepted: "Cash, Credit Card, Apple Pay",
    address: {
      "@type": "PostalAddress",
      streetAddress: localize(address.street, locale),
      addressLocality: localize(address.city, locale),
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: address.geo.lat,
      longitude: address.geo.lng,
    },
    hasMap: address.mapsUrl,
    openingHoursSpecification: hours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.schemaDays.map((day) => `https://schema.org/${day}`),
      opens: slot.opens,
      closes: slot.closes,
    })),
    sameAs: [siteConfig.social.instagram, siteConfig.social.tiktok],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "2318",
      bestRating: "5",
    },
    hasMenu: includeMenu
      ? menuJsonLd(locale)
      : absoluteUrl(localizedPath(locale, "/menu")),
  };
}

export function breadcrumbJsonLd(locale: AppLocale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}
