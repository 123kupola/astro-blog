#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '..', 'src', 'content', 'posts');

/**
 * Parse frontmatter from a markdown file
 */
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const body = frontmatterMatch[2];

  const metadata = {};
  const lines = frontmatter.split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      // Parse boolean values
      if (value === 'true') metadata[key] = true;
      else if (value === 'false') metadata[key] = false;
      else metadata[key] = value;
    }
  }

  return { metadata, body };
}

/**
 * Update frontmatter in a markdown file
 */
function updateFrontmatter(filePath, updates) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    console.error(`❌ Invalid frontmatter in ${filePath}`);
    return false;
  }

  const { metadata, body } = parsed;

  // Update metadata
  Object.assign(metadata, updates);

  // Reconstruct frontmatter
  const newFrontmatter = Object.entries(metadata)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const newContent = `---\n${newFrontmatter}\n---\n${body}`;

  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

/**
 * List all blog posts with their publish status
 */
function listPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error('❌ Posts directory not found');
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));

  console.log('\n📝 Blog Posts:');
  console.log('─'.repeat(60));

  files.forEach(file => {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = parseFrontmatter(content);

    if (parsed) {
      const { metadata } = parsed;
      const status = metadata.published ? '✅ Published' : '📝 Draft';
      const title = metadata.title || file.replace('.md', '');
      console.log(`${status} | ${title}`);
    }
  });
  console.log('');
}

/**
 * Toggle publish status of a specific post
 */
function togglePost(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Post not found: ${slug}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    console.error(`❌ Invalid frontmatter in ${slug}`);
    return false;
  }

  const { metadata } = parsed;
  const newStatus = !metadata.published;

  if (updateFrontmatter(filePath, { published: newStatus })) {
    const title = metadata.title || slug;
    const status = newStatus ? '✅ Published' : '📝 Unpublished';
    console.log(`${status} | ${title}`);
    return true;
  }

  return false;
}

/**
 * Publish a specific post
 */
function publishPost(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Post not found: ${slug}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    console.error(`❌ Invalid frontmatter in ${slug}`);
    return false;
  }

  const { metadata } = parsed;

  if (metadata.published) {
    console.log(`ℹ️  Already published: ${metadata.title || slug}`);
    return true;
  }

  if (updateFrontmatter(filePath, { published: true })) {
    const title = metadata.title || slug;
    console.log(`✅ Published | ${title}`);
    return true;
  }

  return false;
}

/**
 * Unpublish a specific post
 */
function unpublishPost(slug) {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Post not found: ${slug}`);
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    console.error(`❌ Invalid frontmatter in ${slug}`);
    return false;
  }

  const { metadata } = parsed;

  if (!metadata.published) {
    console.log(`ℹ️  Already unpublished: ${metadata.title || slug}`);
    return true;
  }

  if (updateFrontmatter(filePath, { published: false })) {
    const title = metadata.title || slug;
    console.log(`📝 Unpublished | ${title}`);
    return true;
  }

  return false;
}

// CLI interface
const command = process.argv[2];
const slug = process.argv[3];

switch (command) {
  case 'list':
  case 'ls':
    listPosts();
    break;

  case 'toggle':
    if (!slug) {
      console.error('❌ Please provide a post slug');
      console.log('Usage: node scripts/publish.js toggle <slug>');
      process.exit(1);
    }
    togglePost(slug);
    break;

  case 'publish':
    if (!slug) {
      console.error('❌ Please provide a post slug');
      console.log('Usage: node scripts/publish.js publish <slug>');
      process.exit(1);
    }
    publishPost(slug);
    break;

  case 'unpublish':
    if (!slug) {
      console.error('❌ Please provide a post slug');
      console.log('Usage: node scripts/publish.js unpublish <slug>');
      process.exit(1);
    }
    unpublishPost(slug);
    break;

  default:
    console.log('🚀 Blog Publishing Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/publish.js list                    # List all posts');
    console.log('  node scripts/publish.js toggle <slug>          # Toggle publish status');
    console.log('  node scripts/publish.js publish <slug>         # Publish a post');
    console.log('  node scripts/publish.js unpublish <slug>       # Unpublish a post');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/publish.js list');
    console.log('  node scripts/publish.js publish my-awesome-post');
    console.log('  node scripts/publish.js toggle my-awesome-post');
    break;
}