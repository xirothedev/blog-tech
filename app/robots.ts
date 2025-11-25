import { MetadataRoute } from "next";
import siteMetadata from "@/data/siteMetadata";

// MIGRATED: Removed export const dynamic = "force-static" (incompatible with Cache Components)
// Metadata routes like robots are static by default with Cache Components

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
		host: siteMetadata.siteUrl,
	};
}
