"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

const LanguageToggle = () => {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const handleLanguageToggle = () => {
		router.push(pathname, {
			locale: locale === "en" ? "vi" : "en",
			scroll: false,
		});
	};

	return (
		<button
			type="button"
			aria-label="Toggle language"
			onClick={handleLanguageToggle}
			className="hover:text-primary-500 dark:hover:text-primary-400 flex cursor-pointer items-center justify-center font-medium text-gray-900 dark:text-gray-100"
		>
			{locale === "en" ? "VI" : "EN"}
		</button>
	);
};

export default LanguageToggle;
