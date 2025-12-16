import { connection } from "next/server";
import { Link } from "@/i18n/routing";
import siteMetadata from "@/data/siteMetadata";
import { getSiteMetadata } from "@/data/getSiteMetadata";
import SocialIcon from "@/components/social-icons";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";

export default async function Footer() {
	// Defer to request-time before using non-deterministic Date per Cache Components requirements
	await connection();
	const currentYear = new Date().getFullYear();
	const locale = (await getLocale()) as Locale;
	const metadata = await getSiteMetadata(locale);
	const t = await getTranslations("common.footer");

	return (
		<footer>
			<div className="mt-16 flex flex-col items-center">
				<div className="mb-3 flex space-x-4">
					<SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
					<SocialIcon kind="github" href={siteMetadata.github} size={6} />
					<SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
					{/* <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} /> */}
					<SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
					{/* <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} /> */}
					{/* <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} /> */}
					{/* <SocialIcon kind="x" href={siteMetadata.x} size={6} /> */}
					{/* <SocialIcon kind="instagram" href={siteMetadata.instagram} size={6} /> */}
					{/* <SocialIcon kind="threads" href={siteMetadata.threads} size={6} /> */}
					{/* <SocialIcon kind="medium" href={siteMetadata.medium} size={6} /> */}
				</div>
				<div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
					<div>{metadata.author}</div>
					<div>{` • `}</div>
					<div>{`© ${currentYear}`}</div>
					<div>{` • `}</div>
					<Link href="https://xirothedev.site">{t("home")}</Link>
				</div>
			</div>
		</footer>
	);
}
