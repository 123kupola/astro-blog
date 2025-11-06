import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Content directories
const CONTENT_DIR = path.join(__dirname, '..', '..', '..', 'content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const HOWTOS_DIR = path.join(CONTENT_DIR, 'howtos');

// Helper function to parse frontmatter
function parseFrontmatter(content: string) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const body = frontmatterMatch[2];

  const metadata: any = {};
  const lines = frontmatter.split('\n');

  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      // Parse boolean values
      if (value === 'true') metadata[key] = true;
      else if (value === 'false') metadata[key] = false;
      else if (value.match(/^\d+$/)) metadata[key] = parseInt(value);
      else if (value.match(/^\d{4}-\d{2}-\d{2}/)) metadata[key] = new Date(value);
      else if (value.startsWith('[') && value.endsWith(']')) {
        // Parse array values
        metadata[key] = value.slice(1, -1).split(',').map((item: string) => item.trim().replace(/"/g, ''));
      }
      else metadata[key] = value.replace(/"/g, '');
    }
  }

  return { metadata, body };
}

// Helper function to update frontmatter
function updateFrontmatter(filePath: string, updates: any) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(content);

  if (!parsed) return false;

  const { metadata, body } = parsed;

  // Update metadata
  Object.assign(metadata, updates);

  // Reconstruct frontmatter
  const newFrontmatter = Object.entries(metadata)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.map(item => `"${item}"`).join(', ')}]`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');

  const newContent = `---\n${newFrontmatter}\n---\n${body}`;

  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

// GET /api/admin/content - List all content
export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const type = searchParams.get('type'); // 'posts', 'howtos', or null for all
    const status = searchParams.get('status'); // 'published', 'draft', or null for all
    const search = searchParams.get('search'); // search term

    let allContent: any[] = [];

    // Get posts
    if (!type || type === 'posts') {
      try {
        const posts = await getCollection('posts');
        const postsWithMeta = posts.map(post => ({
          id: post.slug,
          type: 'post',
          title: post.data.title || 'Untitled Post',
          description: post.data.description || '',
          date: post.data.date.toISOString(),
          author: post.data.author || 'Unknown',
          published: post.data.published,
          featured: post.data.featured,
          tags: post.data.tags || [],
          image: post.data.image,
          heroImage: post.data.heroImage,
          url: `/blog/${post.slug}`,
          filePath: path.join(POSTS_DIR, `${post.slug}.md`)
        }));
        allContent.push(...postsWithMeta);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    }

    // Get howtos
    if (!type || type === 'howtos') {
      try {
        const howtos = await getCollection('howtos');
        const howtosWithMeta = howtos.map(howto => ({
          id: howto.slug,
          type: 'howto',
          title: howto.data.title || 'Untitled How-to',
          description: howto.data.description || '',
          date: howto.data.date.toISOString(),
          author: howto.data.author || 'Unknown',
          published: howto.data.published,
          featured: howto.data.featured,
          tags: howto.data.tags || [],
          image: howto.data.image,
          difficulty: howto.data.difficulty,
          timeRequired: howto.data.timeRequired,
          url: `/howtos/${howto.slug}`,
          filePath: path.join(HOWTOS_DIR, `${howto.slug}.md`)
        }));
        allContent.push(...howtosWithMeta);
      } catch (error) {
        console.error('Error loading howtos:', error);
      }
    }

    // Apply filters
    let filteredContent = allContent;

    if (status) {
      filteredContent = filteredContent.filter(item =>
        status === 'published' ? item.published : !item.published
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredContent = filteredContent.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by date (newest first)
    filteredContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return new Response(JSON.stringify({
      success: true,
      data: filteredContent,
      total: filteredContent.length
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch content'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST /api/admin/content - Toggle publish status
export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, id } = await request.json();

    if (!id || action !== 'toggle-publish') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid request'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find the content file
    let filePath = null;
    let contentType = null;

    // Check posts first
    const postPath = path.join(POSTS_DIR, `${id}.md`);
    if (fs.existsSync(postPath)) {
      filePath = postPath;
      contentType = 'post';
    } else {
      // Check howtos
      const howtoPath = path.join(HOWTOS_DIR, `${id}.md`);
      if (fs.existsSync(howtoPath)) {
        filePath = howtoPath;
        contentType = 'howto';
      }
    }

    if (!filePath) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Content not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Read current content and toggle publish status
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = parseFrontmatter(content);

    if (!parsed) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid content format'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { metadata } = parsed;
    const newStatus = !metadata.published;

    if (updateFrontmatter(filePath, { published: newStatus })) {
      return new Response(JSON.stringify({
        success: true,
        data: {
          id,
          type: contentType,
          published: newStatus
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to update content'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Error toggling publish status:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};