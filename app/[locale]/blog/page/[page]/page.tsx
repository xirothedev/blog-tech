import ListLayout from "@/layouts/ListLayoutWithTags";
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import { setRequestLocale } from "next-intl/server";

const POSTS_PER_PAGE = 5;

export const generateStaticParams = async () =>
	locales.flatMap((locale) => {
		const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE);
		return Array.from({ length: totalPages }, (_, i) => ({ locale, page: (i + 1).toString() }));
	});

export default async function Page({ params }: { params: { locale: string; page: string } }) {
	setRequestLocale(params.locale);
	const posts = allCoreContent(sortPosts(allBlogs));
	const pageNumber = parseInt(params.page);
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
