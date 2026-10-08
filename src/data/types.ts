import type { AppLocale } from "@/i18n/routing";

export type Localized = Record<AppLocale, string>;

export type Dietary = "vegan" | "vegetarian" | "spicy" | "gluten-free";

export type MenuCategoryId = "starters" | "mains" | "grill" | "desserts" | "drinks";

export interface MenuCategory {
  id: MenuCategoryId;
  name: Localized;
  tagline: Localized;
}

export interface OptionChoice {
  id: string;
  name: Localized;
  /** Price delta in AED added per unit. */
  price?: number;
}

export interface OptionGroup {
  id: string;
  name: Localized;
  type: "single" | "multiple";
  required?: boolean;
  choices: OptionChoice[];
}

export interface Dish {
  id: string;
  category: MenuCategoryId;
  name: Localized;
  description: Localized;
  /** Base price in AED, VAT inclusive. */
  price: number;
  image: string;
  imageAlt: Localized;
  dietary: Dietary[];
  signature?: boolean;
  chefPick?: boolean;
  options?: OptionGroup[];
}

export interface Review {
  id: string;
  author: string;
  source: string;
  rating: number;
  quote: Localized;
}

export interface GalleryImage {
  src: string;
  alt: Localized;
  width: number;
  height: number;
}

export interface OpeningHours {
  days: Localized;
  /** schema.org day names used for JSON-LD. */
  schemaDays: string[];
  opens: string;
  closes: string;
}

export interface EventSpace {
  id: string;
  name: Localized;
  capacity: Localized;
  description: Localized;
  image: string;
}
