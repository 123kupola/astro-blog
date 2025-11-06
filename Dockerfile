# Use Node.js 22 LTS as base image (required for Astro 5 and latest packages)
FROM node:22-bookworm AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY . .

# Force a clean install to bust any corrupted cache.
RUN npm ci

# Set environment variables for build
ENV SITE_URL=http://localhost:4321
ENV SITE_NAME="Astro Modular Demo"
ENV SITE_DESCRIPTION="A flexible blog theme designed for Obsidian users"

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run astro
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Upgrade npm to latest
RUN npm install -g npm@latest

# Create a non-root user and set up directories in one layer
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs --home /home/astro astro && \
    mkdir -p /home/astro && \
    chown astro:nodejs /home/astro

# Change ownership of /app to astro user (faster than recursive chown on node_modules)
RUN chown astro:nodejs /app

# Switch to astro user early
USER astro

# Copy package files and install dependencies as astro user
COPY --chown=astro:nodejs package.json package-lock.json* ./
RUN npm ci --cache /tmp/.npm

# Copy the built application
COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/.astro ./.astro

# Clean up npm cache to reduce image size
RUN rm -rf /tmp/.npm

# Set home directory
ENV HOME=/home/astro

# Expose the port the app runs on
EXPOSE 4321

# Set the host to 0.0.0.0 to allow external connections
ENV HOST=0.0.0.0
ENV PORT=4321

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4321', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "run", "preview"]