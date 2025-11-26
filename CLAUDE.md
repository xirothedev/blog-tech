# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Xiro The Dev - Blog Tech", a Next.js 16 blogging application built with the Tailwind Next.js Starter Blog template. It's a TypeScript-based blog with MDX content management, modern SEO features, and enterprise-grade security.

## Development Commands

```bash
# Development
yarn dev              # Start development server with webpack
yarn start            # Start production server

# Build & Deploy
yarn build           # Build for production with post-processing
yarn serve           # Start production server
yarn analyze         # Build with bundle analyzer

# Code Quality
yarn lint            # Run ESLint with auto-fix
yarn prepare         # Setup husky hooks
```

## Architecture & Structure

### Core Technologies
- **Next.js 16.0.4** with App Router and React Server Components
- **React 19.2.0** with React Strict Mode
- **TypeScript** with path aliases (`@/` for root)
- **Tailwind CSS 4.0.5** for styling
- **Contentlayer 2** for MDX content processing

### Key Directories
- `/app/` - Next.js App Router pages and API routes
- `/components/` - Reusable React components
- `/layouts/` - Blog layout components (PostLayout, ListLayout, etc.)
- `/data/` - Content files (blog posts, authors, site metadata)
- `/css/` - Stylesheets (Tailwind, Prism for syntax highlighting)
- `/scripts/` - Build scripts (RSS generation post-build)

### Content Management
- **MDX Support** with advanced plugins (GFM, KaTeX math, Prism syntax highlighting)
- **Content Sources:** `/data/blog/` for posts, `/data/authors/` for author profiles
- **Auto-generated** tag system and search index
- **Contentlayer Configuration** in `contentlayer.config.ts` handles MDX transformation

### Features & Integrations
- **Analytics:** Umami Analytics (US region)
- **Comments:** Giscus for GitHub-based comments
- **Search:** Kbar command palette search
- **SEO:** Automatic sitemap, RSS feed, structured data
- **Performance:** Near-perfect Lighthouse scores, image optimization

## Development Practices

### Code Quality Tools
- **ESLint** with TypeScript, React, and accessibility rules
- **Prettier** with Tailwind CSS plugin
- **Husky** for pre-commit hooks
- **lint-staged** for automated formatting

### Important Configuration
- `next.config.js` - Contains security headers, CSP, and Contentlayer config
- `tsconfig.json` - Path aliases: `@/components/*`, `@/app/*`, etc.
- `eslint.config.mjs` - Modern ESLint flat config
- **Package Manager:** Yarn Berry (v3.6.1)

### Git Workflow
- Pre-commit hooks run `lint-staged` for auto-formatting
- No testing framework currently configured

## Content Creation

### Adding Blog Posts
1. Create `.mdx` files in `/data/blog/`
2. Use frontmatter with: title, date, tags, authors, etc.
3. MDX supports math equations, citations, and GitHub alerts
4. Contentlayer automatically processes and indexes content

### Supported Features
- Math equations via KaTeX (`$$` blocks)
- Citations and bibliography support
- Syntax highlighting with Prism Plus
- GitHub-flavored markdown with alerts/blockquotes

## Deployment

### Primary Options
- **Vercel** (recommended)
- **Docker** with multi-stage builds
- **GitHub Pages** workflow included
- **Static export** capability

### Performance Optimizations
- Webpack bundling (Turbopack disabled for compatibility)
- Component caching enabled
- Bundle analysis tools available
- Static generation with ISR support

## Security Considerations

- Comprehensive Content Security Policy configured
- Security headers (CSP, HSTS, X-Frame-Options)
- Non-root Docker user in containerization
- Environment variables for sensitive configuration