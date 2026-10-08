import { cva, type VariantProps } from "class-variance-authority";

export const cta = cva(
  "group/cta relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full font-semibold whitespace-nowrap transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-out select-none focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-saffron disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-saffron text-ink shadow-[0_10px_40px_-12px_rgb(233_180_76/0.6)] hover:bg-saffron-soft",
        ember:
          "bg-ember text-ink shadow-[0_10px_40px_-12px_rgb(232_87_42/0.7)] hover:bg-ember-soft",
        outline:
          "border border-cream/25 bg-white/[0.03] text-cream backdrop-blur-md hover:border-saffron/70 hover:text-saffron",
        ghost: "text-cream hover:bg-white/5",
        link: "rounded-none px-0 text-saffron underline-offset-8 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-[0.95rem]",
        icon: "size-11",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type CtaProps = VariantProps<typeof cta>;
