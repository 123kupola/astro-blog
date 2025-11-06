import { defineConfig } from 'astro/config';
import { siteConfig } from './src/config.ts';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import pagefind from 'astro-pagefind';
import node from '@astrojs/node';

export default defineConfig({
  site: siteConfig.site,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    mdx(),
    tailwind({
      config: { applyBaseStyles: false },
    }),
    sitemap(),
    pagefind(),
  ],
  image: {
    domains: ['localhost'],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['pagefind'],
    },
  },
  
  compress: {
    html: true,
    css: true,
    js: true,
    img: true,
    svg: true,
  },
});