# Deployment Configuration Documentation

This document provides comprehensive documentation of deployment configurations and options for the "Xiro The Dev - Blog Tech" project.

## Overview

The application supports multiple deployment strategies including Docker containerization, static site generation, and serverless deployment. It's optimized for performance, security, and scalability with comprehensive CI/CD integration.

## Docker Configuration

### Multi-Stage Dockerfile

The application uses a sophisticated multi-stage Docker build process powered by pnpm:

```dockerfile
# syntax=docker.io/docker/dockerfile:1

# ---------- Base image ----------
FROM node:24-alpine AS base

# ---------- Dependencies ----------
FROM base AS deps
# Install libc6-compat for some npm packages
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Copy only package manager files for dependency install
COPY package.json pnpm-lock.yaml* .npmrc* ./
# Enable corepack so pnpm from packageManager is used
RUN corepack enable && pnpm --version && pnpm install --frozen-lockfile

# ---------- Builder ----------
FROM base AS builder
WORKDIR /app
# Bring over dependency artifacts first for better caching
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/package.json ./package.json

# Copy the rest of the source
COPY . .

# Ensure dependencies are fully prepared for this context (inline native builds when needed)
RUN corepack enable && pnpm install --frozen-lockfile

RUN pnpm build

# ---------- Production runner ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: run as non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy only necessary files for production
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# OCI labels for image metadata
LABEL org.opencontainers.image.source="https://github.com/xirothedev/blog-tech"
LABEL org.opencontainers.image.description="Xiro The Dev - Blog Tech"
LABEL org.opencontainers.image.licenses=MIT

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck for container
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start Next.js standalone server
CMD ["node", "server.js"]
```

### Docker Features

**Security & Best Practices**:

- **Non-root User**: Runs as `nextjs` user (UID 1001)
- **Minimal Base**: Alpine Linux for smaller image size
- **Health Checks**: Built-in container health monitoring
- **Immutable Builds**: pnpm for deterministic installs

**Performance Optimizations**:

- **Multi-stage Build**: Smaller final image size
- **Standalone Output**: Optimized production runtime
- **Caching**: Efficient layer caching
- **Static Assets**: Optimized asset serving

### Docker Deployment Commands

```bash
# Build and run locally
docker build -t blog-tech .
docker run -p 3000:3000 blog-tech

# Using Docker Compose
docker-compose up -d

# Multi-architecture build
docker buildx build --platform linux/amd64,linux/arm64 -t blog-tech .

# Production deployment
docker run -d \
  --name blog-tech \
  -p 3000:3000 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  blog-tech
```

## Next.js Deployment Configuration

### Core Configuration

The `next.config.js` file provides comprehensive deployment settings:

```javascript
/* eslint-disable @typescript-eslint/no-require-imports */
const { withContentlayer } = require("next-contentlayer2");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

// Enhanced Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is us.umami.is;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'self' blob: data: *.s3.amazonaws.com;
  connect-src * https://us.umami.is;
  font-src 'self';
  frame-src giscus.app
`;

const securityHeaders = [
	{
		key: "Content-Security-Policy",
		value: ContentSecurityPolicy.replace(/\n/g, ""),
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	{
		key: "X-Frame-Options",
		value: "DENY",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "X-DNS-Prefetch-Control",
		value: "on",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
];

module.exports = () => {
	const plugins = [withContentlayer, withBundleAnalyzer];
	return plugins.reduce((acc, next) => next(acc), {
		output: process.env.EXPORT ? "export" : "standalone",
		basePath: process.env.BASE_PATH || undefined,
		reactStrictMode: true,
		trailingSlash: false,
		pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
		images: {
			remotePatterns: [
				{
					protocol: "https",
					hostname: "picsum.photos",
				},
			],
			unoptimized: process.env.UNOPTIMIZED ? true : undefined,
		},
		async headers() {
			return [
				{
					source: "/(.*)",
					headers: securityHeaders,
				},
			];
		},
		webpack: (config, options) => {
			config.module.rules.push({
				test: /\.svg$/,
				use: ["@svgr/webpack"],
			});
			return config;
		},
		cacheComponents: true,
	});
};
```

### Key Deployment Features

**Output Modes**:

- **Standalone**: Optimized for container deployment
- **Export**: Static site generation for CDN deployment
- **Base Path**: Support for subdirectory deployments

**Security Headers**:

- **CSP**: Comprehensive content security policy
- **HSTS**: HTTPS enforcement
- **Frame Protection**: Clickjacking prevention
- **XSS Protection**: Built-in XSS mitigation

## Environment Variables and Configuration

### Required Environment Variables

```bash
# Analytics Configuration
NEXT_PUBLIC_UMAMI_ID="your-umami-website-id"
NEXT_PUBLIC_GISCUS_REPO="your-github-repo"
NEXT_PUBLIC_GISCUS_REPOSITORY_ID="your-repo-id"
NEXT_PUBLIC_GISCUS_CATEGORY="Q&A"
NEXT_PUBLIC_GISCUS_CATEGORY_ID="your-category-id"

# Newsletter Integration
BUTTONDOWN_API_KEY="your-buttondown-api-key"

# Deployment Configuration
NODE_ENV=production
BASE_PATH="/your-base-path"          # Optional: For subdirectory deployments
EXPORT=false                         # For static export
UNOPTIMIZED=false                    # For image optimization
ANALYZE=false                        # For bundle analysis
```

### Environment-Specific Configuration

**Development Environment**:

```bash
NODE_ENV=development
NEXT_PUBLIC_DEV_MODE=true
```

**Production Environment**:

```bash
NODE_ENV=production
NEXT_PUBLIC_DEV_MODE=false
ENABLE_METRICS=true
ENABLE_ANALYTICS=true
```

**Static Export Environment**:

```bash
EXPORT=true
UNOPTIMIZED=true
NODE_ENV=production
```

## Deployment Options

### 1. Docker Container Deployment

**Recommended for**: Self-hosting, enterprise environments, full control

**Advantages**:

- Complete control over the runtime environment
- Consistent deployment across different platforms
- Easy scaling with orchestration tools
- Built-in security and health checks

**Deployment Steps**:

```bash
# Build image
docker build -t blog-tech .

# Run container
docker run -d \
  --name blog-tech \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_UMAMI_ID=${UMAMI_ID} \
  --restart unless-stopped \
  blog-tech

# Verify deployment
curl http://localhost:3000
```

**Kubernetes Deployment**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: blog-tech
spec:
    replicas: 2
    selector:
        matchLabels:
            app: blog-tech
    template:
        metadata:
            labels:
                app: blog-tech
        spec:
            containers:
                - name: blog-tech
                  image: ghcr.io/xirothedev/blog-tech:latest
                  ports:
                      - containerPort: 3000
                  env:
                      - name: NODE_ENV
                        value: "production"
                  resources:
                      requests:
                          memory: "256Mi"
                          cpu: "250m"
                      limits:
                          memory: "512Mi"
                          cpu: "500m"
```

### 2. Vercel Deployment

**Recommended for**: Serverless deployment, automatic scaling, developer experience

**Advantages**:

- Zero-config deployment
- Automatic scaling and CDN
- Built-in analytics and performance monitoring
- Git integration for CI/CD

**Deployment Steps**:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy with environment variables
vercel --prod -e NEXT_PUBLIC_GISCUS_REPO=your-repo
```

**Vercel Configuration (`vercel.json`)**:

```json
{
	"buildCommand": "pnpm build",
	"outputDirectory": ".next",
	"framework": "nextjs",
	"installCommand": "pnpm install",
	"devCommand": "pnpm dev",
	"functions": {
		"app/api/**/*.ts": {
			"runtime": "nodejs18.x"
		}
	}
}
```

### 3. Static Site Deployment

**Recommended for**: CDN hosting, GitHub Pages, Netlify, high-performance static sites

**Advantages**:

- No server required
- Extremely fast loading times
- Cost-effective hosting
- Global CDN distribution

**Build Process**:

```bash
# Generate static files
EXPORT=true UNOPTIMIZED=1 pnpm build

# Output in /out directory
ls -la out/
```

**Deployment to Netlify**:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=out
```

**Netlify Configuration (`netlify.toml`)**:

```toml
[build]
  publish = "out"
  command = "EXPORT=true UNOPTIMIZED=1 pnpm build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 404

[context.production.environment]
  NODE_ENV = "production"
```

**GitHub Pages Deployment**:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
    push:
        branches: [main]

jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: "24"
            - run: pnpm install
            - run: EXPORT=true UNOPTIMIZED=1 pnpm build
            - uses: peaceiris/actions-gh-pages@v3
              with:
                  github_token: ${{ secrets.GITHUB_TOKEN }}
                  publish_dir: ./out
```

### 4. AWS Deployment

**Recommended for**: Enterprise scale, high availability, integrated AWS services

**AWS ECS Deployment**:

```bash
# Build and push to ECR
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker build -t $ECR_REPOSITORY .
docker push $ECR_REPOSITORY

# Create ECS service
aws ecs create-service \
  --cluster blog-tech \
  --service-name blog-tech \
  --task-definition blog-tech-task \
  --desired-count 2
```

**AWS S3 + CloudFront** (Static):

```bash
# Deploy to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

## CI/CD Pipeline

### GitHub Actions Configuration

The project includes a streamlined CI/CD pipeline:

```yaml
name: CI & Docker Publish

on:
    push:
        branches:
            - main

jobs:
    build-and-push:
        runs-on: ubuntu-latest
        permissions:
            contents: read
            packages: write

        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Set up QEMU
              uses: docker/setup-qemu-action@v3

            - name: Set up Docker Buildx
              uses: docker/setup-buildx-action@v3

            - name: Log in to GitHub Container Registry
              uses: docker/login-action@v3
              with:
                  registry: ghcr.io
                  username: ${{ github.actor }}
                  password: ${{ secrets.GITHUB_TOKEN }}

            - name: Extract metadata (tags, labels)
              id: meta
              uses: docker/metadata-action@v5
              with:
                  images: ghcr.io/xirothedev/blog-tech

            - name: Build and push Docker image
              uses: docker/build-push-action@v5
              with:
                  context: .
                  file: ./Dockerfile
                  push: true
                  tags: |
                      ghcr.io/xirothedev/blog-tech:latest
                      ghcr.io/xirothedev/blog-tech:${{ github.sha }}
                  labels: ${{ steps.meta.outputs.labels }}

            # Optional: add test step here if you have tests
            # - name: Run tests
            #   run: pnpm test
```

### Pipeline Features

**Container Registry Integration**:

- **GitHub Container Registry**: Automatic Docker image publishing to `ghcr.io/xirothedev/blog-tech`
- **Tag Management**: Latest and SHA-based tags for version control
- **OCI Labels**: Standard container metadata for better management

**Build Optimization**:

- **pnpm**: Modern package manager with immutable installs
- **Multi-Stage Builds**: Optimized Docker images with minimal attack surface
- **BuildKit**: Enhanced Docker build performance and caching

**Security Features**:

- **Non-root Container**: Application runs as non-privileged user (UID 1001)
- **Health Checks**: Automated container health monitoring
- **Minimal Base Image**: Alpine Linux for reduced attack surface
- **No Secrets in Image**: Secure secret management through environment variables

**Future Enhancements**:

- **Multi-Architecture Support**: Ready for AMD64/ARM64 builds with Buildx
- **Quality Gates**: Placeholder for testing and security scanning steps
- **Deployment Automation**: Ready for automated deployment workflows

## Security Configuration

### Production Security Headers

The application implements comprehensive security headers:

```javascript
const securityHeaders = [
	{
		key: "Content-Security-Policy",
		value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is us.umami.is; style-src 'self' 'unsafe-inline'; img-src * blob: data:; media-src 'self' blob: data: *.s3.amazonaws.com; connect-src * https://us.umami.is; font-src 'self'; frame-src giscus.app",
	},
	{
		key: "Referrer-Policy",
		value: "strict-origin-when-cross-origin",
	},
	{
		key: "X-Frame-Options",
		value: "DENY",
	},
	{
		key: "X-Content-Type-Options",
		value: "nosniff",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=31536000; includeSubDomains",
	},
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
];
```

### Content Security Policy (CSP)

**Environment-Specific CSP**:

```javascript
const getCSP = (env) => {
	const baseCSP = [
		"default-src 'self'",
		"script-src 'self' 'unsafe-eval' 'unsafe-inline'",
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob: *.s3.amazonaws.com",
		"media-src 'self' blob: data: *.s3.amazonaws.com",
		"connect-src 'self' https://us.umami.is",
		"font-src 'self'",
		"frame-src 'self' giscus.app",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'",
	];

	if (env === "production") {
		baseCSP.push("upgrade-insecure-requests");
		baseCSP.push("report-uri /csp-violation-report-endpoint");
	}

	return baseCSP.join("; ");
};
```

### Security Best Practices

**Container Security**:

- **Non-root User**: Application runs as non-privileged user
- **Minimal Base**: Alpine Linux reduces attack surface
- **Health Checks**: Automated health monitoring
- **No Secrets**: No hardcoded secrets in images

**Application Security**:

- **CSP**: Prevents XSS and injection attacks
- **HTTPS Enforcement**: Redirects HTTP to HTTPS
- **Frame Protection**: Prevents clickjacking
- **Input Validation**: MDX content sanitization

## Performance Optimization

### Build Optimizations

**Bundle Analysis**:

```bash
# Analyze bundle size
pnpm analyze

# Results in .next/analyze/
```

**Image Optimization**:

```javascript
images: {
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
}
```

**Static Asset Caching**:

```javascript
async headers() {
  return [
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/(.*\\.(jpg|jpeg|png|gif|webp|avif|svg|ico))',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

### Monitoring and Analytics

**Built-in Analytics**:

- **Umami Analytics**: Privacy-focused analytics
- **Vercel Analytics**: Performance monitoring
- **Giscus**: Comment system analytics

**Performance Monitoring**:

```javascript
// Performance monitoring configuration
const monitoring = {
	enabled: process.env.ENABLE_MONITORING === "true",
	sampleRate: 0.1, // 10% of users
	metrics: ["FCP", "LCP", "FID", "CLS"],
};
```

## Deployment Commands

### Quick Reference

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server
pnpm analyze                # Analyze bundle size

# Docker
docker build -t blog-tech . # Build Docker image
docker run -p 3000:3000 blog-tech  # Run container

# Static Export
EXPORT=true pnpm build      # Generate static files

# Production
NODE_ENV=production pnpm build  # Production build
```

### Environment-Specific Builds

```bash
# Development Build
NODE_ENV=development pnpm build

# Production Build
NODE_ENV=production pnpm build

# Static Build
EXPORT=true NODE_ENV=production pnpm build

# Docker Multi-Arch Build
docker buildx build --platform linux/amd64,linux/arm64 -t blog-tech .
```

## Troubleshooting

### Common Deployment Issues

**Build Failures**:

```bash
# Clear build cache
rm -rf .next

# Rebuild dependencies
pnpm install --force

# Check TypeScript errors
npx tsc --noEmit
```

**Docker Issues**:

```bash
# Check container logs
docker logs blog-tech

# Debug container
docker exec -it blog-tech sh

# Rebuild without cache
docker build --no-cache -t blog-tech .
```

**Performance Issues**:

```bash
# Analyze bundle size
pnpm analyze

# Check build performance
pnpm build --debug

# Monitor runtime performance
pnpm start --experimental-debug-mode
```

This comprehensive deployment configuration provides you with multiple deployment options, robust security measures, performance optimizations, and monitoring capabilities for production deployments across various platforms.
