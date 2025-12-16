import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";
import { defaultLocale, messages, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
	const cookieStore = await cookies();
	const cookieLocale = cookieStore.get("locale")?.value as Locale | undefined;

	const locale = (cookieLocale || requestLocale || routing.defaultLocale) as Locale;

	return {
		locale,
		messages: messages[locale] ?? messages[defaultLocale],
	};
});
