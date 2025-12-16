import { notFound } from "next/navigation";

import { type Locale } from "@/i18n/config";

interface SlugPageProps {
	params: Promise<{
		locale: Locale;
		slug: string[];
	}>;
}

export default async function SlugPage({ params }: SlugPageProps) {
	await params;
	// Catch-all route: any unmatched paths should show 404
	notFound();
}
