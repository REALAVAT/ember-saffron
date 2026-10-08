import { z } from "zod";
import { eventBudgets, eventTypes, occasions } from "@/data/content";

/** Error messages are translation keys in the `Errors` namespace. */
const name = z.string().trim().min(2, "required").max(80, "max");
const email = z.email("email").trim();
const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s()-]{7,20}$/, "phone");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date");

export const reservationSchema = z.object({
  date: isoDate,
  time: z.string().regex(/^\d{2}:\d{2}$/, "time"),
  guests: z.number().int().min(1, "guests").max(10, "guests"),
  occasion: z.enum(occasions),
  name,
  email,
  phone,
  requests: z.string().trim().max(500, "max"),
});
export type ReservationInput = z.infer<typeof reservationSchema>;

export const eventInquirySchema = z.object({
  name,
  email,
  phone,
  company: z.string().trim().max(120, "max"),
  eventType: z.enum(eventTypes, "required"),
  date: isoDate,
  guests: z.number("eventGuests").int().min(10, "eventGuests").max(1000, "eventGuests"),
  budget: z.enum(eventBudgets, "required"),
  message: z.string().trim().max(1000, "max"),
});
export type EventInquiryInput = z.infer<typeof eventInquirySchema>;

export const checkoutDetailsSchema = z
  .object({
    fulfilment: z.enum(["delivery", "pickup"]),
    name,
    phone,
    email,
    area: z.string().trim().max(80, "max"),
    building: z.string().trim().max(120, "max"),
    apartment: z.string().trim().max(60, "max"),
    instructions: z.string().trim().max(240, "max"),
    timing: z.enum(["asap", "scheduled"]),
    slot: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.fulfilment === "delivery") {
      if (value.area.length < 2) ctx.addIssue({ code: "custom", path: ["area"], message: "required" });
      if (value.building.length < 2)
        ctx.addIssue({ code: "custom", path: ["building"], message: "required" });
    }
    if (value.timing === "scheduled" && !value.slot) {
      ctx.addIssue({ code: "custom", path: ["slot"], message: "slot" });
    }
  });
export type CheckoutDetails = z.infer<typeof checkoutDetailsSchema>;

function luhn(digits: string) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

export const cardSchema = z.object({
  cardName: name,
  cardNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .refine((v) => /^\d{13,19}$/.test(v) && luhn(v), "cardNumber"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "expiry")
    .refine((v) => {
      const [mm, yy] = v.split("/").map(Number);
      const now = new Date();
      const expiryEnd = new Date(2000 + yy, mm, 1);
      return expiryEnd > now;
    }, "expiry"),
  cvc: z.string().regex(/^\d{3,4}$/, "cvc"),
});
export type CardInput = z.input<typeof cardSchema>;

export const orderLineSchema = z.object({
  dishId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
  selections: z.record(z.string(), z.array(z.string())),
});

export const orderRequestSchema = z.object({
  locale: z.enum(["en", "ar"]),
  details: checkoutDetailsSchema,
  lines: z.array(orderLineSchema).min(1).max(50),
  promo: z.string().max(32).nullable(),
  payment: z.enum(["card", "cash", "stripe"]),
  cardLast4: z.string().regex(/^\d{4}$/).optional(),
});
export type OrderRequest = z.infer<typeof orderRequestSchema>;
