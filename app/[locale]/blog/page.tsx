import { allCoreContent, sortPosts } from "pliny/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import { genPageMetadata } from "app/seo";
import ListLayout from "@/layouts/ListLayoutWithTags";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

import type { Locale } from "@/i18n/config";

const POSTS_PER_PAGE = 5;

export const metadata: Metadata = genPageMetadata({ title: "Blog" });

export default async function BlogPage({ params }: { params: { locale: string } }) {
	const localeValue = params.locale as Locale;
	setRequestLocale(localeValue);

	const localeBlogs = allBlogs.filter((b) => b.locale === localeValue);
	const sourceBlogs = localeBlogs.length > 0 ? localeBlogs : allBlogs;

	const posts = allCoreContent(
		sortPosts(sourceBlogs).sort((a, b) => {
			const ap = a.pinned ? 1 : 0;
			const bp = b.pinned ? 1 : 0;
			if (ap !== bp) return bp - ap;
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		}),
	).map((p) => ({
		...p,
		pinned: sourceBlogs.find((b) => b._raw.flattenedPath === p.path)?.pinned ?? false,
	}));
	const pageNumber = 1;
	const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
	const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber);
	const pagination = {
		currentPage: pageNumber,
		totalPages: totalPages,
	};

	return (
		<ListLayout posts={posts} initialDisplayPosts={initialDisplayPosts} pagination={pagination} title="All Posts" />
	);
}
