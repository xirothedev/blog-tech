import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const supportedLocales = routing.locales;
const defaultLocale = routing.defaultLocale ?? "vi";

function detectLocaleFromHeader(request: NextRequest): string {
	const header = request.headers.get("accept-language");

	if (!header) {
		return defaultLocale;
	}

	const languages = header
		.split(",")
		.map((part) => part.split(";")[0]?.trim())
		.filter(Boolean);

	for (const lang of languages) {
		const base = lang.split("-")[0];

		if (supportedLocales.includes(lang as (typeof supportedLocales)[number])) {
			return lang;
		}

		if (supportedLocales.includes(base as (typeof supportedLocales)[number])) {
			return base;
		}
	}

	return defaultLocale;
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Skip API and Next internals
	if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.match(/\.(.*)$/)) {
		return NextResponse.next();
	}

	// If path already includes a supported locale, just continue
	const segments = pathname.split("/").filter(Boolean);
	const firstSegment = segments[0];

	if (firstSegment && supportedLocales.includes(firstSegment as (typeof supportedLocales)[number])) {
		return NextResponse.next();
	}

	const locale = detectLocaleFromHeader(request);

	const redirectUrl = new URL(`/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`, request.url);

	// No cookie is set here; redirection is purely header-based.
	return NextResponse.redirect(redirectUrl);
}

export const config = {
	matcher: ["/((?!api|_next|.*\\..*).*)"],
};
