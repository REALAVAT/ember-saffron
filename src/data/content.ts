import { unsplash } from "./images";
import type { EventSpace, GalleryImage, Localized, Review } from "./types";

export const stats: { value: string; label: Localized }[] = [
  { value: "1,200°", label: { en: "Oak-fired hearth", ar: "موقد خشب البلوط" } },
  { value: "48h", label: { en: "Slow-cooked short rib", ar: "ضلوع مطهوة ببطء" } },
  { value: "14", label: { en: "House spice blends", ar: "خلطة بهارات منزلية" } },
];

export const chef = {
  name: { en: "Chef Karim Haddad", ar: "الشيف كريم حداد" } satisfies Localized,
  role: { en: "Founder & Executive Chef", ar: "المؤسس والشيف التنفيذي" } satisfies Localized,
  image: unsplash("photo-1577219491135-ce391730fb2c", 1400),
  signature: "Karim Haddad",
};

export const reviews: Review[] = [
  {
    id: "r1",
    author: "Layla A.",
    source: "Google",
    rating: 5,
    quote: {
      en: "The lamb ouzi alone is worth the trip. Every course felt like it had a story — the best dinner we've had in Dubai this year.",
      ar: "طبق الأوزي وحده يستحق الزيارة. كل طبق كان يحكي قصة — أفضل عشاء تناولناه في دبي هذا العام.",
    },
  },
  {
    id: "r2",
    author: "James R.",
    source: "TripAdvisor",
    rating: 5,
    quote: {
      en: "Moody, warm and beautifully lit. Staff walked us through the grill like sommeliers. The saffron spritz is dangerous.",
      ar: "أجواء دافئة وإضاءة ساحرة. شرح لنا الطاقم المشاوي كخبراء حقيقيين. وسبريتز الزعفران لا يُقاوم.",
    },
  },
  {
    id: "r3",
    author: "Noura K.",
    source: "Google",
    rating: 5,
    quote: {
      en: "Booked the chef's table for my mother's birthday. Thoughtful, generous and genuinely unforgettable.",
      ar: "حجزنا طاولة الشيف لعيد ميلاد والدتي. تجربة مدروسة وكريمة ولا تُنسى حقاً.",
    },
  },
  {
    id: "r4",
    author: "Time Out Dubai",
    source: "Press",
    rating: 5,
    quote: {
      en: "A confident love letter to the Levant and the Gulf, cooked with fire and finesse.",
      ar: "رسالة حب واثقة إلى بلاد الشام والخليج، مطهوة بالنار والإتقان.",
    },
  },
];

export const gallery: GalleryImage[] = [
  {
    src: unsplash("photo-1517248135467-4c7edcad34c4", 1400),
    alt: { en: "Dining room with warm lighting", ar: "صالة الطعام بإضاءة دافئة" },
    width: 1400,
    height: 933,
  },
  {
    src: unsplash("photo-1578474846511-04ba529f0b88", 1400),
    alt: { en: "Intimate dark dining room", ar: "صالة طعام هادئة بإضاءة خافتة" },
    width: 1400,
    height: 1750,
  },
  {
    src: unsplash("photo-1414235077428-338989a2e8c0", 1400),
    alt: { en: "Plated dish on a set table", ar: "طبق مقدّم على طاولة مُعدّة" },
    width: 1400,
    height: 933,
  },
  {
    src: unsplash("photo-1514933651103-005eec06c04b", 1400),
    alt: { en: "Bar with pendant lights", ar: "البار مع إضاءة معلقة" },
    width: 1400,
    height: 933,
  },
  {
    src: unsplash("photo-1600565193348-f74bd3c7ccdf", 1400),
    alt: { en: "Chef cooking over open flame", ar: "الشيف يطهو على لهب مفتوح" },
    width: 1400,
    height: 1750,
  },
  {
    src: unsplash("photo-1590846406792-0adc7f938f1d", 1400),
    alt: { en: "Restaurant interior at night", ar: "المطعم من الداخل ليلاً" },
    width: 1400,
    height: 933,
  },
  {
    src: unsplash("photo-1559339352-11d035aa65de", 1400),
    alt: { en: "Waterfront terrace at sunset", ar: "التراس المطل على الماء عند الغروب" },
    width: 1400,
    height: 1750,
  },
  {
    src: unsplash("photo-1466978913421-dad2ebd01d17", 1400),
    alt: { en: "Guests sharing plates", ar: "ضيوف يتشاركون الأطباق" },
    width: 1400,
    height: 933,
  },
];

export const instagramPosts: { src: string; alt: Localized; likes: string }[] = [
  {
    src: unsplash("photo-1600891964599-f61ba0e24092", 800),
    alt: { en: "Table of shared dishes", ar: "طاولة أطباق مشتركة" },
    likes: "2.4k",
  },
  {
    src: unsplash("photo-1606491956689-2ea866880c84", 800),
    alt: { en: "Bread rolls with dips", ar: "خبز مع صلصات" },
    likes: "1.8k",
  },
  {
    src: unsplash("photo-1529193591184-b1d58069ecdd", 800),
    alt: { en: "Charred meat on the grill", ar: "لحم مشوي على الجمر" },
    likes: "3.1k",
  },
  {
    src: unsplash("photo-1536935338788-846bb9981813", 800),
    alt: { en: "Signature amber drink", ar: "المشروب الكهرماني المميز" },
    likes: "1.2k",
  },
  {
    src: unsplash("photo-1598110750624-207050c4f28c", 800),
    alt: { en: "Pistachio baklava", ar: "بقلاوة بالفستق" },
    likes: "2.9k",
  },
  {
    src: unsplash("photo-1590577976322-3d2d6e2130d5", 800),
    alt: { en: "Chef at the pass", ar: "الشيف عند منصة التقديم" },
    likes: "1.6k",
  },
];

export const eventSpaces: EventSpace[] = [
  {
    id: "chefs-table",
    name: { en: "The Chef's Table", ar: "طاولة الشيف" },
    capacity: { en: "Up to 12 guests", ar: "حتى 12 ضيفاً" },
    description: {
      en: "A twelve-seat counter facing the hearth, with a bespoke tasting menu cooked in front of you.",
      ar: "طاولة من اثني عشر مقعداً أمام الموقد، مع قائمة تذوق خاصة تُطهى أمامك.",
    },
    image: unsplash("photo-1590577976322-3d2d6e2130d5", 1400),
  },
  {
    id: "ember-room",
    name: { en: "The Ember Room", ar: "غرفة الجمر" },
    capacity: { en: "Up to 40 guests", ar: "حتى 40 ضيفاً" },
    description: {
      en: "Our private dining room in copper and smoked oak, with its own sound system and screen.",
      ar: "غرفة الطعام الخاصة بتصميم من النحاس والبلوط المدخن، مع نظام صوت وشاشة خاصين.",
    },
    image: unsplash("photo-1578474846511-04ba529f0b88", 1400),
  },
  {
    id: "saffron-terrace",
    name: { en: "Saffron Terrace", ar: "تراس الزعفران" },
    capacity: { en: "Up to 120 guests", ar: "حتى 120 ضيفاً" },
    description: {
      en: "An open-air terrace for receptions, launches and celebrations under the Dubai sky.",
      ar: "تراس في الهواء الطلق لحفلات الاستقبال والإطلاق والاحتفالات تحت سماء دبي.",
    },
    image: unsplash("photo-1559339352-11d035aa65de", 1400),
  },
];

export const eventTypes = [
  "corporate",
  "birthday",
  "wedding",
  "launch",
  "catering",
  "other",
] as const;

export const occasions = [
  "none",
  "birthday",
  "anniversary",
  "date",
  "business",
  "celebration",
] as const;

export const eventBudgets = ["under-10k", "10k-25k", "25k-50k", "50k-plus"] as const;
