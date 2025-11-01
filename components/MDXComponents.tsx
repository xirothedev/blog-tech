import TOCInline from "pliny/ui/TOCInline";
import Pre from "pliny/ui/Pre";
import BlogNewsletterForm from "pliny/ui/BlogNewsletterForm";
import type { MDXComponents } from "mdx/types";
import Image from "./Image";
import CustomLink from "./Link";
import TableWrapper from "./TableWrapper";
import Video from "./Video";
import VPSDecisionChecker from "./VPSDecisionChecker";

export const components: MDXComponents = {
	Image,
	TOCInline,
	a: CustomLink,
	pre: Pre,
	table: TableWrapper,
	BlogNewsletterForm,
	Video,
	VPSDecisionChecker,
};
