# Development Workflow Documentation

This document provides comprehensive documentation of the development workflow for the "Xiro The Dev - Blog Tech" project.

## Development Setup and Environment Configuration

### Technology Stack

- **Framework**: Next.js 16.0.4 with React 19.2.0
- **Styling**: Tailwind CSS 4.0.5
- **Content Management**: Contentlayer 2 + MDX
- **Package Manager**: pnpm 10.19.0
- **Language**: TypeScript 5.1.3
- **Runtime**: Node.js 24 (Docker) / Node.js 20 (Dev Container)

### Prerequisites

- Node.js 20+ (recommended 24 for Docker)
- pnpm package manager
- Docker (optional, for containerized development)
- Git for version control

### Installation and Setup

#### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd blog-tech

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

#### Environment Configuration Files

- **`tsconfig.json`**: TypeScript configuration with path aliases
- **`jsconfig.json`**: JavaScript path aliases for IDE support
- **`next.config.js`**: Next.js configuration with security headers and plugins
- **`postcss.config.js`**: PostCSS configuration for Tailwind CSS
- **`contentlayer.config.ts`**: Content processing configuration
- **`eslint.config.mjs`**: Modern ESLint flat configuration
- **`.prettierrc.json`**: Code formatting configuration

### Development Environment Options

#### 1. Local Development

```bash
pnpm dev
```

- **URL**: `http://localhost:3000`
- **Hot Reload**: Enabled
- **TypeScript**: Real-time validation

#### 2. VS Code Dev Container

- **Setup**: Open in VS Code and select "Reopen in Container"
- **Features**:
    - Node.js 20 with pre-installed tools
    - Auto-formats on save
    - Runs ESLint automatically
    - Starts dev server automatically

#### 3. Docker Development

```bash
docker-compose up --build
```

- **Port**: 3000
- **Host**: `0.0.0.0` (for container access)
- **Volume**: Source code mounted for live updates

## Available Scripts and Commands

### Development Scripts

```bash
# Start development server with webpack (recommended)
pnpm dev

# Alternative development server (cross-platform)
pnpm start

# Production server (for testing production build)
pnpm serve
```

### Build Scripts

```bash
# Build production application
pnpm build

# Build with bundle analyzer for optimization
pnpm analyze

# Static export build (for static hosting)
EXPORT=1 UNOPTIMIZED=1 pnpm build
```

### Code Quality Scripts

```bash
# Run ESLint with auto-fix
pnpm lint

# Setup Git hooks (runs automatically on install)
pnpm prepare
```

### Post-build Processing

- **`scripts/postbuild.mjs`**: Generates RSS feeds after build
- **`scripts/rss.mjs`**: Creates RSS feeds for blog posts and tags

## Code Quality Tools

### ESLint Configuration

**File**: `eslint.config.mjs`

**Key Features**:

- Next.js recommended rules
- TypeScript ESLint integration
- JSX accessibility checks
- Prettier integration
- Custom Link component validation

**Important Rules**:

- React 19 automatic JSX conversion
- Accessibility checks for interactive elements
- TypeScript-specific optimizations
- Import/export organization

### Prettier Configuration

**File**: `.prettierrc.json`

**Settings**:

- Tab width: 4
- Print width: 120
- Use tabs: true
- Trailing commas: all
- Tailwind CSS plugin for className formatting

### Lint-staged Configuration

Automatically runs on staged files:

```json
{
	"*.+(js|jsx|ts|tsx)": ["eslint --fix"],
	"*.+(js|jsx|ts|tsx|json|css|md|mdx)": ["prettier --write"]
}
```

### Husky Integration

- **Pre-commit**: Runs ESLint and Prettier on staged files
- **Setup**: Automatically configured via `pnpm prepare`
- **Purpose**: Ensures code quality before commits

## Git Workflow and Hooks

### Branch Strategy

- **Main Branch**: `main` (production branch)
- **Development**: Work on feature branches, merge to main
- **Commit Convention**: Standard commit messages

### Git Hooks

- **Pre-commit**: Automatic linting and formatting
- **Quality Gates**: Prevents poor quality code from being committed
- **Automation**: Runs `lint-staged` for efficiency

### GitHub Actions

**File**: `.github/workflows/ci.yml`

**Features**:

- Docker image building and publishing
- CI pipeline for main branch
- Multi-architecture support (amd64, arm64)

## Testing Strategy

### Current Status

- **No formal tests** currently implemented
- **Manual testing** through development server
- **Browser testing** via local development environment

### Recommended Testing Approach

1. **Unit Tests**: For React components and utility functions
2. **Integration Tests**: For MDX content processing and Contentlayer
3. **E2E Tests**: For critical user workflows (navigation, content rendering)
4. **Performance Tests**: For build optimization and loading speed

### Testing Tools to Consider

- **Jest**: For unit and integration tests
- **React Testing Library**: For component testing
- **Playwright**: For E2E testing
- **Lighthouse CI**: For performance testing

## Development Server Configuration

### Server Details

- **Port**: 3000 (configurable via `PORT` environment variable)
- **Protocol**: HTTP (development), HTTPS (production)
- **Hot Reload**: Enabled with fast refresh
- **Webpack**: Explicitly enabled (Turbopack disabled for compatibility)
- **Host**: `localhost` (local), `0.0.0.0` (Docker)

### Development Features

- **Live Reloading**: Automatic page updates on file changes
- **Error Overlay**: Development error display with stack traces
- **Type Checking**: Real-time TypeScript validation
- **Contentlayer**: MDX processing with hot reload
- **Fast Refresh**: Preserves component state during updates

## Build Process and Optimization

### Build Pipeline

1. **Dependency Installation**: Yarn Berry with immutable installs
2. **Content Processing**: Contentlayer generates TypeScript types from MDX
3. **Next.js Build**: Webpack-based production build with optimizations
4. **Post-build**: RSS feed generation and search indexing
5. **Static Export**: Optional for static hosting platforms

### Build Optimization Features

- **Bundle Analyzer**: Webpack bundle size analysis
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based chunk splitting
- **Tree Shaking**: Dead code elimination
- **Compression**: Built-in gzip and Brotli compression
- **Static Generation**: Pre-rendering of all content

### Docker Multi-stage Build

```dockerfile
# Stage 1: Dependencies
FROM node:24-alpine AS deps
# Install dependencies

# Stage 2: Builder
FROM node:24-alpine AS builder
# Build application

# Stage 3: Runner
FROM node:24-alpine AS runner
# Production server
```

## Debugging and Troubleshooting

### Common Development Issues

#### TypeScript Errors

**Symptoms**: Type errors in VS Code, red underlines
**Solutions**:

- Check `tsconfig.json` path aliases
- Restart TypeScript server in VS Code (`Ctrl+Shift+P` → "TypeScript: Restart")
- Verify installed dependencies

#### ESLint Errors

**Symptoms**: Linting errors in terminal or editor
**Solutions**:

- Run `pnpm lint --fix` for auto-fixable issues
- Check ESLint configuration and rules
- Manually fix remaining issues

#### Contentlayer Issues

**Symptoms**: Build errors related to content processing
**Solutions**:

- Check `contentlayer.config.ts` configuration
- Validate MDX frontmatter structure
- Ensure all required fields are present

#### Build Failures

**Symptoms**: Build process stops with errors
**Solutions**:

- Check for dependency conflicts
- Clear `.next` folder and rebuild
- Verify Node.js version compatibility

### Debug Commands

```bash
# Clear Next.js build cache
rm -rf .next

# Rebuild dependencies
pnpm install --force

# Check for TypeScript errors without emitting
npx tsc --noEmit

# Run linting with detailed output
pnpm lint --verbose

# Check Contentlayer configuration
npx contentlayer build --verbose
```

### Performance Debugging

```bash
# Build with bundle analyzer
pnpm analyze

# Analyze bundle size
open .next/analyze/client.html

# Check build performance
pnpm build --debug
```

## Development Best Practices

### Code Organization

- **Components**: Reusable React components in `/components`
- **Layouts**: Page templates in `/layouts`
- **Data**: Static content in `/data`
- **Utils**: Helper functions in `/libs`
- **Styles**: Tailwind CSS utilities and custom styles in `/css`

### File Naming Conventions

- **Components**: PascalCase (`ComponentName.tsx`)
- **Utilities**: camelCase (`utilityFunction.ts`)
- **Content**: kebab-case (`blog-post-title.mdx`)
- **Pages**: Follow Next.js conventions

### Content Management Best Practices

- **Blog Posts**: `/data/blog/` with MDX files
- **Authors**: `/data/authors/` with author profiles
- **Frontmatter**: Use consistent metadata structure
- **Tags**: Maintain consistent tag naming and categorization

### Performance Optimization

- **Images**: Always use `next/image` component
- **Fonts**: Utilize Next.js font optimization
- **Code Splitting**: Use dynamic imports for heavy components
- **Caching**: Leverage Next.js automatic caching

### Security Practices

- **Content Security Policy**: Configured in `next.config.js`
- **Security Headers**: Comprehensive header configuration
- **Environment Variables**: Use `.env.local` for sensitive data
- **Input Validation**: Rely on MDX content processing

## Local Development Workflow

### Typical Development Process

#### 1. Environment Setup

```bash
# Clone and install
git clone <repository-url>
cd blog-tech
pnpm install

# Start development server
pnpm dev
```

#### 2. Create New Blog Post

```bash
# Create new MDX file with template
cat > "data/blog/new-post.mdx" << EOF
---
title: "New Post Title"
date: $(date +%Y-%m-%d)
tags: ["general"]
summary: "Brief description for SEO and previews"
draft: false
---

# Content here
EOF
```

#### 3. Edit Content

- Write content in MDX format
- Use frontmatter for metadata
- Preview changes in browser automatically
- Test with different themes (light/dark)

#### 4. Code Changes

- Edit React components with hot reload
- Modify styles using Tailwind CSS classes
- Update configuration files as needed

#### 5. Quality Assurance

```bash
# Run code quality checks
pnpm lint

# Build to verify production readiness
pnpm build
```

#### 6. Deploy

```bash
# Push to main branch (triggers CI/CD)
git add .
git commit -m "feat: add new blog post"
git push origin main
```

### Development Shortcuts and Productivity

#### VS Code Integration

- **Format on Save**: Automatically formats code on save
- **ESLint Extension**: Real-time linting feedback
- **Prettier Extension**: Code formatting
- **TypeScript**: Full language support and IntelliSense
- **Tailwind CSS**: Class name suggestions and completion

#### Hot Reloading

- **File Changes**: Automatic page refresh
- **MDX Content**: Real-time content processing
- **CSS Changes**: Live style updates without page refresh
- **Component State**: Preserved during fast refresh

#### Useful VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**: React code snippets
- **Tailwind CSS IntelliSense**: Tailwind class suggestions
- **Markdown All in One**: MDX and Markdown support
- **GitLens**: Enhanced Git integration

### Common Development Tasks

#### Adding New Blog Post

```bash
# Create post with proper structure
cat > "data/blog/new-post.mdx" << EOF
---
title: "Your Post Title"
date: $(date +%Y-%m-%d)
lastmod: $(date +%Y-%m-%d)
tags: ["tag1", "tag2"]
summary: "Concise summary for social media"
authors: ["default"]
draft: false
---

# Introduction

Your content here...
EOF
```

#### Updating Site Metadata

```bash
# Edit site configuration
vim data/siteMetadata.js

# Common updates:
# - Site title and description
# - Social media links
# - Analytics configuration
# - Comment system settings
```

#### Customizing Layouts

```bash
# Modify existing layout
vim layouts/PostLayout.tsx

# Create new layout
cp layouts/PostLayout.tsx layouts/CustomLayout.tsx
# Edit the new layout as needed
```

#### Adding New Components

```bash
# Create new component
cat > components/NewComponent.tsx << EOF
export default function NewComponent() {
  return <div>New Component Content</div>;
}
EOF

# Use in MDX or other components
import NewComponent from '@/components/NewComponent';
```

### Deployment Preparation

#### 1. Final Build Test

```bash
# Build production version
pnpm build

# Test production build locally
pnpm serve
```

#### 2. Static Export (if needed)

```bash
# For static hosting platforms
EXPORT=1 UNOPTIMIZED=1 pnpm build

# Output in /out folder
ls -la out/
```

#### 3. Docker Build

```bash
# Build Docker image
docker build -t blog-tech .

# Test Docker container
docker run -p 3000:3000 blog-tech
```

#### 4. Performance Check

- Run Lighthouse audit in Chrome DevTools
- Check bundle size with `pnpm analyze`
- Verify loading speed and Core Web Vitals
- Test on mobile devices

#### 5. SEO Verification

- Check meta tags and structured data
- Verify sitemap generation
- Test social media sharing cards
- Validate RSS feeds

This comprehensive development workflow provides everything needed to efficiently work with this Next.js blog template, from initial setup to deployment optimization, while maintaining high code quality and performance standards.
