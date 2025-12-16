import { Metadata } from "next";
import siteMetadata from "@/data/siteMetadata";
import type { Locale } from "@/i18n/config";

interface PageSEOProps {
	title: string;
	description?: string;
	image?: string;
	locale?: Locale;
	[key: string]: unknown;
}

export function genPageMetadata({ title, description, image, locale, ...rest }: PageSEOProps): Metadata {
	const metadata = siteMetadata;
	const ogLocale = locale === "vi" ? "vi_VN" : "en_US";

	return {
		title,
		description: description || metadata.description,
		openGraph: {
			title: `${title} | ${metadata.title}`,
			description: description || metadata.description,
			url: "./",
			siteName: metadata.title,
			images: image ? [image] : [siteMetadata.socialBanner],
			locale: ogLocale,
			type: "website",
		},
		twitter: {
			title: `${title} | ${metadata.title}`,
			card: "summary_large_image",
			images: image ? [image] : [siteMetadata.socialBanner],
		},
		...rest,
	};
}
