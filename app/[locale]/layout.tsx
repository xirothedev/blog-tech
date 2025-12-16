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

	return {
		metadataBase: new URL(siteMetadata.siteUrl),
		title: {
			default: siteMetadata.title,
			template: `%s | Xiro The Dev`,
		},
		description: siteMetadata.description,
		openGraph: {
			title: siteMetadata.title,
			description: siteMetadata.description,
			url: `/${localeValue}`,
			siteName: siteMetadata.title,
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
			title: siteMetadata.title,
			card: "summary_large_image",
			images: [siteMetadata.socialBanner],
		},
	};
}

async function LocaleContent({ children, params }: LocaleLayoutProps) {
	const { locale } = await params;
	const localeValue = (locale as Locale) ?? defaultLocale;

	setRequestLocale(localeValue);

	if (!locales.includes(localeValue)) {
		return <>{children}</>;
	}

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
