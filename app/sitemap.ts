import { MetadataRoute } from "next";
import { allBlogs } from "contentlayer/generated";
import siteMetadata from "@/data/siteMetadata";

// MIGRATED: Removed export const dynamic = "force-static" (incompatible with Cache Components)
// Metadata routes like sitemap are static by default with Cache Components

export default function sitemap(): MetadataRoute.Sitemap {
	const siteUrl = siteMetadata.siteUrl;

	const blogRoutes = allBlogs
		.filter((post) => !post.draft)
		.map((post) => ({
			url: `${siteUrl}/${post.path}`,
			lastModified: post.lastmod || post.date,
		}));

	const routes = ["", "blog", "projects", "tags"].map((route) => ({
		url: `${siteUrl}/${route}`,
		lastModified: new Date().toISOString().split("T")[0],
	}));

	return [...routes, ...blogRoutes];
}
