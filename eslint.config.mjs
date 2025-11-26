import nextTypescript from "eslint-config-next/typescript";
import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const overrideAnchorIsValid = (configs) =>
	configs.map((config) => {
		if (!config.rules?.["jsx-a11y/anchor-is-valid"]) {
			return config;
		}

		return {
			...config,
			rules: {
				...config.rules,
				"jsx-a11y/anchor-is-valid": [
					"error",
					{
						components: ["Link"],
						specialLink: ["hrefLeft", "hrefRight"],
						aspects: ["invalidHref", "preferButton"],
					},
				],
			},
		};
	});

const nextConfigs = overrideAnchorIsValid(next);
const nextCoreWebVitalsConfigs = overrideAnchorIsValid(nextCoreWebVitals);

// eslint-disable-next-line import/no-anonymous-default-export
export default [
	...nextTypescript,
	{
		ignores: [".contentlayer/**"],
	},
	js.configs.recommended,
	...compat.extends("plugin:@typescript-eslint/eslint-recommended"),
	...compat.extends("plugin:@typescript-eslint/recommended"),
	...compat.extends("plugin:prettier/recommended"),
	...nextConfigs,
	...nextCoreWebVitalsConfigs,
	{
		plugins: {
			"@typescript-eslint": typescriptEslint,
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.amd,
				...globals.node,
			},

			parser: tsParser,
			ecmaVersion: 5,
			sourceType: "commonjs",

			parserOptions: {
				project: true,
				tsconfigRootDir: __dirname,
			},
		},

		rules: {
			"prettier/prettier": "off",
			"react/react-in-jsx-scope": "off",
			"react-hooks/set-state-in-effect": "off",

			"react/prop-types": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"react/no-unescaped-entities": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-var-requires": "off",
			"@typescript-eslint/ban-ts-comment": "off",
		},
	},
];
