import { defineCollection } from 'astro/content/config';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// ---------------------------------------------------------------------------
// Projects Collection
// ---------------------------------------------------------------------------
// MDX frontmatter validates at build time. Invalid fields fail `astro build`
// with a detailed Zod error naming the offending field.
// ---------------------------------------------------------------------------

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.mdx' }),
  schema: z.object({
    title: z.string(),
    company: z.string(),
    period: z.object({
      start: z.coerce.date(),
      end: z.coerce.date().optional(),
    }),
    role: z.string(),
    techStack: z.array(z.string()).nonempty(),
    tags: z.array(z.string()).nonempty(),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
          direction: z.enum(['up', 'down', 'neutral']),
        }),
      )
      .nonempty(),
    featured: z.boolean().default(false),
    order: z.number().optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { projects };
