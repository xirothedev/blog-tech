import headerNavLinks from "@/data/headerNavLinks";
import siteMetadata from "@/data/siteMetadata";
import { Link } from "@/i18n/routing";
import MobileNav from "./MobileNav";
import SearchButton from "./SearchButton";
import ThemeSwitch from "./ThemeSwitch";
import LanguageToggle from "./LanguageToggle";
import { cn } from "@/libs/utils";

const Header = () => {
	let headerClass = cn(
		"flex items-center w-full justify-between py-4 px-5 mt-4",
		// Glass/blurred translucent background
		"supports-[backdrop-filter]:backdrop-blur-md backdrop-saturate-150 bg-white/60 dark:bg-gray-900/30",
		// More pronounced border and glass edge
		"border border-white/40 dark:border-white/20 shadow-[0_1px_0_0_rgba(255,255,255,0.10)_inset,0_8px_24px_rgba(0,0,0,0.12)]",
		// Shape
		"rounded-full",
	);
	if (siteMetadata.stickyNav) {
		headerClass = cn(headerClass, "sticky top-4 z-50");
	}

	return (
		<header className={headerClass}>
			<Link href="/" aria-label={siteMetadata.headerTitle}>
				<div className="flex items-center justify-between">
					{typeof siteMetadata.headerTitle === "string" ? (
						<div className="hidden text-2xl font-semibold sm:block">{siteMetadata.headerTitle}</div>
					) : (
						siteMetadata.headerTitle
					)}
				</div>
			</Link>
			<div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
				<div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
					{headerNavLinks
						.filter((link) => link.href !== "/")
						.map((link) => (
							<Link
								key={link.title}
								href={link.href}
								className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
							>
								{link.title}
							</Link>
						))}
				</div>
				<SearchButton />
				<LanguageToggle />
				<ThemeSwitch />
				<MobileNav />
			</div>
		</header>
	);
};

export default Header;
