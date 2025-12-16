import { slug } from "github-slugger";
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer";
import siteMetadata from "@/data/siteMetadata";
import ListLayout from "@/layouts/ListLayoutWithTags";
import { allBlogs } from "contentlayer/generated";
import tagData from "app/tag-data.json";
import { genPageMetadata } from "app/seo";
import { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import { setRequestLocale } from "next-intl/server";

const POSTS_PER_PAGE = 5;

export async function generateMetadata(props: { params: Promise<{ locale: string; tag: string }> }): Promise<Metadata> {
	const params = await props.params;
	const tag = decodeURI(params.tag);
	const canonicalPath = `/${params.locale}/tags/${tag}`;
	return genPageMetadata({
		title: tag,
		description: `${siteMetadata.title} ${tag} tagged content`,
		alternates: {
			canonical: canonicalPath,
			types: {
				"application/rss+xml": `${siteMetadata.siteUrl}${canonicalPath}/feed.xml`,
			},
		},
	});
}

export const generateStaticParams = async () => {
	const tagCounts = tagData as Record<string, number>;
	const tagKeys = Object.keys(tagCounts);
	return locales.flatMap((locale) =>
		tagKeys.map((tag) => ({
			locale,
			tag: encodeURI(tag),
		})),
	);
};

export default async function TagPage(props: { params: Promise<{ locale: string; tag: string }> }) {
	const params = await props.params;
	const localeValue = params.locale as Locale;
	setRequestLocale(localeValue);
	const tag = decodeURI(params.tag);
	const title = tag[0].toUpperCase() + tag.split(" ").join("-").slice(1);
	const localeBlogs = allBlogs.filter((post) => post.locale === localeValue);
	const sourceBlogs = localeBlogs.length > 0 ? localeBlogs : allBlogs;

	const filteredPosts = allCoreContent(
		sortPosts(sourceBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag))),
	);
	const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
	const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE);
	const pagination = {
		currentPage: 1,
		totalPages: totalPages,
	};

	return (
		<ListLayout
			posts={filteredPosts}
			initialDisplayPosts={initialDisplayPosts}
			pagination={pagination}
			title={title}
		/>
	);
}
