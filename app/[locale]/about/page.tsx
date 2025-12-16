import { Authors, allAuthors } from "contentlayer/generated";
import { MDXLayoutRenderer } from "pliny/mdx-components";
import AuthorLayout from "@/layouts/AuthorLayout";
import { coreContent } from "pliny/utils/contentlayer";
import { genPageMetadata } from "app/seo";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const localeValue = locale as Locale;
	const t = await getTranslations({ locale: localeValue, namespace: "common.about" });
	return genPageMetadata({ title: t("title"), locale: localeValue });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	const localeValue = locale as Locale;
	setRequestLocale(localeValue);

	// Find author by locale
	// default.vi.mdx has slug "default.vi"
	// default.mdx has slug "default"
	let author: Authors | undefined;

	if (localeValue === "vi") {
		// Find default.vi.mdx by slug "default.vi"
		author = allAuthors.find((p) => p.slug === "default.vi") as Authors;

		// Fallback: try by file path if slug doesn't match
		if (!author) {
			author = allAuthors.find((p) => {
				const sourcePath = p._raw.sourceFilePath || "";
				return sourcePath.includes("default.vi.mdx");
			}) as Authors;
		}
	} else {
		// For "en" locale, find default.mdx by slug "default"
		author = allAuthors.find((p) => p.slug === "default") as Authors;

		// Fallback: try by file path (must not have .vi or .en suffix)
		if (!author) {
			author = allAuthors.find((p) => {
				const sourcePath = p._raw.sourceFilePath || "";
				return (
					sourcePath.includes("default.mdx") &&
					!sourcePath.includes(".vi.mdx") &&
					!sourcePath.includes(".en.mdx")
				);
			}) as Authors;
		}
	}

	// Final fallback: try default.vi first, then default
	if (!author) {
		author = allAuthors.find((p) => p.slug === "default.vi") as Authors;
		if (!author) {
			author = allAuthors.find((p) => p.slug === "default") as Authors;
		}
	}

	if (!author) {
		throw new Error("No default author found");
	}

	const mainContent = coreContent(author);

	return (
		<>
			<AuthorLayout content={mainContent}>
				<MDXLayoutRenderer code={author.body.code} />
			</AuthorLayout>
		</>
	);
}
