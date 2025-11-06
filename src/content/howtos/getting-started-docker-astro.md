---
title: "Getting Started with Docker and Astro"
description: "Learn how to containerize your Astro application with Docker for easy deployment and development"
date: "04.11.2024"
author: "Tech Team"
published: true
featured: false
tags: ["docker", "astro", "deployment", "beginner"]
image: "https://images.unsplash.com/photo-1605379399843-5870eea9b74e?w=800&h=400&fit=crop"
difficulty: "beginner"
timeRequired: "30 minutes"
---

# Getting Started with Docker and Astro

Docker has revolutionized how we develop and deploy applications. In this guide, we'll walk through containerizing your Astro application step by step.

## Why Docker?

Docker provides several benefits for modern web development:

- **Consistent Environments**: Run your app the same way everywhere
- **Easy Deployment**: Ship your application with all dependencies
- **Isolation**: Keep your development environment clean
- **Scalability**: Easy to scale and manage multiple instances

## Prerequisites

Before we begin, make sure you have:

- Docker installed on your system
- Node.js 18+ (for local development)
- An existing Astro project

## Step 1: Create a Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
# Use Node.js 20 LTS as base image
FROM node:20-bookworm AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the app
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs astro

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN npm ci --only=production

USER astro

EXPOSE 4321
ENV PORT=4321
ENV HOST=0.0.0.0

CMD ["npm", "run", "preview"]
```

## Step 2: Create Docker Compose

Create a `compose.yaml` file for easy development:

```yaml
services:
  astro-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "4321:4321"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## Step 3: Add .dockerignore

Create a `.dockerignore` file to exclude unnecessary files:

```
node_modules
dist
.git
.gitignore
README.md
.env
.nyc_output
coverage
```

## Step 4: Build and Run

Build and start your containerized application:

```bash
# Build and run
docker compose up --build -d

# View logs
docker compose logs -f

# Stop the application
docker compose down
```

## Step 5: Development Workflow

For development, you can mount your source code as a volume:

```yaml
services:
  astro-dev:
    image: node:20-bookworm
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "4321:4321"
    command: npm run dev -- --host 0.0.0.0
```

## Common Issues and Solutions

### Port Already in Use
```bash
# Find process using port 4321
lsof -i :4321

# Kill the process
kill -9 <PID>
```

### Permission Issues
Make sure your Dockerfile creates the proper user and permissions:

```dockerfile
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs astro
USER astro
```

### Build Cache Issues
Clear Docker cache when dependencies change:

```bash
docker system prune -f
docker compose build --no-cache
```

## Next Steps

Now that your Astro app is containerized, you can:

- Deploy to any cloud platform supporting Docker
- Scale your application easily
- Ensure consistent environments across your team
- Simplify your CI/CD pipelines

Happy containerizing! 🐳</content>
<parameter name="filePath">src/content/howtos/getting-started-docker-astro.md