import "server-only";

const dubaiDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Dubai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function todayInDubai() {
  return dubaiDate.format(new Date());
}

export function addDays(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isDateWithin(isoDate: string, maxDaysAhead: number) {
  const today = todayInDubai();
  return isoDate >= today && isoDate <= addDays(today, maxDaysAhead);
}
