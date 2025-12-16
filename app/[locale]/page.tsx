import { sortPosts, allCoreContent } from "pliny/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import Main from "../Main";

interface PageProps {
	params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
	const { locale } = await params;
	const localeValue = locale as Locale;
	setRequestLocale(localeValue);

	const sortedPosts = sortPosts(allBlogs).sort((a, b) => {
		const ap = a.pinned ? 1 : 0;
		const bp = b.pinned ? 1 : 0;
		if (ap !== bp) return bp - ap;
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	const posts = allCoreContent(sortedPosts).map((p) => ({
		...p,
		pinned: sortedPosts.find((b) => b._raw.flattenedPath === p.path)?.pinned ?? false,
	}));

	return <Main posts={posts} />;
}
