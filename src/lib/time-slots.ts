const TIME_ZONE = "Asia/Dubai";

function partsInDubai(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function upcomingDates(now: Date, count: number) {
  const { date } = partsInDubai(now);
  return Array.from({ length: count }, (_, i) => addDays(date, i));
}

export function todayIso(now: Date) {
  return partsInDubai(now).date;
}

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

function range(start: number, end: number, step = 30) {
  const out: number[] = [];
  for (let m = start; m <= end; m += step) out.push(m);
  return out;
}

export interface ReservationSlot {
  time: string;
  period: "lunch" | "dinner";
  available: boolean;
}

/** Deterministic pseudo-availability so the demo feels like a live booking system. */
function isBooked(date: string, time: string) {
  let hash = 0;
  for (const char of date + time) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 7 === 0;
}

export function reservationSlots(isoDate: string, now: Date): ReservationSlot[] {
  const { date: today, minutes: nowMinutes } = partsInDubai(now);
  const cutoff = isoDate === today ? nowMinutes + 60 : -1;
  const lunch = range(12 * 60, 15 * 60).map((m) => ({ m, period: "lunch" as const }));
  const dinner = range(18 * 60, 23 * 60).map((m) => ({ m, period: "dinner" as const }));
  return [...lunch, ...dinner].map(({ m, period }) => {
    const time = toTime(m);
    return { time, period, available: m > cutoff && !isBooked(isoDate, time) };
  });
}

export interface OrderSlot {
  value: string;
  date: string;
  time: string;
}

export function orderSlots(now: Date): OrderSlot[] {
  const { date: today, minutes } = partsInDubai(now);
  const start = Math.ceil((minutes + 60) / 30) * 30;
  const open = 12 * 60;
  const close = 23 * 60;
  const slots: OrderSlot[] = [];
  for (const m of range(Math.max(start, open), close)) {
    slots.push({ value: `${today}T${toTime(m)}`, date: today, time: toTime(m) });
  }
  const tomorrow = addDays(today, 1);
  for (const m of range(open, close)) {
    slots.push({ value: `${tomorrow}T${toTime(m)}`, date: tomorrow, time: toTime(m) });
  }
  return slots;
}

export function formatDay(isoDate: string, locale: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-AE" : "en-GB", {
    timeZone: "UTC",
    ...options,
  }).format(new Date(`${isoDate}T12:00:00Z`));
}
