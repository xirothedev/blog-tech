# Component Architecture Documentation

This document provides a comprehensive overview of the component architecture for the "Xiro The Dev - Blog Tech" project.

## Component Organization and Structure

### Directory Structure

```bash
/components/
├── MDXComponents.tsx          # Central MDX component registry
├── LayoutWrapper.tsx         # Main layout wrapper
├── Header.tsx                # Navigation header
├── Footer.tsx                # Footer component
├── Image.tsx                 # Enhanced Image component
├── Tag.tsx                   # Tag component
├── SectionContainer.tsx      # Container wrapper
├── PageTitle.tsx             # Page title component
├── TableWrapper.tsx          # Table wrapper for MDX
├── Video.tsx                 # Video component for MDX
├── VPSDecisionChecker.tsx   # Interactive decision checker
├── GitHubSourceLink.tsx      # GitHub link component
├── Comments.tsx              # Comments component
├── ScrollTopAndComment.tsx   # Scroll utilities
├── SearchButton.tsx          # Search button
├── ThemeSwitch.tsx           # Theme switcher
├── MobileNav.tsx             # Mobile navigation
├── social-icons/             # Social media icons
│   ├── icons.tsx            # Individual social platform icons
│   └── index.tsx            # Social icons aggregator
└── Card.tsx                  # Card component for content display

/layouts/
├── PostLayout.tsx            # Blog post layout with sidebar
├── ListLayout.tsx            # Blog listing layout
├── ListLayoutWithTags.tsx    # Tag-based listing layout
├── PostBanner.tsx            # Featured post banner
├── PostSimple.tsx            # Simple post layout
└── AuthorLayout.tsx          # Author page layout
```

## Layout Hierarchy and Structure

### Main Layout Hierarchy

```bash
app/layout.tsx (Root Layout)
├── ThemeProviders (theme-providers.tsx)
├── Analytics (Vercel + Pliny)
├── SectionContainer (outer container)
│   ├── Header (header with nav)
│   ├── main (content area)
│   │   ├── Page-specific layouts
│   │   │   ├── PostLayout.tsx
│   │   │   ├── ListLayout.tsx
│   │   │   └── Custom layouts
│   │   └── MDX content components
│   └── Footer (social links, copyright)
└── SearchProvider (search functionality)
```

### Layout Wrapper Pattern

The `LayoutWrapper` component serves as the root layout wrapper, providing the fundamental page structure:

```typescript
export default function LayoutWrapper({ children }) {
  return (
    <SectionContainer>
      <div className={`${inter.className} flex h-screen flex-col justify-between font-sans`}>
        <Header />
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  );
}
```

### Post Layout Structure

Blog posts use a sophisticated layout with sidebar and content areas:

```typescript
<PostLayout>
  ├── ScrollTopAndComment (floating actions)
  ├── article
  │   ├── header (date, title)
  │   ├── grid layout
  │   │   ├── author info sidebar
  │   │   ├── main content (MDX children)
  │   │   └── footer (tags, navigation)
  └── GitHub source link
</PostLayout>
```

## Server vs Client Component Architecture

### Server Components (Default)

**Purpose**: Static content, data fetching, SEO optimization
**Characteristics**: No interactivity, can use `await`, better performance

**Examples**:

- `Footer.tsx` - Uses server-side `connection()` for data
- `PostLayout.tsx` - Receives props from parent components
- `LayoutWrapper.tsx` - Static layout structure
- `PageTitle.tsx` - Simple content display

### Client Components (Explicit `"use client"`)

**Purpose**: State management, user interactions, browser APIs
**Characteristics**: Can use React hooks, handle events, browser-specific features

**Examples**:

- `ThemeSwitch.tsx` - Theme switching with `useTheme` hook
- `MobileNav.tsx` - Menu visibility state management
- `VPSDecisionChecker.tsx` - Interactive questionnaire logic
- `Comments.tsx` - Dynamic comments based on theme
- `ScrollTopAndComment.tsx` - Scroll position-based behavior

## MDX Component System

### Central MDX Registry

The `MDXComponents.tsx` file serves as a central registry for custom MDX components:

```typescript
export const components: MDXComponents = {
	Image,
	TOCInline,
	a: CustomLink,
	pre: Pre,
	table: TableWrapper,
	BlogNewsletterForm,
	Video,
	VPSDecisionChecker,
	GitHubSourceLink,
};
```

### Custom MDX Components

#### Image Component

Enhanced with Next.js Image optimization:

- Automatic sizing and optimization
- Responsive image loading
- Performance improvements

#### Link Component

Smart link handling:

- Internal vs external link detection
- Anchor link handling
- Security attributes

#### TableWrapper

Adds responsive behavior to tables:

- Horizontal scrolling for wide tables
- Mobile-friendly table display
- Consistent styling

#### Interactive Components

- `VPSDecisionChecker` - Interactive decision-making tool
- `Video` - Custom video player with controls
- `GitHubSourceLink` - Direct repository linking

### MDX Usage Pattern

```markdown
<!-- In MDX files -->

![Alt text](/path/to/image.jpg)

<!-- Automatically becomes: -->
<Image src="/path/to/image.jpg" alt="Alt text" />

[Link text](https://example.com)

<!-- Becomes: -->

<CustomLink href="https://example.com">Link text</CustomLink>

<VPSDecisionChecker />
<!-- Interactive component embedded directly -->
```

## Interactive Component

### Theme Switch Component

Client component handling theme switching with persistence:

```typescript
const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleToggle = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <button onClick={handleToggle}>
      {mounted ? (resolvedTheme === "dark" ? <Moon /> : <Sun />) : <Blank />}
    </button>
  );
};
```

### Mobile Navigation Component

Sophisticated mobile navigation with body scroll lock:

```typescript
const MobileNav = () => {
  const [navShow, setNavShow] = useState(false);
  const navRef = useRef(null);

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        enableBodyScroll(navRef.current);
      } else {
        disableBodyScroll(navRef.current);
      }
      return !status;
    });
  };

  return (
    <Transition appear show={navShow}>
      <Dialog onClose={onToggleNav}>
        <DialogPanel className="fixed inset-0 z-70 h-full w-full bg-white/95 dark:bg-gray-950/98">
          <nav ref={navRef} className="h-full overflow-y-auto">
            {/* Navigation links */}
          </nav>
        </DialogPanel>
      </Dialog>
    </Transition>
  );
};
```

### VPS Decision Checker

Complex interactive component with scoring system:

```typescript
const VPSDecisionChecker = () => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});

  const handleAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const calculateScore = () => {
    // Scoring logic based on answers
    const weightedAnswers = Object.entries(answers).map(([id, answer]) => {
      const question = questions.find((q) => q.id === id);
      return question && answer !== null ? question.weight * (answer ? 1 : 0) : 0;
    });
    return weightedAnswers.reduce((sum, score) => sum + score, 0);
  };

  return (
    <div className="decision-checker">
      {questions.map((q) => (
        <Question key={q.id} question={q} onAnswer={handleAnswer} />
      ))}
      <Recommendation score={score} />
    </div>
  );
};
```

## State Management Architecture

### 1. Local Component State

**Theme State**: Managed by `next-themes` library
**Navigation State**: React `useState` for mobile menu
**Form State**: Local state for interactive components
**Scroll State**: `useState` and `useEffect` for scroll position

### 2. Props-Based Data Flow

```typescript
interface PostLayoutProps {
	content: CoreContent<Blog>;
	authorDetails: CoreContent<Authors>[];
	next?: { path: string; title: string };
	prev?: { path: string; title: string };
	children: ReactNode; // MDX content
}
```

### 3. Context-Based State

```typescript
// Theme context from next-themes
const { theme, setTheme, resolvedTheme } = useTheme();

// Search context from pliny/search
<SearchProvider searchConfig={siteMetadata.search}>
  {children}
</SearchProvider>
```

## Design System and Patterns

### Typography System

- **Primary Font**: Space Grotesk with CSS variable integration
- **Fallback Font**: Inter for system compatibility
- **Font Loading**: Optimized with `display: swap`

### Color System

- **Theme-based**: CSS variables for light/dark mode
- **Primary Colors**: Blue-based accent system
- **Grayscale**: Consistent gray scale for text hierarchy
- **Semantic Colors**: Success/warning/error state colors

### Component Patterns

#### Container Pattern

`SectionContainer` provides consistent max-width and centering:

```typescript
<div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
  {children}
</div>
```

#### Layout Pattern

`LayoutWrapper` ensures consistent page structure:

- Header navigation
- Main content area
- Footer with social links

#### Button Pattern

Consistent styling across interactive elements:

- Hover states
- Focus management
- Accessibility features

### Responsive Design Patterns

```typescript
// Mobile-first approach
<div className="hidden sm:flex md:max-w-72 lg:max-w-96">
  {/* Responsive sizing */}
</div>

// Mobile-specific components
<MobileNav className="sm:hidden" />
```

## Component Communication

### 1. Parent-Child Communication

```typescript
// Props passing
<Header
  title={siteMetadata.headerTitle}
  navLinks={headerNavLinks}
/>

// Event handlers
<MobileNav onToggle={handleNavToggle} />
```

### 2. Configuration-Based Sharing

```typescript
// Centralized configuration
export const siteMetadata = {
  title: "Xiro The Dev - Blog Tech",
  theme: "system",
  headerTitle: "Xiro",
  headerNavLinks: [
    { href: "/", title: "Home" },
    { href: "/blog", title: "Blog" },
    // ...
  ],
};

// Components consume configuration
<Footer metadata={siteMetadata} />
```

### 3. Server-to-Client Data Transfer

- **Content Data**: Passed via props from page components
- **Metadata**: From `siteMetadata` configuration
- **Static Props**: Next.js data fetching methods
- **Environment Variables**: Processed server-side, consumed client-side

## Performance Optimization

### 1. Image Optimization

```typescript
<Image
  src={src}
  alt={alt}
  fill
  sizes="(max-width: 1280px) 100vw, 1280px"
  className="h-full w-full object-cover"
  priority
/>
```

### 2. Code Splitting

- Dynamic imports for heavy components
- Client components marked with `"use client"`
- Suspense boundaries for loading states

### 3. Lazy Loading

- Images lazy loaded by default
- Components loaded on demand
- Scroll-based lazy loading

## Accessibility Features

### 1. Semantic HTML

- Proper heading hierarchy (h1-h6)
- ARIA labels where needed
- Semantic form elements
- Role attributes for custom components

### 2. Keyboard Navigation

- Tab navigation support
- Keyboard event handling
- Focus management in mobile menu
- Skip links for screen readers

### 3. Screen Reader Support

- `sr-only` classes for visually hidden content
- ARIA labels for interactive elements
- Proper alt text for images
- Descriptive link text

### 4. Theme Accessibility

- Dynamic theme switching
- Color contrast compliance
- Focus state visibility
- Reduced motion support

## Usage Patterns and Examples

### Layout Usage

```typescript
// Root layout
<LayoutWrapper>
  <PostLayout content={post} authorDetails={authors}>
    <MDXContent />
  </PostLayout>
</LayoutWrapper>

// Blog listing
<ListLayout posts={posts} title="All Posts">
  {/* Posts displayed here */}
</ListLayout>
```

### Interactive Component Usage

```typescript
// Theme switcher
<ThemeSwitch />

// Interactive decision tool
<VPSDecisionChecker />

// Mobile navigation
<MobileNav />
```

### MDX Content Integration

````markdown
---
title: "My Blog Post"
date: "2023-12-01"
---

![Feature image](/images/feature.jpg)

## Introduction

Here's some content with [links](https://example.com) and images.

<Video src="/videos/demo.mp4" />

<VPSDecisionChecker />

## Code Example

```javascript
console.log("Hello World");
```
````

````markdown
## Configuration and Theming

### Site Metadata Configuration

```typescript
const siteMetadata = {
	title: "Xiro The Dev - Blog Tech",
	author: "Xiro",
	theme: "system",
	analytics: {
		umamiAnalytics: {
			umamiWebsiteId: process.env.NEXT_UMAMI_ID,
		},
	},
	search: {
		provider: "kbar",
		kbarConfig: {
			searchDocumentsPath: "/search.json",
		},
	},
	comments: {
		provider: "giscus",
		giscusConfig: {
			// Giscus configuration
		},
	},
};
```
````

### Theme Configuration

- System preference detection
- Manual theme switching
- Persistent theme storage (localStorage)
- Theme-aware components

### Navigation Configuration

```typescript
const headerNavLinks = [
	{ href: "/", title: "Home" },
	{ href: "/blog", title: "Blog" },
	{ href: "/tags", title: "Tags" },
	{ href: "/about", title: "About" },
];
```

This component architecture demonstrates a well-structured, scalable Next.js blog system with clear separation of concerns, proper client-server component usage, and excellent developer experience features including MDX integration and interactive components.
