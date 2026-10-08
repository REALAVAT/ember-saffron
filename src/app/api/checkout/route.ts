import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { getDish } from "@/data/menu";
import { describeSelectionsPlain } from "@/lib/order-text";
import { computeTotals, unitPrice, validateSelections } from "@/lib/pricing";
import { orderRequestSchema } from "@/lib/schemas";
import { createReference } from "@/lib/server/ids";

function etaFor(fulfilment: "delivery" | "pickup") {
  return fulfilment === "delivery" ? 45 : 20;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = orderRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid", issues: z.flattenError(parsed.error) }, { status: 400 });
  }

  const order = parsed.data;
  for (const line of order.lines) {
    const dish = getDish(line.dishId);
    if (!dish || !validateSelections(dish, line.selections)) {
      return NextResponse.json({ ok: false, error: "invalid_item", dishId: line.dishId }, { status: 400 });
    }
  }

  const totals = computeTotals(order.lines, order.details.fulfilment, order.promo);
  if (totals.subtotal < siteConfig.ordering.minimumOrder) {
    return NextResponse.json({ ok: false, error: "minimum" }, { status: 400 });
  }

  const orderId = createReference("ORD");
  const etaMinutes = etaFor(order.details.fulfilment);
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (order.payment === "stripe") {
    if (!stripeKey) {
      return NextResponse.json({ ok: false, error: "stripe_unavailable" }, { status: 400 });
    }
    const stripe = new Stripe(stripeKey);
    const origin = request.headers.get("origin") ?? siteConfig.url;
    const locale = order.locale;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.lines.map((line) => {
      const dish = getDish(line.dishId)!;
      const extras = describeSelectionsPlain(dish, line.selections, locale);
      return {
        quantity: line.quantity,
        price_data: {
          currency: "aed",
          unit_amount: Math.round(unitPrice(dish, line.selections) * 100),
          product_data: {
            name: dish.name[locale],
            ...(extras ? { description: extras } : {}),
            images: [dish.image],
          },
        },
      };
    });
    if (totals.deliveryFee > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "aed",
          unit_amount: Math.round(totals.deliveryFee * 100),
          product_data: { name: locale === "ar" ? "رسوم التوصيل" : "Delivery fee" },
        },
      });
    }

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (totals.discount > 0 && totals.promo) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(totals.discount * 100),
        currency: "aed",
        duration: "once",
        name: totals.promo,
      });
      discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      discounts,
      customer_email: order.details.email,
      locale: locale === "ar" ? "auto" : "en",
      success_url: `${origin}/${locale}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/checkout`,
      metadata: {
        orderId,
        fulfilment: order.details.fulfilment,
        slot: order.details.timing === "scheduled" ? order.details.slot : "asap",
        phone: order.details.phone,
      },
    });

    return NextResponse.json({ ok: true, mode: "stripe", url: session.url, orderId, totals, etaMinutes });
  }

  // Demo mode: card details never leave the browser; only the last four digits are echoed back.
  await new Promise((resolve) => setTimeout(resolve, 900));
  return NextResponse.json({ ok: true, mode: "demo", orderId, totals, etaMinutes });
}
