import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { isAppLocale, routing } from "./routing";

export default getRequestConfig(async ({ locale: override }) => {
  const candidate = override ?? (await rootLocale());
  const locale = isAppLocale(candidate) ? candidate : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "Asia/Dubai",
  };
});
