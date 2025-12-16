import { Authors, allAuthors } from "contentlayer/generated";
import { MDXLayoutRenderer } from "pliny/mdx-components";
import AuthorLayout from "@/layouts/AuthorLayout";
import { coreContent } from "pliny/utils/contentlayer";
import { genPageMetadata } from "app/seo";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

export const metadata: Metadata = genPageMetadata({ title: "About" });

export default function Page({ params }: { params: { locale: string } }) {
	setRequestLocale(params.locale);
	const author = allAuthors.find((p) => p.slug === "default") as Authors;
	const mainContent = coreContent(author);

	return (
		<>
			<AuthorLayout content={mainContent}>
				<MDXLayoutRenderer code={author.body.code} />
			</AuthorLayout>
		</>
	);
}
