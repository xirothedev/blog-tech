import TOCInline from "pliny/ui/TOCInline";
import Pre from "pliny/ui/Pre";
import BlogNewsletterForm from "pliny/ui/BlogNewsletterForm";
import type { MDXComponents } from "mdx/types";
import Image from "./Image";
import TableWrapper from "./TableWrapper";
import Video from "./Video";
import VPSDecisionChecker from "./VPSDecisionChecker";
import GitHubSourceLink from "./GitHubSourceLink";
import { Link } from "@/i18n/routing";

export const components: MDXComponents = {
	Image,
	TOCInline,
	a: Link,
	pre: Pre,
	table: TableWrapper,
	BlogNewsletterForm,
	Video,
	VPSDecisionChecker,
	GitHubSourceLink,
};
