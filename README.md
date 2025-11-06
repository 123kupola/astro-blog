# Astro Blog with Obsidian Integration

A modern, full-featured blog built with Astro, featuring seamless Obsidian integration for content management, Docker deployment, and multilingual support.

## 🚀 Features

- **Modern Tech Stack**: Astro + TypeScript + Tailwind CSS
- **Content Management**: Obsidian integration with automated sync
- **Docker Ready**: Production deployment with Docker Compose
- **Multilingual**: English and Slovenian content support
- **SEO Optimized**: Built-in sitemap, RSS, and meta tags
- **Search**: Pagefind integration for fast content search
- **Admin Panel**: Content management dashboard
- **API Ready**: Authentication and content APIs

## 📚 Content

### Blog Posts (6 articles)
- **Astro Modular Demo Overview** - Complete project introduction
- **Complete Astro Docker Guide** - Docker setup and deployment
- **Docker Astro Production Guide** - Production deployment strategies
- **GitHub SSH Setup Guide** - Secure GitHub authentication
- **JSON - objektna notacija JavaScripta** - Slovenian JSON tutorial with AI focus
- **Test Obsidian Workflow** - Content management testing

### How-To Guides (5 tutorials)
- **Setting Up Obsidian for Blog Content Management** - Complete Obsidian integration guide
- **Getting Started with Docker Astro** - Development environment setup
- **Optimizing Astro Build Performance** - Performance tuning
- **My First Post from Obsidian** - Beginner content creation
- **Shell Commands Guide** - Advanced command-line operations

## 🛠️ Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (for containerized deployment)
- Obsidian (for content management)

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run production container
docker build -t astro-blog .
docker run -p 4321:4321 astro-blog
```

## 📝 Content Management with Obsidian

### Setup
1. **Open Vault**: Launch Obsidian and open `src/astro-blog/` as vault
2. **Use Templates**: Create posts with the "blog-post" template
3. **Auto Sync**: Run `./sync-content.sh` to sync content to Astro

### Writing Workflow
1. **Draft**: Write in Obsidian with `published: false`
2. **Edit**: Refine content with live preview
3. **Publish**: Set `published: true` and sync
4. **Deploy**: Site rebuilds automatically

### Frontmatter Template
```yaml
---
title: "Your Post Title"
description: "SEO-friendly description"
date: "2025-11-04"
author: "Author Name"
published: true
featured: false
tags: ["tag1", "tag2"]
---
```

## 🏗️ Project Structure

```
astro-blog/
├── src/
│   ├── astro-blog/          # Obsidian vault (writing workspace)
│   ├── content/             # Astro content collections
│   │   ├── posts/          # Blog posts
│   │   └── howtos/         # How-to guides
│   ├── components/         # Reusable Astro components
│   ├── layouts/            # Page layouts
│   ├── pages/              # Route pages
│   └── utils/              # Helper utilities
├── .obsidian-vault/        # Obsidian configuration
├── scripts/                # Build and management scripts
├── public/                 # Static assets
└── Docker setup files
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `./sync-content.sh` - Sync Obsidian content to Astro
- `./sync-content.sh watch` - Auto-sync content changes
- `./create-post.sh "Title"` - Create new post with template

## 🌐 Live Demo

- **Development**: http://localhost:4321
- **Production**: Deployed via Docker
- **Admin Panel**: `/admin` (admin@test.com / testtest)

## 📖 Documentation

- **[Obsidian Integration Guide](./OBSIDIAN.md)** - Complete content management setup
- **[Docker Setup Report](./REPORT.md)** - Troubleshooting and deployment guide
- **[Project Status](./TODO.md)** - Current progress and roadmap

## 🐛 Troubleshooting

### Build Issues
- Check Node.js version (20+ required)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for schema validation errors in console

### Content Sync Issues
- Ensure Obsidian vault is open from `src/astro-blog/`
- Run `./sync-content.sh` after content changes
- Check frontmatter syntax in posts

### Docker Issues
- Rebuild containers: `docker-compose down && docker-compose up --build`
- Check logs: `docker-compose logs`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Write content in Obsidian or edit directly
4. Test build: `npm run build`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Astro, Obsidian, and Docker**