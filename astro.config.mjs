// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import mermaid from 'astro-mermaid';
import icon from 'astro-icon';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    mermaid({ theme: 'dark', autoTheme: false }),
    icon({ include: { 'simple-icons': ['*'], devicon: ['*'] } }),
    react(),
  ],

  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});