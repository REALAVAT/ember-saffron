import { useLocale } from "next-intl";
import { Sparkle } from "lucide-react";

const words = {
  en: ["Oak fire", "Saffron", "Gulf seafood", "Levantine mezze", "Slow lamb", "Rose & pistachio"],
  ar: ["نار البلوط", "زعفران", "مأكولات الخليج البحرية", "مزة شامية", "لحم مطهو ببطء", "ورد وفستق"],
};

export function Marquee() {
  const locale = useLocale() as keyof typeof words;
  const items = [...words[locale], ...words[locale]];

  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-ink-2 py-6" aria-hidden="true" dir="ltr">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((word, index) => (
              <span key={`${copy}-${index}`} className="flex items-center" dir="auto">
                <span className="display px-8 text-3xl text-cream/85 italic sm:text-4xl">{word}</span>
                <Sparkle className="size-5 text-saffron" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
