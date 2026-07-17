// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import mermaid from 'astro-mermaid';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    mermaid({ theme: 'dark', autoTheme: false }),
    icon({ include: { 'simple-icons': ['*'], devicon: ['*'] } }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
