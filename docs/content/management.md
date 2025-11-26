# Content Management System Documentation

This document provides comprehensive documentation of the content management system for the "Xiro The Dev - Blog Tech" project.

## Overview

This documentation site uses a sophisticated content management system built on **Next.js 16** with **Contentlayer 2** and **MDX** processing. The system follows a modern JAMstack architecture with static site generation, type-safe content processing, and comprehensive SEO optimization.

## Contentlayer Configuration and Processing

### Core Configuration (`/contentlayer.config.ts`)

The Contentlayer configuration defines the content types and processing pipeline:

```typescript
export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "blog/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" }, default: [] },
    lastmod: { type: "date" },
    draft: { type: "boolean" },
    pinned: { type: "boolean" },
    summary: { type: "string" },
    images: { type: "json" },
    authors: { type: "list", of: { type: "string" } },
    layout: { type: "string" },
    bibliography: { type: "string" },
    canonicalUrl: { type: "string" },
  },
  computedFields: {
    readingTime: { type: "json", resolve: (doc) => readingTime(doc.body.raw) },
    slug: { type: "string", resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, "") },
    path: { type: "string", resolve: (doc) => doc._raw.flattenedPath },
    filePath: { type: "string", resolve: (doc) => doc._raw.sourceFilePath },
    toc: { type: "json", resolve: (doc) => extractTocHeadings(doc.body.raw) },
    lastmod: { /* auto-calculated from file stats */ },
    structuredData: { type: "json", resolve: (doc) => /* JSON-LD structure */ }
  }
}));

export const Authors = defineDocumentType(() => ({
  name: "Authors",
  filePathPattern: "authors/**/*.mdx",
  contentType: "mdx",
  fields: {
    name: { type: "string", required: true },
    avatar: { type: "string" },
    occupation: { type: "string" },
    company: { type: "string" },
    email: { type: "string" },
    twitter: { type: "string" },
    bluesky: { type: "string" },
    linkedin: { type: "string" },
    github: { type: "string" },
    layout: { type: "string" },
  },
  computedFields,
}));
```

### Processing Pipeline

The MDX processing pipeline transforms raw content into optimized components:

```typescript
export default makeSource({
  contentDirPath: "data",
  documentTypes: [Blog, Authors],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      remarkAlert
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "prepend", content: icon }],
      rehypeKatex,
      rehypeKatexNoTranslate,
      [rehypeCitation, { path: path.join(root, "data") }],
      [rehypePrismPlus, { defaultLanguage: "js", ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    const { allBlogs } = await importData();
    createTagCount(allBlogs);
    createSearchIndex(allBlogs);
  },
});
```

## Data Directory Structure

```
data/
├── authors/                 # Author profiles
│   ├── default.mdx         # Default author (Xiro The Dev)
│   └── singour.mdx         # Guest author (Himanshu Singour)
├── blog/                   # Blog posts organized by category
│   ├── getting-started.mdx
│   ├── how-i-learned-system-design.mdx
│   ├── install-oh-my-posh.mdx
│   ├── udp.mdx
│   ├── ddos-attack.mdx
│   ├── vector-database.mdx
│   ├── vps/                # Nested category for VPS-related content
│   │   ├── deploy-nextjs-vps.mdx
│   │   └── deploy-php-vps.mdx
│   └── vps.mdx
├── references-data.bib      # Bibliography citations
├── headerNavLinks.ts       # Navigation configuration
├── logo.svg                # Site logo asset
├── projectsData.ts         # Project showcase data
├── siteMetadata.js         # Site configuration
└── tag-data.json           # Auto-generated tag taxonomy and counts
```

## Frontmatter Schema and Validation

### Blog Post Schema
```yaml
---
title: "Post Title"                    # Required: Human-readable title
date: "2025-11-10"                    # Required: Publication date (YYYY-MM-DD)
lastmod: "2025-11-10"                  # Optional: Last modification date
tags: ["tag1", "tag2", "tag3"]        # Optional: Content taxonomy
draft: false                          # Optional: Hide from production (default: false)
pinned: true                         # Optional: Pin to top of list
summary: "Brief description"          # Optional: Meta description
images: ["/path/to/image.jpg"]        # Optional: Social media images
authors: ["default", "singour"]       # Optional: Array of author slugs
layout: "PostLayout"                  # Optional: Component layout
bibliography: "references-data.bib"   # Optional: Citation file
canonicalUrl: "https://example.com"  # Optional: Canonical URL
---
```

### Author Schema
```yaml
---
name: "Author Name"                    # Required: Display name
avatar: "/path/to/avatar.png"          # Optional: Profile image
occupation: "Job Title"                # Optional: Professional role
company: "Company Name"                # Optional: Employer
email: "author@example.com"            # Optional: Contact email
twitter: "https://twitter.com/user"    # Optional: Twitter profile
bluesky: "https://bsky.app/profile"    # Optional: Bluesky profile
linkedin: "https://linkedin.com/in/user" # Optional: LinkedIn profile
github: "https://github.com/user"      # Optional: GitHub profile
layout: "AuthorLayout"                 # Optional: Layout component
---
```

## MDX Processing Pipeline

### Remark Plugins (Pre-processing)
- **`remarkExtractFrontmatter`**: Extracts frontmatter from MDX files
- **`remarkGfm`**: GitHub Flavored Markdown support (tables, strikethrough, task lists)
- **`remarkCodeTitles`**: Adds titles to code blocks with language specification
- **`remarkMath`**: LaTeX math equation support
- **`remarkImgToJsx`**: Converts markdown images to optimized JSX components
- **`remarkAlert`**: GitHub-style alert blocks (note, tip, warning, important)

### Rehype Plugins (Post-processing)
- **`rehypeSlug`**: Auto-generates slugs for headings for anchor links
- **`rehypeAutolinkHeadings`**: Adds anchor links to headings with icons
- **`rehypeKatex`**: KaTeX math rendering for equations
- **`rehypeKatexNoTranslate`**: Fixes KaTeX translation issues in headings
- **`rehypeCitation`**: Citation support from bibliography files (.bib format)
- **`rehypePrismPlus`**: Advanced syntax highlighting with Prism
- **`rehypePresetMinify`**: HTML minification for performance

## Content Generation and Type Definitions

### Automatic Type Generation
Contentlayer automatically generates TypeScript types from the configuration:

```typescript
// Generated types available for import
import type { Authors, Blog } from "contentlayer/generated";

// Blog post type structure
export type BlogPost = {
  id: string;
  title: string;
  date: string;
  lastmod?: string;
  tags: string[];
  draft?: boolean;
  pinned?: boolean;
  summary?: string;
  images?: string[];
  authors: string[];
  layout?: string;
  bibliography?: string;
  canonicalUrl?: string;
  slug: string;
  path: string;
  filePath: string;
  readingTime: ReturnType<typeof readingTime>;
  toc: ReturnType<typeof extractTocHeadings>;
  structuredData: any;
  body: {
    raw: string;
    code: string;
  };
  _raw: {
    sourceFilePath: string;
    flattenedPath: string;
    sourceFileDir: string;
  };
};
```

### Content Utility Functions
```typescript
import { allCoreContent, sortPosts, coreContent } from "pliny/utils/contentlayer";

// Filter and sort blog posts
const publishedPosts = allCoreContent(sortPosts(allBlogs));
const recentPosts = publishedPosts.slice(0, 5);
const allTags = publishedPosts.flatMap(post => post.tags);
```

## Tag System and Content Organization

### Automatic Tag Generation
The system automatically generates tag statistics and indexing:

```javascript
async function createTagCount(allBlogs) {
  const tagCount: Record<string, number> = {};
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag);
        tagCount[formattedTag] = (tagCount[formattedTag] || 0) + 1;
      });
    }
  });
  writeFileSync("./app/tag-data.json", formatted);
}
```

### Tag Features
- **Hierarchical Structure**: Tags can be organized in categories
- **Automatic Counting**: Tag usage statistics generated automatically
- **URL-based Navigation**: `/tags/[tag]` pattern for tag pages
- **RSS Feeds**: Individual RSS feeds for each tag category
- **SEO Optimization**: Tag pages with meta descriptions and structured data

### Tag Usage Example
```yaml
---
title: "Understanding TCP vs UDP"
date: "2025-11-17"
tags: ["networking", "protocols", "tutorial", "fundamentals"]
---
```

## Search Functionality

### Local Search with KBar
The system uses KBar for local search with auto-generated index:

```javascript
function createSearchIndex(allBlogs) {
  if (siteMetadata?.search?.provider === "kbar") {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    );
  }
}
```

### Search Features
- **Document Indexing**: Full-text search across all content
- **Metadata Integration**: Search includes titles, summaries, and content
- **Client-side Processing**: Fast search using JavaScript
- **Configuration**: Search path configurable in site metadata
- **Keyboard Navigation**: Keyboard shortcuts for search activation

### Search Configuration
```typescript
// in siteMetadata.js
search: {
  provider: "kbar",
  kbarConfig: {
    searchDocumentsPath: "/search.json",
  },
},
```

## Author Management

### Multi-author Support
- **Author Profiles**: Individual MDX files for each author
- **Content Attribution**: Multiple authors per blog post
- **Author Links**: Social media and contact information
- **Avatar Support**: Profile image integration
- **Author Pages**: Dedicated pages for each author's content

### Author Integration
```typescript
// In blog post rendering
const authorList = post?.authors || ["default"];
const authorDetails = authorList.map((author) => {
  const authorResults = allAuthors.find((p) => p.slug === author);
  return coreContent(authorResults as Authors);
});
```

### Author Metadata
```yaml
---
name: "Xiro"
avatar: "/static/images/avatar/xiro.png"
occupation: "Software Developer"
company: "Tech Company"
email: "xiro@example.com"
twitter: "https://twitter.com/xirodev"
linkedin: "https://linkedin.com/in/xiro"
github: "https://github.com/xiro"
---
```

## Content Features and Extensions

### Mathematical Content
- **LaTeX Support**: Full LaTeX math rendering with KaTeX
- **Inline and Display Math**: `$inline$` and `$$display$$` syntax
- **Math Theme Integration**: Dark/light mode compatible rendering
- **Cross-browser Support**: Consistent math rendering across browsers

#### Math Usage Examples
```markdown
Inline math: $E = mc^2$

Display math:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Citation Support
- **Bibliography Files**: `.bib` file integration with standard BibTeX format
- **Citation Rendering**: Automatic citation formatting
- **Reference Tracking**: Automatic bibliography generation
- **Multiple Citation Styles**: Support for different citation formats

#### Citation Usage
```markdown
Here is some text with a citation [@author2023].

Multiple citations can be used [@author1; @author2].

The bibliography will be automatically generated.
```

### Syntax Highlighting
- **Prism Integration**: Advanced syntax highlighting with 100+ languages
- **Language Detection**: Automatic language detection from code blocks
- **Custom Themes**: Configurable highlighting themes matching site design
- **Line Numbers**: Optional line number display
- **Copy Button**: Built-in code copying functionality

#### Code Block Examples
```markdown
```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```
```

### Multimedia Support
- **Image Optimization**: Next.js Image component integration
- **Video Support**: Custom video component with controls
- **Code Preview**: Interactive code examples
- **Custom Components**: Extensible component system

### GitHub-style Alerts
```markdown
> [!NOTE]
> Useful information that users should know

> [!WARNING]
> Important warning about potential issues

> [!TIP]
> Helpful tips and best practices
```

## SEO and Metadata Handling

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "datePublished": post.date,
  "dateModified": post.lastmod || post.date,
  "description": post.summary,
  "image": post.images?.[0] || siteMetadata.socialBanner,
  "url": `${siteMetadata.siteUrl}/${post._raw.flattenedPath}`,
  "author": authorDetails.map(author => ({
    "@type": "Person",
    "name": author.name
  }))
}
```

### SEO Optimization Features
- **Open Graph Tags**: Social media sharing optimization
- **Twitter Cards**: Enhanced Twitter sharing with cards
- **Canonical URLs**: SEO-friendly URL management
- **Meta Descriptions**: Optimized page descriptions for search engines
- **Image Optimization**: SEO-optimized image handling with alt text
- **Sitemap Generation**: Automatic XML sitemap for search engines
- **RSS Feeds**: Content syndication for subscribers
- **Reading Time**: Estimated reading time for user experience

## Build Process and Static Generation

### Build Pipeline
```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack && node ./scripts/postbuild.mjs",
    "analyze": "ANALYZE=true next build --webpack"
  }
}
```

### Post-build Processing
1. **RSS Generation**: Generate RSS feeds for all content and tags
2. **Sitemap Creation**: Auto-generate XML sitemap for SEO
3. **Static Export**: Prepare for static deployment
4. **Asset Optimization**: Optimize images and static assets
5. **Tag Statistics**: Generate tag usage statistics
6. **Search Index**: Create search index for KBar

### RSS Feed Generation
```javascript
// Generate main RSS feed
const rss = generateRss(siteMetadata, sortPosts(publishPosts));

// Generate tag-specific RSS feeds
for (const tag of Object.keys(tagData)) {
  const filteredPosts = allBlogs.filter(post =>
    post.tags.map(t => slug(t)).includes(tag)
  );
  const rss = generateRss(siteMetadata, filteredPosts, `tags/${tag}/feed.xml`);
}
```

## Content Development Workflow

### Content Creation Process
1. **File Creation**: Create new MDX files in `/data/blog/` directory
2. **Frontmatter Addition**: Add structured metadata to each post
3. **Content Writing**: Write content using Markdown and MDX syntax
4. **Media Management**: Add images and media to `/public/` directory
5. **Local Preview**: Use `npm run dev` for development server
6. **Type Validation**: Contentlayer validates content structure automatically

### Content Organization Best Practices
- **File Naming**: Use kebab-case for filenames (e.g., `getting-started.mdx`)
- **Tag Consistency**: Use consistent tagging across related content
- **Author Attribution**: Always specify authors for content ownership
- **Date Formatting**: Use ISO 8601 date format (YYYY-MM-DD)
- **Summary Writing**: Provide concise summaries for SEO and previews

### Content Features Usage
- **Draft Mode**: Use `draft: true` for content in progress
- **Pinned Content**: Use `pinned: true` for important posts
- **Custom Layouts**: Specify `layout` field for specialized content presentation
- **Citation Management**: Use bibliography files for academic content
- **Math Equations**: Use LaTeX syntax for mathematical content

## Performance Optimization

### Content Optimization
- **Static Generation**: All content pre-rendered at build time
- **Image Optimization**: Automatic image resizing and optimization
- **Code Splitting**: Automatic splitting of content pages
- **Bundle Analysis**: Built-in bundle analyzer for optimization

### SEO Performance
- **Meta Tags**: Optimized meta descriptions and titles
- **Structured Data**: JSON-LD for enhanced search results
- **URL Structure**: Clean, SEO-friendly URLs
- **Page Speed**: Optimized loading times with static generation

This content management system provides a robust, type-safe, and feature-rich platform for technical documentation with excellent SEO optimization, search capabilities, and extensibility options.