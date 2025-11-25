import { NewsletterAPI } from "pliny/newsletter";
import siteMetadata from "@/data/siteMetadata";

// MIGRATED: Removed export const dynamic = "force-static" (incompatible with Cache Components)
// Route handlers are dynamic by default with Cache Components

const handler = NewsletterAPI({
	// @ts-ignore
	provider: siteMetadata.newsletter.provider,
});

export { handler as GET, handler as POST };
