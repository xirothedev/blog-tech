"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { Comments as CommentsComponent } from "pliny/comments";
import siteMetadata from "@/data/siteMetadata";

export default function Comments({ slug }: { slug: string }) {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// When mounted on client, now we can show the UI
	useEffect(() => setMounted(true), []);

	const commentsConfig = useMemo(() => {
		if (!siteMetadata.comments?.provider) {
			return null;
		}

		// Create a copy of the comments config
		const config = { ...siteMetadata.comments };

		// Update giscus theme based on current resolved theme
		if (config.provider === "giscus" && config.giscusConfig) {
			config.giscusConfig = {
				...config.giscusConfig,
				// Use the resolved theme (dark or light) or fallback to the default theme
				theme: mounted && resolvedTheme === "dark"
					? config.giscusConfig.darkTheme || "dark"
					: config.giscusConfig.theme || "light",
			};
		}

		return config;
	}, [mounted, resolvedTheme]);

	if (!commentsConfig) {
		return null;
	}

	// Use resolvedTheme as key to force re-mount when theme changes
	// This ensures giscus iframe gets recreated with the correct theme
	const themeKey = mounted && resolvedTheme ? resolvedTheme : "light";

	return <CommentsComponent key={themeKey} commentsConfig={commentsConfig} slug={slug} />;
}
