import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import siteMetadataBase from "./siteMetadata";

/**
 * Get site metadata with i18n support
 * @param locale - The locale to get metadata for (can be string or Locale type)
 * @returns Site metadata with translated fields
 */
export async function getSiteMetadata(locale?: Locale | string) {
	if (!locale || (locale !== "en" && locale !== "vi")) {
		// If no locale provided or invalid locale, return base metadata (for backward compatibility)
		return siteMetadataBase;
	}

	const t = await getTranslations({ locale: locale as Locale, namespace: "common.siteMetadata" });

	return {
		...siteMetadataBase,
		title: t("title"),
		author: t("author"),
		headerTitle: t("headerTitle"),
		description: t("description"),
	};
}

/**
 * Get site metadata synchronously (for client components)
 * This requires passing translations directly
 */
export function getSiteMetadataSync(title: string, author: string, headerTitle: string, description: string) {
	return {
		...siteMetadataBase,
		title,
		author,
		headerTitle,
		description,
	};
}
