"use client";

import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { gallery } from "@/data/content";
import { localize } from "@/lib/i18n-data";

interface GalleryLightboxProps {
  index: number | null;
  direction: number;
  onClose: () => void;
  onStep: (step: number) => void;
}

export function GalleryLightbox({ index, direction, onClose, onStep }: GalleryLightboxProps) {
  const t = useTranslations("Gallery");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const rtl = locale === "ar";
  const total = gallery.length;
  const current = index === null ? null : gallery[index];

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onStep(rtl ? -1 : 1);
      if (event.key === "ArrowLeft") onStep(rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onStep, rtl]);

  return (
    <Dialog open={index !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        closeLabel={tc("close")}
        className="h-[100dvh] max-h-none w-screen max-w-none rounded-none border-0 bg-ink/95 p-0 ring-0 sm:max-w-none"
      >
        {current && index !== null && (
          <div className="relative flex h-full w-full flex-col">
            <DialogTitle className="sr-only">{localize(current.alt, locale)}</DialogTitle>
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <m.div
                  key={index}
                  custom={direction}
                  initial={{ opacity: 0, x: (rtl ? -1 : 1) * direction * 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: (rtl ? 1 : -1) * direction * 80 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.4}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) onStep(rtl ? -1 : 1);
                    else if (info.offset.x > 80) onStep(rtl ? 1 : -1);
                  }}
                  className="absolute inset-4 sm:inset-16"
                >
                  <Image
                    src={current.src}
                    alt={localize(current.alt, locale)}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    draggable={false}
                  />
                </m.div>
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-between gap-4 px-6 pb-6">
              <p className="text-sm text-smoke" aria-live="polite">
                <span className="text-cream">{localize(current.alt, locale)}</span> —{" "}
                {t("counter", { current: index + 1, total })}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onStep(-1)}
                  aria-label={tc("previous")}
                  className="grid size-12 place-items-center rounded-full border border-white/15 text-cream transition-colors hover:border-saffron hover:text-saffron"
                >
                  <ChevronLeft className="size-5 rtl:rotate-180" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onStep(1)}
                  aria-label={tc("next")}
                  className="grid size-12 place-items-center rounded-full border border-white/15 text-cream transition-colors hover:border-saffron hover:text-saffron"
                >
                  <ChevronRight className="size-5 rtl:rotate-180" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
