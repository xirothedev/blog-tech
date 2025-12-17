import ListLayout from "@/layouts/ListLayoutWithTags";
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { setRequestLocale } from "next-intl/server";

const POSTS_PER_PAGE = 5;

export const generateStaticParams = async () =>
	locales.flatMap((locale) => {
		const localeBlogs = allBlogs.filter((b) => b.locale === (locale as Locale));
		const sourceBlogs = localeBlogs.length > 0 ? localeBlogs : allBlogs;
		const totalPages = Math.ceil(sourceBlogs.length / POSTS_PER_PAGE);
		return Array.from({ length: totalPages }, (_, i) => ({ locale, page: (i + 1).toString() }));
	});

export default async function Page({ params }: { params: Promise<{ locale: string; page: string }> }) {
	const { locale, page } = await params;

	const localeValue = locale as Locale;
	setRequestLocale(localeValue);

	const localeBlogs = allBlogs.filter((b) => b.locale === localeValue);
	const sourceBlogs = localeBlogs.length > 0 ? localeBlogs : allBlogs;

	const posts = allCoreContent(sortPosts(sourceBlogs));
	const pageNumber = parseInt(page);
	const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

	// Return 404 for invalid page numbers or empty pages
	if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
		return notFound();
	}
	const initialDisplayPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber);
	const pagination = {
		currentPage: pageNumber,
		totalPages: totalPages,
	};

	return (
		<ListLayout posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} title="All Posts" />
	);
}
