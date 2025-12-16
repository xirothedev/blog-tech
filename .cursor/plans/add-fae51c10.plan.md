<!-- fae51c10-7ad9-4cc2-957a-6f921ab7009e 2c6ddb08-7512-4b8f-9cfd-8e98417faac2 -->

# Add next-intl i18n

## Todos

- install-dep: Add next-intl dependency via pnpm
- add-config: Create i18n config/routing/request helpers under `src/i18n`
- add-messages: Add en/vi message JSON namespaces under `src/messages`
- update-nextconfig: Wrap Next config with next-intl plugin (and preserve existing settings)
- add-layouts: Add root `app/layout.tsx` and locale-aware `app/[locale]/layout.tsx` + sample page
- fix-imports: Replace `next/link` / `next/navigation` imports with `@/i18n/routing` equivalents where used
- validate-paths: Ensure TS path alias `@/*` covers `src/*` in `tsconfig.json` (adjust if needed)
