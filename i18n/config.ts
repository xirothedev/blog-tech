import type { AbstractIntlMessages } from "next-intl";

import enCommon from "@/messages/en/common.json";
import viCommon from "@/messages/vi/common.json";

export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

type NamespacedMessages = {
	common: AbstractIntlMessages;
};

export const messages: Record<Locale, NamespacedMessages> = {
	en: {
		common: enCommon,
	},
	vi: {
		common: viCommon,
	},
};
