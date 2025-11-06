# Obsidian Integration Guide

This guide explains how to use Obsidian as your content management system for the Astro blog.

## Overview

Your Astro blog uses Obsidian as the content management system. The `src/astro-blog/` directory is configured as an Obsidian vault, allowing you to write and manage blog posts and how-to guides using Obsidian's excellent editing interface.

## Directory Structure & Sync

**Important**: Content is duplicated in both locations for maximum compatibility:

- **Obsidian Vault**: `src/astro-blog/` (your writing workspace)
- **Astro Content Source**: `src/content/` (standard Astro location)
- **Docker Safe**: No symlinks - content exists in both places
- **Sync**: Automated sync available with `./sync-content.sh`

**When you add content in Obsidian:**
1. Write in `src/astro-blog/`
2. Run `./sync-content.sh` to sync to Astro
3. Or use `./sync-content.sh watch` for automatic syncing

## Setup Instructions

### 1. Open the Vault in Obsidian

⚠️ **Important**: Only open `src/astro-blog/` as your Obsidian vault. Do NOT open `src/content/posts/` or any other directory.

1. **Launch Obsidian** on your Linux laptop
2. **Click "Open folder as vault"**
3. **Navigate to and select**: `/home/samob/ai/astro/src/astro-blog/`
4. **Click "Open"**

The vault will open with your existing blog posts, how-to guides, and Obsidian configuration.

### 2. Vault Structure

```
src/astro-blog/
├── .obsidian/           # Symlink to .obsidian-vault (Obsidian config)
├── content/             # Content files
│   ├── posts/           # Blog posts (6 articles)
│   │   ├── astro-modular-demo-overview.md
│   │   ├── complete-astro-docker-guide.md
│   │   ├── docker-astro-production-guide.md
│   │   ├── github-ssh-setup.md
│   │   ├── json-objektna-notacija-javascripta.md
│   │   └── test-obsidian-workflow.md
│   ├── howtos/          # How-to guides (5 tutorials)
│   │   ├── getting-started-docker-astro.md
│   │   ├── my-first-post-from-obsidian.md
│   │   ├── optimizing-astro-build-performance.md
│   │   ├── setting-up-obsidian-blog-content-management.md
│   │   └── shell-commands.md
│   └── assets/          # Images and attachments
└── ...

.obsidian-vault/         # Actual Obsidian configuration (outside content)
├── app.json            # Obsidian settings
├── templates/          # Content templates
│   └── blog-post.md    # Updated post template
│   └── blog-post.md
└── ...                 # Other Obsidian config files
```

## Writing Blog Posts

### Creating New Posts

**⚠️ Important**: Always use the proper template when creating new posts to avoid schema validation errors.

#### Option 1: Using Obsidian Template (Recommended)

1. **Open Command Palette**: `Ctrl+P` (or `Cmd+P` on Mac)
2. **Type**: "Insert template"
3. **Select**: "blog-post"
4. **Fill in the template fields**:
   - `title`: Your post title
   - `description`: Brief description for SEO
   - `author`: Your name
   - `published`: Set to `false` while drafting

#### Option 2: Using the Create Script

For guaranteed compatibility, use the provided script:

```bash
./create-post.sh "Your Post Title" "Optional description"
```

This creates a properly formatted post with all required frontmatter.

### Frontmatter Structure

Every blog post uses this YAML frontmatter:

```yaml
---
title: "Your Blog Post Title"
description: "Brief description for SEO and social sharing"
date: "04.11.2024"  # European format: dd.mm.yyyy
author: "Your Name"
published: false  # Set to true when ready to publish
---
```

### Writing Content

- **Write in Markdown**: Use standard Markdown syntax
- **Live Preview**: Toggle with `Ctrl+E` to see formatted output
- **Links**: Use `[[Post Title]]` for internal links
- **Tags**: Use `#tag` for categorization
- **Images**: Place in `content/assets/` folder and reference as `../assets/image.jpg`
- **Alt Text**: Always include descriptive alt text for accessibility

## Content Synchronization

The sync script automates copying content between Obsidian and Astro directories:

```bash
# Check if content is synchronized
./sync-content.sh check

# Sync content from Obsidian to Astro
./sync-content.sh sync

# Watch for changes and auto-sync every 5 seconds
./sync-content.sh watch
```

**Note**: In Docker development mode, changes are reflected immediately without manual syncing.

## Publishing Workflow

### Development Mode

When running in development mode (`npm run dev`), changes in Obsidian are reflected immediately on the site.

### Production Publishing

Use the command-line publishing tools to control what gets published:

```bash
# List all posts with their current status
npm run publish list

# Toggle publish status (draft ↔ published)
npm run publish toggle your-post-slug

# Publish a specific post
npm run publish publish your-post-slug

# Unpublish a post
npm run publish unpublish your-post-slug
```

### Publishing Status

- **`published: false`**: Post is a draft, not visible on the live site
- **`published: true`**: Post is published and visible to readers

## Obsidian Features Utilized

### Core Features

- **Live Preview**: Real-time Markdown rendering
- **Templates**: Consistent post structure
- **File Links**: `[[Post Title]]` syntax for internal linking
- **Backlinks**: Automatic reference tracking
- **Graph View**: Visual content relationships

### Advanced Features

- **Daily Notes**: Optional publishing schedule tracking
- **Plugins**: Extensible functionality (can be added later)
- **Themes**: Customizable appearance
- **Version Control**: Git integration for content history

## File Management

### Post Naming

- **Filename**: Use kebab-case for the slug (e.g., `my-awesome-post.md`)
- **Slug**: Automatically derived from filename
- **URL**: `http://localhost:4321/blog/your-post-slug`

### Assets

- **Local Images**: Place in `content/assets/` folder
- **Image References**: Use `../assets/your-image.jpg` in markdown
- **Auto-Serving**: Astro automatically serves and optimizes images
- **External Images**: Can also use full URLs (Unsplash, etc.)
- **File Types**: Supports JPG, PNG, WebP, AVIF, and more
- **Optimization**: Images are automatically compressed and resized

## Configuration Files

### .obsidian/app.json

```json
{
  "promptDelete": false,
  "attachmentFolderPath": "../assets",
  "newFileLocation": "folder",
  "newFileFolderPath": ".",
  "useMarkdownLinks": true,
  "alwaysUpdateLinks": true,
  "showUnsupportedFiles": false,
  "showLineNumber": true,
  "spellcheck": true,
  "vimMode": false,
  "livePreview": true,
  "showFrontmatter": true,
  "readableLineLength": false
}
```

### Blog Post Template

Located at: `.obsidian/templates/blog-post.md`

## Troubleshooting

### Build Crashes with "InvalidContentEntryDataError"

#### Issue: Obsidian config files in content directory
If you get schema validation errors like `posts → obsidian/appearance`, it means Obsidian configuration files were accidentally placed in the content directory.

**Solution:**
1. Make sure you're only opening `src/astro-blog/` as your Obsidian vault
2. Never open `src/content/posts/` or subdirectories as vaults
3. If `.obsidian` directories appear in `src/content/`, delete them:
   ```bash
   rm -rf src/content/posts/.obsidian
   ```
4. Run `./sync-content.sh` to clean up any copied config files

#### Issue: Missing or invalid frontmatter
If you get errors like `date: Invalid date` or `title: Required`, the post is missing required frontmatter.

**Solution:**
Add proper YAML frontmatter at the top of your `.md` file:
```yaml
---
title: "Your Post Title"
description: "Brief description for SEO"
date: "2025-11-04"
author: "Your Name"
published: true
featured: false
tags: ["tag1", "tag2"]
---
```

**Required fields:** `title`, `date`
**Recommended fields:** `description`, `author`, `published`, `tags`

```markdown
---
title: "{{title}}"
description: "{{description}}"
date: "{{date}}"  # Will be formatted as dd.mm.yyyy
author: "{{author}}"
published: false
---

# {{title}}

{{content}}

---

*Published: {{published}}*
*Author: {{author}}*
*Date: {{date}}*
```

## Development Workflow

### 1. Create/Edit Content
- Open vault in Obsidian
- Create new post using template
- Write and edit content
- Keep `published: false` during drafting

### 2. Preview Locally
- Start development server: `npm run dev`
- Visit: `http://localhost:4321/blog`
- Check your post: `http://localhost:4321/blog/your-post-slug`

### 3. Publish When Ready
- Set `published: true` in frontmatter
- Or use: `npm run publish publish your-post-slug`
- Commit changes to Git
- Deploy to production

### 4. Make Changes
- Edit directly in Obsidian
- Changes appear immediately in development
- Use publishing scripts for production control

## Docker Integration

The blog runs in Docker containers. Your Obsidian edits are automatically picked up because the `src/astro-blog/` directory is mounted as a volume.

### Development
```bash
docker compose up -d --build
```

### Production
```bash
docker compose --profile production up -d
```

## Troubleshooting

### Content Not Appearing
1. **Check directory structure**: Ensure `src/astro-blog/` exists and contains content
2. **Verify Astro config**: Check that `astro.config.mjs` has `contentDir: 'src/astro-blog'`
3. **Restart Obsidian**: If vault doesn't recognize changes
4. **Restart dev server**: `npm run dev` to pick up new content

### Post Not Appearing
1. Check `published: true` in frontmatter
2. Verify filename ends with `.md`
3. Restart development server if needed
4. Check Docker logs: `docker compose logs`

### Obsidian Not Recognizing Vault
1. Ensure `.obsidian` symlink exists in vault root (`src/astro-blog/.obsidian`)
2. Check that it points to `.obsidian-vault` directory
3. Verify `.obsidian-vault/app.json` is valid JSON
4. Try reopening the vault

### Template Not Working
1. Verify template file exists at correct path
2. Check template syntax
3. Restart Obsidian

### Schema Validation Errors
If you see errors like "data does not match collection schema":

1. **Always use templates**: Never create blank notes for blog posts
2. **Use the create script**: `./create-post.sh "Title" "Description"`
3. **Check frontmatter**: Ensure all required fields are present:
   - `title`: Required string
   - `date`: Required date (YYYY-MM-DD format)
   - `published`: Boolean (true/false)
4. **Use template insertion**: `Ctrl+P` → "Insert template" → "blog-post"

## Advanced Usage

### Custom Templates
Create additional templates in `.obsidian/templates/` for different post types.

### Plugins
Consider these Obsidian plugins for enhanced blogging:
- **Dataview**: Dynamic content queries
- **Kanban**: Project management
- **Calendar**: Publishing schedule
- **Advanced Tables**: Better table editing

### Version Control
- All content changes are tracked in Git
- Use branches for draft posts
- Commit messages should describe content changes

## Benefits of This Setup

### For Writers
- **Familiar Interface**: Obsidian's polished editing experience
- **Offline Editing**: No internet required
- **Rich Features**: Templates, backlinks, graph view
- **Version Control**: Git integration

### For Developers
- **Zero Runtime Dependencies**: No CMS JavaScript in production
- **Static Generation**: Fast builds and loading
- **SEO Friendly**: Pre-rendered pages
- **Scalable**: No database overhead

### For Operations
- **Simple Deployment**: Standard static site workflow
- **Version Control**: Content changes tracked
- **Automation**: Publishing scripts for CI/CD
- **Reliable**: No external service dependencies

## Next Steps

1. **Open the vault** in Obsidian using the path above
2. **Create a test post** using the blog-post template
3. **Preview it locally** at `http://localhost:4321/blog`
4. **Publish it** using the command-line tools
5. **Experiment** with Obsidian's features

This setup provides a powerful, developer-friendly content management solution that leverages Obsidian's excellent editing experience while maintaining the performance and simplicity of static site generation.</content>
<parameter name="filePath">/home/samob/ai/astro/OBSIDIAN.md