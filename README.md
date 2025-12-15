![Xiro The Dev - Blog Tech](/public/static/images/twitter-card.png)

# Xiro The Dev - Blog Tech

A modern Next.js 16 blogging application built with TypeScript, Tailwind CSS, and MDX content management. Features enterprise-grade security, near-perfect Lighthouse scores, and comprehensive developer experience tools.

[![GitHub stars](https://img.shields.io/github/stars/xirothedev/blog-tech?style=social)](https://github.com/xirothedev/blog-tech/stargazers/)
[![GitHub forks](https://img.shields.io/github/forks/xirothedev/blog-tech?style=social)](https://github.com/xirothedev/blog-tech/forks)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xirothedev/blog-tech)

## Overview

This is "Xiro The Dev - Blog Tech", a sophisticated blogging platform built with Next.js 16 App Router architecture. It leverages React Server Components, Contentlayer 2 for MDX processing, and modern web development best practices to deliver exceptional performance and developer experience.

The project includes advanced features such as mathematical equation support, citation management, interactive components, and comprehensive SEO optimization.

## Key Features

### 🚀 Performance & Architecture

- **Next.js 16.x.x** with App Router and React Server Components
- **React 19.2.0** with React Strict Mode
- **TypeScript** with full type safety
- **Yarn Berry** for modern package management
- **Static Site Generation** with optional server-side features
- **Near-perfect Lighthouse scores** (95+ performance)

### 🎨 Design & User Experience

- **Tailwind CSS 4.0.5** for modern styling
- **Dark/Light theme** with system preference detection
- **Mobile-responsive design** with mobile-first approach
- **Custom typography** with Space Grotesk and Inter fonts
- **Smooth animations** and transitions

### 📝 Content Management

- **MDX support** with advanced plugins
- **Contentlayer 2** for type-safe content processing
- **Mathematical equations** via KaTeX
- **Syntax highlighting** with Prism Plus
- **Citation support** with bibliography management
- **GitHub-style alerts** and blockquotes
- **Multi-author support** with author profiles

### 🔍 Search & Navigation

- **Kbar command palette** for keyboard navigation
- **Tag-based organization** with automatic tag pages
- **RSS feeds** for content syndication
- **Sitemap generation** for SEO

### 💬 Interactivity

- **Giscus comments** powered by GitHub discussions
- **Interactive components** (VPS Decision Checker, etc.)
- **Newsletter integration** with Buttondown
- **Social media integration** with custom icons

### 🔒 Security & SEO

- **Comprehensive Content Security Policy**
- **Security headers** (HSTS, XSS protection, etc.)
- **SEO optimization** with structured data
- **Open Graph** and Twitter Card support
- **Canonical URL management**

## Technology Stack

### Core Framework

- **Next.js 16.0.4** - React framework with App Router
- **React 19.2.0** - UI library with Server Components
- **TypeScript** - Type safety and developer experience

### Styling & UI

- **Tailwind CSS 4.0.5** - Utility-first CSS framework
- **Prism Plus** - Advanced syntax highlighting
- **KaTeX** - Mathematical equation rendering

### Content Processing

- **Contentlayer 2** - MDX content management
- **Pliny** - Blog-specific utilities and features
- **Remark/Rehype** - Markdown processing pipeline

### Development Tools

- **ESLint** - Code quality and linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Yarn Berry** - Package management

## Project Structure

```bash
/home/xiro/workspace/blog-tech/
├── app/                    # Next.js App Router pages
├── components/            # Reusable React components
├── layouts/               # Layout components for content types
├── data/                  # Static data and content (MDX files)
├── public/                # Static assets
├── scripts/               # Build and utility scripts
├── css/                   # Global styles and Tailwind
├── docs/                  # Project documentation
└── .contentlayer/         # Generated content types
```

## Quick Start

1. **Clone the repository**

    ```bash
    git clone https://github.com/xirothedev/blog-tech.git
    cd blog-tech
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Configure environment variables**

    ```bash
    cp .env.example .env.local
    # Edit .env.local with your configuration
    ```

4. **Start development server**

    ```bash
    pnpm dev
    ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### Site Metadata

Edit `data/siteMetadata.js` to configure:

- Site title and description
- Author information
- Social media links
- Analytics configuration
- Comment system settings

### Content Management

- **Blog posts**: Add `.mdx` files to `data/blog/`
- **Authors**: Create author profiles in `data/authors/`
- **Projects**: Update `data/projectsData.ts`

### Navigation

Edit `data/headerNavLinks.ts` to customize the navigation menu.

## Content Creation

### Adding Blog Posts

1. Create a new `.mdx` file in `data/blog/`
2. Add frontmatter with required fields:

    ```yaml
    ---
    title: "Your Post Title"
    date: "2025-11-26"
    tags: ["tag1", "tag2"]
    authors: ["default"]
    summary: "Brief description for SEO"
    ---
    ```

3. Write your content using Markdown and MDX syntax

### Advanced Features

**Mathematical Content:**

```markdown
Inline math: $E = mc^2$

Display math:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

**Citations:**

```markdown
Here is some text with a citation [@author2023].
```

**Interactive Components:**

```markdown
<VPSDecisionChecker />
```

## Deployment

### Docker Deployment

```bash
# Build and run
docker build -t blog-tech .
docker run -p 3000:3000 blog-tech
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Static Export

```bash
EXPORT=true UNOPTIMIZED=1 pnpm build
# Deploy the `out` folder to any static hosting service
```

### Environment Variables

```bash
# Analytics
NEXT_PUBLIC_UMAMI_ID="your-umami-website-id"

# Comments
NEXT_PUBLIC_GISCUS_REPO="your-github-repo"
NEXT_PUBLIC_GISCUS_REPOSITORY_ID="your-repo-id"
NEXT_PUBLIC_GISCUS_CATEGORY="Q&A"
NEXT_PUBLIC_GISCUS_CATEGORY_ID="your-category-id"

# Newsletter
BUTTONDOWN_API_KEY="your-buttondown-api-key"
```

## Development Commands

```bash
# Development
pnpm dev              # Start development server with webpack
pnpm start            # Start production server

# Build & Deploy
pnpm build           # Build for production with post-processing
pnpm serve           # Start production server
pnpm analyze         # Build with bundle analyzer

# Code Quality
pnpm lint            # Run ESLint with auto-fix
pnpm prepare         # Setup husky hooks
```

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Architecture Overview](docs/architecture/overview.md)** - System architecture and design patterns
- **[Component Architecture](docs/components/architecture.md)** - React components and layout system
- **[Content Management](docs/content/management.md)** - MDX processing and content workflow
- **[Deployment Configuration](docs/deployment/configuration.md)** - Deployment options and security setup
- **[Development Workflow](docs/development/workflow.md)** - Development practices and tooling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Tailwind Next.js Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) as a foundation
- Enhanced with modern Next.js 16 features and enterprise-grade practices
- Icons by [Simple Icons](https://simpleicons.org/)
- Typography optimized for readability and performance

---

**Xiro The Dev** - Sharing knowledge about software development, system design, and technology trends.

[Website](https://xirothedev.com) | [GitHub](https://github.com/xirothedev)
