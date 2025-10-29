# syntax=docker.io/docker/dockerfile:1

# ---------- Base image ----------
FROM node:24-alpine AS base

# ---------- Dependencies ----------
FROM base AS deps
# Install libc6-compat for some npm packages
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Copy only package manager files for dependency install (Yarn Berry)
COPY package.json yarn.lock* .npmrc* .yarnrc.yml* ./
COPY .yarn/ ./.yarn/
# Enable corepack so yarn@berry from packageManager is used
RUN corepack enable && yarn --version && yarn install --immutable

# ---------- Builder ----------
FROM base AS builder
WORKDIR /app
# Yarn Berry installs to .yarn/cache; no node_modules by default unless nodeLinker: node-modules
COPY --from=deps /app/.yarn/ ./.yarn/
COPY --from=deps /app/.pnp.* ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

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
