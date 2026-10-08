import { unsplash } from "./images";
import type { Dish, MenuCategory, OptionGroup } from "./types";

export const menuCategories: MenuCategory[] = [
  {
    id: "starters",
    name: { en: "Starters", ar: "المقبلات" },
    tagline: { en: "Mezze for the table", ar: "مزة للمشاركة" },
  },
  {
    id: "mains",
    name: { en: "Mains", ar: "الأطباق الرئيسية" },
    tagline: { en: "Slow-cooked, saffron-laced", ar: "مطهوة ببطء بلمسة زعفران" },
  },
  {
    id: "grill",
    name: { en: "Grill", ar: "المشاوي" },
    tagline: { en: "Straight from the embers", ar: "مباشرة من الجمر" },
  },
  {
    id: "desserts",
    name: { en: "Desserts", ar: "الحلويات" },
    tagline: { en: "Rose, honey & pistachio", ar: "ورد وعسل وفستق" },
  },
  {
    id: "drinks",
    name: { en: "Drinks", ar: "المشروبات" },
    tagline: { en: "Zero-proof & house blends", ar: "مشروبات خالية من الكحول وخلطات البيت" },
  },
];

const doneness: OptionGroup = {
  id: "doneness",
  name: { en: "Cooked to", ar: "درجة الطهي" },
  type: "single",
  required: true,
  choices: [
    { id: "medium-rare", name: { en: "Medium rare", ar: "متوسط النضج قليلاً" } },
    { id: "medium", name: { en: "Medium", ar: "متوسط النضج" } },
    { id: "well-done", name: { en: "Well done", ar: "مطهو جيداً" } },
  ],
};

const grillSides: OptionGroup = {
  id: "sides",
  name: { en: "Add a side", ar: "أضف طبقاً جانبياً" },
  type: "multiple",
  choices: [
    { id: "saffron-rice", name: { en: "Saffron rice", ar: "أرز بالزعفران" }, price: 22 },
    { id: "charred-bread", name: { en: "Charred flatbread", ar: "خبز مشوي" }, price: 12 },
    { id: "fattoush", name: { en: "Fattoush salad", ar: "سلطة فتوش" }, price: 28 },
  ],
};

const spiceLevel: OptionGroup = {
  id: "spice",
  name: { en: "Heat level", ar: "مستوى الحرارة" },
  type: "single",
  required: true,
  choices: [
    { id: "mild", name: { en: "Mild", ar: "خفيف" } },
    { id: "medium", name: { en: "Medium", ar: "متوسط" } },
    { id: "fiery", name: { en: "Fiery", ar: "حار جداً" } },
  ],
};

const drinkSize: OptionGroup = {
  id: "size",
  name: { en: "Size", ar: "الحجم" },
  type: "single",
  required: true,
  choices: [
    { id: "glass", name: { en: "Glass", ar: "كوب" } },
    { id: "carafe", name: { en: "Carafe (serves 3)", ar: "إبريق (لثلاثة أشخاص)" }, price: 48 },
  ],
};

const dessertExtras: OptionGroup = {
  id: "extras",
  name: { en: "Make it special", ar: "اجعلها مميزة" },
  type: "multiple",
  choices: [
    { id: "ice-cream", name: { en: "Mastic ice cream", ar: "آيس كريم بالمستكة" }, price: 14 },
    { id: "candle", name: { en: "Celebration candle", ar: "شمعة احتفال" }, price: 0 },
  ],
};

export const dishes: Dish[] = [
  // Starters
  {
    id: "smoked-hummus",
    category: "starters",
    name: { en: "Smoked Hummus", ar: "حمص مدخّن" },
    description: {
      en: "Hickory-smoked chickpeas, brown butter, toasted pine nuts and Aleppo chilli oil.",
      ar: "حمص مدخّن بخشب الهيكوري مع زبدة بنية وصنوبر محمّص وزيت فلفل حلبي.",
    },
    price: 48,
    image: unsplash("photo-1637949385162-e416fb15b2ce", 1200),
    imageAlt: { en: "Bowl of smoked hummus with olive oil", ar: "طبق حمص مدخّن مع زيت الزيتون" },
    dietary: ["vegetarian", "gluten-free"],
    signature: true,
  },
  {
    id: "saffron-falafel",
    category: "starters",
    name: { en: "Saffron Falafel", ar: "فلافل بالزعفران" },
    description: {
      en: "Crisp herb falafel scented with saffron, whipped tahini and pickled turnip.",
      ar: "فلافل مقرمشة بالأعشاب والزعفران مع طحينة مخفوقة ولفت مخلل.",
    },
    price: 42,
    image: unsplash("photo-1593001872095-7d5b3868fb1d", 1200),
    imageAlt: { en: "Golden falafel served in a bowl", ar: "فلافل ذهبية في وعاء" },
    dietary: ["vegan", "gluten-free"],
  },
  {
    id: "fig-burrata",
    category: "starters",
    name: { en: "Fig & Burrata", ar: "تين وبوراتا" },
    description: {
      en: "Roasted figs, creamy burrata, pomegranate molasses and za'atar crumb.",
      ar: "تين محمّص وبوراتا كريمية مع دبس الرمان وفتات الزعتر.",
    },
    price: 64,
    image: unsplash("photo-1544510808-91bcbee1df55", 1200),
    imageAlt: { en: "Plate of figs with cream and herbs", ar: "طبق تين مع كريمة وأعشاب" },
    dietary: ["vegetarian"],
    chefPick: true,
  },
  {
    id: "ember-fattoush",
    category: "starters",
    name: { en: "Ember Fattoush", ar: "فتوش الجمر" },
    description: {
      en: "Fire-blistered vegetables, sumac crisps, purslane and pomegranate dressing.",
      ar: "خضار مشوية على النار مع رقائق السماق والبقلة وصلصة الرمان.",
    },
    price: 44,
    image: unsplash("photo-1540189549336-e6e99c3679fe", 1200),
    imageAlt: { en: "Colourful salad in a dark bowl", ar: "سلطة ملونة في وعاء داكن" },
    dietary: ["vegan"],
  },
  {
    id: "chermoula-prawns",
    category: "starters",
    name: { en: "Chermoula Prawns", ar: "روبيان بالشرمولة" },
    description: {
      en: "Gulf prawns seared in a cast-iron pan with chermoula, garlic and preserved lemon.",
      ar: "روبيان الخليج مشوي في مقلاة حديدية مع الشرمولة والثوم والليمون المخلل.",
    },
    price: 72,
    image: unsplash("photo-1625943553852-781c6dd46faa", 1200),
    imageAlt: { en: "Pan of seared prawns with basil", ar: "مقلاة روبيان مشوي مع الريحان" },
    dietary: ["spicy", "gluten-free"],
    options: [spiceLevel],
  },
  {
    id: "lentil-shorba",
    category: "starters",
    name: { en: "Saffron Lentil Shorba", ar: "شوربة عدس بالزعفران" },
    description: {
      en: "Velvet red lentil soup, cumin, saffron cream and crispy shallots.",
      ar: "شوربة عدس أحمر ناعمة بالكمون وكريمة الزعفران والبصل المقرمش.",
    },
    price: 36,
    image: unsplash("photo-1476718406336-bb5a9690ee2a", 1200),
    imageAlt: { en: "Bowl of golden lentil soup", ar: "وعاء شوربة عدس ذهبية" },
    dietary: ["vegetarian", "gluten-free"],
  },
  {
    id: "lamb-sambousek",
    category: "starters",
    name: { en: "Lamb Sambousek", ar: "سمبوسك باللحم" },
    description: {
      en: "Hand-folded pastries of spiced lamb and pine nuts with green chilli chutney.",
      ar: "معجنات محشوة بلحم الضأن المتبل والصنوبر مع صلصة الفلفل الأخضر.",
    },
    price: 46,
    image: unsplash("photo-1601050690597-df0568f70950", 1200),
    imageAlt: { en: "Golden fried pastries with chutney", ar: "معجنات مقلية ذهبية مع صلصة" },
    dietary: ["spicy"],
  },
  {
    id: "mezze-board",
    category: "starters",
    name: { en: "Mezze Board for Two", ar: "لوح مزة لشخصين" },
    description: {
      en: "Labneh, muhammara, figs, marinated olives, soft eggs and warm flatbread.",
      ar: "لبنة ومحمرة وتين وزيتون متبل وبيض طري وخبز دافئ.",
    },
    price: 89,
    image: unsplash("photo-1478145046317-39f10e56b5e9", 1200),
    imageAlt: { en: "Sharing board with figs, eggs and dips", ar: "لوح مشاركة مع تين وبيض وصلصات" },
    dietary: ["vegetarian"],
    signature: true,
  },

  // Mains
  {
    id: "seafood-machboos",
    category: "mains",
    name: { en: "Seafood Machboos", ar: "مكبوس بحري" },
    description: {
      en: "Emirati spiced rice with prawns, hamour and loomi, finished with saffron butter.",
      ar: "أرز إماراتي متبل مع الروبيان والهامور واللومي، مع زبدة الزعفران.",
    },
    price: 128,
    image: unsplash("photo-1559847844-5315695dadae", 1200),
    imageAlt: { en: "Spiced rice with prawns in a bowl", ar: "أرز متبل مع روبيان في وعاء" },
    dietary: ["gluten-free"],
    signature: true,
  },
  {
    id: "chicken-mandi",
    category: "mains",
    name: { en: "Ember Chicken Mandi", ar: "مندي دجاج على الجمر" },
    description: {
      en: "Smoked half chicken over fragrant mandi rice, almonds and daqqus tomato sauce.",
      ar: "نصف دجاجة مدخّنة على أرز المندي العطري مع اللوز وصلصة الدقوس.",
    },
    price: 98,
    image: unsplash("photo-1631515243349-e0cb75fb8d3a", 1200),
    imageAlt: { en: "Chicken on spiced rice", ar: "دجاج على أرز متبل" },
    dietary: ["gluten-free"],
  },
  {
    id: "lamb-ouzi",
    category: "mains",
    name: { en: "Saffron Lamb Ouzi", ar: "أوزي لحم بالزعفران" },
    description: {
      en: "Twelve-hour lamb shoulder, saffron rice, peas, raisins and roasted nuts.",
      ar: "كتف ضأن مطهو لاثنتي عشرة ساعة مع أرز بالزعفران والبازلاء والزبيب والمكسرات.",
    },
    price: 165,
    image: unsplash("photo-1563379091339-03b21ab4a4f8", 1200),
    imageAlt: { en: "Saffron rice dish with herbs", ar: "طبق أرز بالزعفران مع أعشاب" },
    dietary: ["gluten-free"],
    signature: true,
    chefPick: true,
  },
  {
    id: "sumac-salmon",
    category: "mains",
    name: { en: "Sumac Salmon", ar: "سلمون بالسماق" },
    description: {
      en: "Crisp-skin salmon, smoked freekeh, charred lemon and herb tahini.",
      ar: "سلمون بجلد مقرمش مع فريكة مدخنة وليمون مشوي وطحينة بالأعشاب.",
    },
    price: 118,
    image: unsplash("photo-1467003909585-2f8a72700288", 1200),
    imageAlt: { en: "Salmon fillet with greens", ar: "شريحة سلمون مع خضار" },
    dietary: [],
  },
  {
    id: "hamour-saloona",
    category: "mains",
    name: { en: "Hamour Saloona", ar: "صالونة هامور" },
    description: {
      en: "Gulf hamour in a slow-simmered tomato and bzar stew with dried lime.",
      ar: "سمك هامور في يخنة طماطم وبزار مطهوة ببطء مع اللومي.",
    },
    price: 112,
    image: unsplash("photo-1574484284002-952d92456975", 1200),
    imageAlt: { en: "Fish in a golden curry", ar: "سمك في صلصة ذهبية" },
    dietary: ["spicy", "gluten-free"],
    options: [spiceLevel],
  },
  {
    id: "root-tagine",
    category: "mains",
    name: { en: "Seven-Root Tagine", ar: "طاجن الجذور السبعة" },
    description: {
      en: "Roots and squash braised with preserved lemon, apricot and ras el hanout.",
      ar: "جذور وقرع مطهوة مع الليمون المخلل والمشمش ورأس الحانوت.",
    },
    price: 82,
    image: unsplash("photo-1541518763669-27fef04b14ea", 1200),
    imageAlt: { en: "Vegetable tagine in a clay dish", ar: "طاجن خضار في وعاء فخاري" },
    dietary: ["vegan", "gluten-free"],
  },
  {
    id: "shakshuka-royale",
    category: "mains",
    name: { en: "Shakshuka Royale", ar: "شكشوكة رويال" },
    description: {
      en: "Eggs baked in harissa tomato, whipped feta, herbs and sourdough.",
      ar: "بيض مخبوز في صلصة طماطم بالهريسة مع فيتا مخفوقة وأعشاب وخبز العجين المخمر.",
    },
    price: 68,
    image: unsplash("photo-1590412200988-a436970781fa", 1200),
    imageAlt: { en: "Shakshuka in a pan with herbs", ar: "شكشوكة في مقلاة مع أعشاب" },
    dietary: ["vegetarian", "spicy"],
  },

  // Grill
  {
    id: "wagyu-ribeye",
    category: "grill",
    name: { en: "Wagyu Ribeye", ar: "ريب آي واغيو" },
    description: {
      en: "MB 6+ wagyu, za'atar butter and smoked shallot jus. 350g.",
      ar: "واغيو بدرجة تعريق 6+ مع زبدة الزعتر وصلصة الكراث المدخن. 350 غرام.",
    },
    price: 345,
    image: unsplash("photo-1558030006-450675393462", 1200),
    imageAlt: { en: "Sliced grilled ribeye steak", ar: "شرائح ستيك ريب آي مشوي" },
    dietary: ["gluten-free"],
    signature: true,
    options: [doneness, grillSides],
  },
  {
    id: "lamb-kofta",
    category: "grill",
    name: { en: "Lamb Kofta", ar: "كفتة لحم ضأن" },
    description: {
      en: "Hand-minced lamb with sumac onions, grilled tomato and garlic toum.",
      ar: "لحم ضأن مفروم يدوياً مع بصل بالسماق وطماطم مشوية وثومية.",
    },
    price: 92,
    image: unsplash("photo-1603360946369-dc9bb6258143", 1200),
    imageAlt: { en: "Grilled kofta skewers with tomatoes", ar: "أسياخ كفتة مشوية مع طماطم" },
    dietary: ["gluten-free"],
    options: [grillSides],
  },
  {
    id: "shish-tawook",
    category: "grill",
    name: { en: "Saffron Shish Tawook", ar: "شيش طاووق بالزعفران" },
    description: {
      en: "Yoghurt and saffron marinated chicken, charred over oak with toum.",
      ar: "دجاج متبل باللبن والزعفران، مشوي على خشب البلوط مع الثومية.",
    },
    price: 84,
    image: unsplash("photo-1599487488170-d11ec9c172f0", 1200),
    imageAlt: { en: "Chicken skewers on the grill", ar: "أسياخ دجاج على الشواية" },
    dietary: ["gluten-free"],
    options: [grillSides],
  },
  {
    id: "date-short-rib",
    category: "grill",
    name: { en: "Date-Glazed Short Rib", ar: "ضلوع بقري بدبس التمر" },
    description: {
      en: "48-hour short rib lacquered with date molasses and black lime.",
      ar: "ضلوع بقري مطهوة لـ48 ساعة ومغطاة بدبس التمر واللومي الأسود.",
    },
    price: 158,
    image: unsplash("photo-1544025162-d76694265947", 1200),
    imageAlt: { en: "Glazed ribs on a board", ar: "ضلوع مزججة على لوح" },
    dietary: [],
    chefPick: true,
    options: [grillSides],
  },
  {
    id: "lamb-cutlets",
    category: "grill",
    name: { en: "Ember Lamb Cutlets", ar: "ريش ضأن على الجمر" },
    description: {
      en: "Australian lamb cutlets, pistachio gremolata and pomegranate.",
      ar: "ريش ضأن أسترالية مع غريمولاتا الفستق والرمان.",
    },
    price: 178,
    image: unsplash("photo-1529193591184-b1d58069ecdd", 1200),
    imageAlt: { en: "Charred lamb cutlets", ar: "ريش ضأن مشوية" },
    dietary: ["gluten-free"],
    options: [doneness, grillSides],
  },
  {
    id: "black-garlic-tenderloin",
    category: "grill",
    name: { en: "Black Garlic Tenderloin", ar: "فيليه بالثوم الأسود" },
    description: {
      en: "Grass-fed tenderloin, black garlic purée, charred asparagus.",
      ar: "فيليه بقري مغذى بالأعشاب مع هريس الثوم الأسود والهليون المشوي.",
    },
    price: 215,
    image: unsplash("photo-1432139509613-5c4255815697", 1200),
    imageAlt: { en: "Tenderloin steak with asparagus", ar: "ستيك فيليه مع الهليون" },
    dietary: ["gluten-free"],
    options: [doneness, grillSides],
  },
  {
    id: "mixed-grill",
    category: "grill",
    name: { en: "Fire Feast Mixed Grill", ar: "مشاوي مشكلة - وليمة النار" },
    description: {
      en: "Kofta, tawook, lamb cutlets and halloumi with charred vegetables. Serves two.",
      ar: "كفتة وطاووق وريش ضأن وحلوم مع خضار مشوية. يكفي شخصين.",
    },
    price: 289,
    image: unsplash("photo-1555939594-58d7cb561ad1", 1200),
    imageAlt: { en: "Mixed grill platter with skewers", ar: "طبق مشاوي مشكلة مع أسياخ" },
    dietary: [],
    signature: true,
    options: [grillSides],
  },
  {
    id: "seafood-grill",
    category: "grill",
    name: { en: "Gulf Seafood Grill", ar: "مشاوي بحرية خليجية" },
    description: {
      en: "Octopus, king prawns and catch of the day with saffron aioli.",
      ar: "أخطبوط وروبيان ملكي وصيد اليوم مع أيولي الزعفران.",
    },
    price: 238,
    image: unsplash("photo-1606850780554-b55ea4dd0b70", 1200),
    imageAlt: { en: "Grilled octopus and prawns on a board", ar: "أخطبوط وروبيان مشوي على لوح" },
    dietary: ["gluten-free"],
  },

  // Desserts
  {
    id: "pistachio-baklava",
    category: "desserts",
    name: { en: "Pistachio Baklava", ar: "بقلاوة بالفستق" },
    description: {
      en: "Forty layers of butter pastry, Aleppo pistachio and orange blossom syrup.",
      ar: "أربعون طبقة من العجين بالزبدة مع فستق حلبي وقطر ماء الزهر.",
    },
    price: 42,
    image: unsplash("photo-1598110750624-207050c4f28c", 1200),
    imageAlt: { en: "Tray of pistachio baklava", ar: "صينية بقلاوة بالفستق" },
    dietary: ["vegetarian"],
    signature: true,
    options: [dessertExtras],
  },
  {
    id: "rose-milk-cake",
    category: "desserts",
    name: { en: "Rose Milk Cake", ar: "كيكة الحليب بالورد" },
    description: {
      en: "Three-milk sponge, rose cream and fresh raspberries.",
      ar: "كيك إسفنجي بثلاثة أنواع من الحليب مع كريمة الورد وتوت العليق الطازج.",
    },
    price: 46,
    image: unsplash("photo-1565958011703-44f9829ba187", 1200),
    imageAlt: { en: "Slice of layered cake with raspberries", ar: "قطعة كيك بطبقات مع توت" },
    dietary: ["vegetarian"],
    options: [dessertExtras],
  },
  {
    id: "date-chocolate-cake",
    category: "desserts",
    name: { en: "Date & Dark Chocolate Cake", ar: "كيكة التمر والشوكولاتة الداكنة" },
    description: {
      en: "Medjool date sponge, 70% chocolate ganache and tahini caramel.",
      ar: "كيك بتمر المجدول مع غاناش شوكولاتة 70% وكراميل الطحينة.",
    },
    price: 48,
    image: unsplash("photo-1578985545062-69928b1d9587", 1200),
    imageAlt: { en: "Chocolate cake on a stand", ar: "كيكة شوكولاتة على حامل" },
    dietary: ["vegetarian"],
    chefPick: true,
    options: [dessertExtras],
  },
  {
    id: "cardamom-tiramisu",
    category: "desserts",
    name: { en: "Cardamom Tiramisu", ar: "تيراميسو بالهيل" },
    description: {
      en: "Arabic coffee-soaked savoiardi, cardamom mascarpone and cocoa.",
      ar: "بسكويت منقوع بالقهوة العربية مع ماسكاربوني بالهيل والكاكاو.",
    },
    price: 44,
    image: unsplash("photo-1571877227200-a0d98ea607e9", 1200),
    imageAlt: { en: "Tiramisu dusted with cocoa", ar: "تيراميسو مرشوش بالكاكاو" },
    dietary: ["vegetarian"],
  },
  {
    id: "saffron-lemon-tart",
    category: "desserts",
    name: { en: "Saffron Lemon Tart", ar: "تارت الليمون بالزعفران" },
    description: {
      en: "Saffron-infused lemon curd and torched meringue on a sablé base.",
      ar: "كريمة ليمون منقوعة بالزعفران وميرينغ محمّص على قاعدة سابليه.",
    },
    price: 42,
    image: unsplash("photo-1519915028121-7d3463d20b13", 1200),
    imageAlt: { en: "Lemon meringue tart", ar: "تارت الليمون بالميرينغ" },
    dietary: ["vegetarian"],
  },
  {
    id: "rose-muhallabia",
    category: "desserts",
    name: { en: "Rose Muhallabia", ar: "مهلبية بالورد" },
    description: {
      en: "Coconut milk pudding, rosewater, strawberries and pistachio dust.",
      ar: "مهلبية بحليب جوز الهند وماء الورد مع الفراولة وغبار الفستق.",
    },
    price: 38,
    image: unsplash("photo-1488477181946-6428a0291777", 1200),
    imageAlt: { en: "Cream puddings with strawberries", ar: "مهلبية مع فراولة" },
    dietary: ["vegan", "gluten-free"],
  },

  // Drinks
  {
    id: "saffron-spritz",
    category: "drinks",
    name: { en: "Smoked Saffron Spritz", ar: "سبريتز الزعفران المدخن" },
    description: {
      en: "Zero-proof saffron cordial, smoked orange and sparkling water.",
      ar: "شراب الزعفران الخالي من الكحول مع برتقال مدخن ومياه فوارة.",
    },
    price: 42,
    image: unsplash("photo-1536935338788-846bb9981813", 1200),
    imageAlt: { en: "Amber drink with dried orange", ar: "مشروب كهرماني مع برتقال مجفف" },
    dietary: ["vegan", "gluten-free"],
    signature: true,
  },
  {
    id: "pomegranate-cooler",
    category: "drinks",
    name: { en: "Pomegranate Rose Cooler", ar: "مبرّد الرمان والورد" },
    description: {
      en: "Fresh pomegranate, rosewater, lime and crushed ice.",
      ar: "رمان طازج وماء الورد والليمون والثلج المجروش.",
    },
    price: 36,
    image: unsplash("photo-1497534446932-c925b458314e", 1200),
    imageAlt: { en: "Red iced drinks with lime", ar: "مشروبات حمراء مثلجة مع ليمون" },
    dietary: ["vegan", "gluten-free"],
    options: [drinkSize],
  },
  {
    id: "mint-lemonade",
    category: "drinks",
    name: { en: "Frozen Mint Lemonade", ar: "ليموناضة بالنعناع مثلجة" },
    description: {
      en: "The Dubai classic, blended with fresh mint and a touch of orange blossom.",
      ar: "الكلاسيكية الدبوية، ممزوجة بالنعناع الطازج ولمسة من ماء الزهر.",
    },
    price: 32,
    image: unsplash("photo-1551538827-9c037cb4f32a", 1200),
    imageAlt: { en: "Glass of mint lemonade", ar: "كوب ليموناضة بالنعناع" },
    dietary: ["vegan", "gluten-free"],
    options: [drinkSize],
  },
  {
    id: "zero-old-fashioned",
    category: "drinks",
    name: { en: "Ember Old Fashioned (0%)", ar: "أولد فاشند الجمر (0%)" },
    description: {
      en: "Smoked date syrup, black tea, bitters and charred cinnamon.",
      ar: "شراب تمر مدخن وشاي أسود ومر ونكهة القرفة المحروقة.",
    },
    price: 46,
    image: unsplash("photo-1514362545857-3bc16c4c7d1b", 1200),
    imageAlt: { en: "Amber drink in a tumbler", ar: "مشروب كهرماني في كأس" },
    dietary: ["vegan", "gluten-free"],
  },
  {
    id: "date-tahini-shake",
    category: "drinks",
    name: { en: "Date & Tahini Shake", ar: "ميلك شيك التمر والطحينة" },
    description: {
      en: "Medjool dates, tahini, vanilla and a pinch of sea salt.",
      ar: "تمر المجدول والطحينة والفانيليا ورشة من ملح البحر.",
    },
    price: 38,
    image: unsplash("photo-1572490122747-3968b75cc699", 1200),
    imageAlt: { en: "Thick shake in a glass", ar: "ميلك شيك كثيف في كوب" },
    dietary: ["vegetarian", "gluten-free"],
  },
  {
    id: "karak-chai",
    category: "drinks",
    name: { en: "Saffron Karak", ar: "كرك بالزعفران" },
    description: {
      en: "Slow-brewed spiced tea with evaporated milk and saffron.",
      ar: "شاي متبل مطهو ببطء مع الحليب المبخر والزعفران.",
    },
    price: 22,
    image: unsplash("photo-1544787219-7f47ccb76574", 1200),
    imageAlt: { en: "Cup of milky tea with cookies", ar: "كوب شاي بالحليب مع بسكويت" },
    dietary: ["vegetarian", "gluten-free"],
  },
  {
    id: "gahwa",
    category: "drinks",
    name: { en: "Gahwa & Dates", ar: "قهوة عربية وتمر" },
    description: {
      en: "Cardamom Arabic coffee served with a trio of Emirati dates.",
      ar: "قهوة عربية بالهيل تُقدّم مع ثلاثة أنواع من التمر الإماراتي.",
    },
    price: 28,
    image: unsplash("photo-1514432324607-a09d9b4aefdd", 1200),
    imageAlt: { en: "Cup of coffee from above", ar: "فنجان قهوة من الأعلى" },
    dietary: ["vegan", "gluten-free"],
  },
  {
    id: "fresh-orange",
    category: "drinks",
    name: { en: "Fresh Orange & Blossom", ar: "برتقال طازج بماء الزهر" },
    description: {
      en: "Cold-pressed oranges with a whisper of orange blossom water.",
      ar: "برتقال معصور على البارد مع لمسة من ماء الزهر.",
    },
    price: 28,
    image: unsplash("photo-1600271886742-f049cd451bba", 1200),
    imageAlt: { en: "Glass of fresh orange juice", ar: "كوب عصير برتقال طازج" },
    dietary: ["vegan", "gluten-free"],
    options: [drinkSize],
  },
];

export const dishById = new Map(dishes.map((dish) => [dish.id, dish]));

export function getDish(id: string) {
  return dishById.get(id);
}

export const signatureDishIds = [
  "lamb-ouzi",
  "wagyu-ribeye",
  "seafood-machboos",
  "smoked-hummus",
  "pistachio-baklava",
] as const;

export const signatureDishes = signatureDishIds
  .map((id) => dishById.get(id))
  .filter((dish): dish is Dish => Boolean(dish));
