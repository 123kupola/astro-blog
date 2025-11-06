import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    author: z.string().optional(),
    published: z.boolean().default(true),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    heroImage: z.string().optional(),
  }),
});

const howtosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    author: z.string().optional(),
    published: z.boolean().default(true),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    timeRequired: z.string().optional(),
  }),
});

const assetsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    alt: z.string().optional(),
    caption: z.string().optional(),
  }),
});

// Note: Content is duplicated in both src/content/ (for Astro) and src/astro-blog/ (for Obsidian)
// This ensures Docker compatibility while maintaining the Obsidian workflow

export const collections = {
  posts: postsCollection,
  howtos: howtosCollection,
  assets: assetsCollection,
};