"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** Total travel distance in percent of the frame. */
  strength?: number;
  preload?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  strength = 14,
  preload,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength / 2}%`, `${strength / 2}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <m.div
        className="absolute inset-x-0"
        style={{
          y: reduce ? 0 : y,
          top: `-${strength / 2}%`,
          bottom: `-${strength / 2}%`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className={cn("object-cover", imageClassName)}
        />
      </m.div>
    </div>
  );
}
