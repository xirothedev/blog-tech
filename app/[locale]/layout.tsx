import type { Metadata } from "next";

import React, { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Analytics, type AnalyticsConfig } from "pliny/analytics";
import { SearchProvider, type SearchConfig } from "pliny/search";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SectionContainer from "@/components/SectionContainer";
import siteMetadata from "@/data/siteMetadata";
import { getSiteMetadata } from "@/data/getSiteMetadata";
import { defaultLocale, type Locale, locales, messages } from "@/i18n/config";
import { ThemeProviders } from "../theme-providers";

interface LocaleLayoutProps {
	children: React.ReactNode;
	params: Promise<{
		locale: string;
	}>;
}

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const localeValue = (locale as Locale) ?? defaultLocale;
	const ogLocale = localeValue === "vi" ? "vi_VN" : "en_US";
	const metadata = await getSiteMetadata(localeValue);

	return {
		metadataBase: new URL(siteMetadata.siteUrl),
		title: {
			default: metadata.title,
			template: `%s | Xiro The Dev`,
		},
		description: metadata.description,
		openGraph: {
			title: metadata.title,
			description: metadata.description,
			url: `/${localeValue}`,
			siteName: metadata.title,
			images: [siteMetadata.socialBanner],
			locale: ogLocale,
			type: "website",
		},
		alternates: {
			canonical: `/${localeValue}`,
			types: {
				"application/rss+xml": `${siteMetadata.siteUrl}/feed.xml`,
			},
			languages: {
				"en-US": "/en",
				"vi-VN": "/vi",
			},
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		twitter: {
			title: metadata.title,
			card: "summary_large_image",
			images: [siteMetadata.socialBanner],
		},
	};
}

async function LocaleContent({ children, params }: LocaleLayoutProps) {
	const resolvedParams = await params;
	const locale = resolvedParams.locale;

	// Ensure we have a valid locale string
	let localeValue: Locale = defaultLocale;
	if (typeof locale === "string" && locales.includes(locale as Locale)) {
		localeValue = locale as Locale;
	}

	setRequestLocale(localeValue);

	const localeMessages = messages[localeValue];

	return (
		<NextIntlClientProvider locale={localeValue} messages={localeMessages}>
			<ThemeProviders>
				<Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
				<VercelAnalytics />
				<SectionContainer>
					<SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
						<Header />
						<main className="mb-auto">{children}</main>
					</SearchProvider>
					<Footer />
				</SectionContainer>
			</ThemeProviders>
		</NextIntlClientProvider>
	);
}

export default function LocaleLayout(props: LocaleLayoutProps) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<LocaleContent {...props} />
		</Suspense>
	);
}
