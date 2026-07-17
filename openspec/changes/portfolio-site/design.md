# Design: Backend Developer Portfolio Site

## Technical Approach

Static Astro 7 site with MDX content collections, C4 Mermaid diagrams, inline tech icons, and ClientRouter view transitions. All content is build-time: zero runtime data fetching. Dark-only CSS tokens, no Tailwind.

## Component Tree

```
BaseLayout.astro ← ClientRouter, SEO head, global styles, Nav
├── index.astro → TerminalHero.astro
├── projects/index.astro → project listing cards
├── projects/[slug].astro → ProjectLayout.astro
│   ├── TechStack.astro → TechIcon.astro (×N)
│   ├── MetricsBar.astro
│   └── ArchitectureDiagram.astro (Mermaid, client:visible)
├── about.astro (hardcoded)
└── contact.astro (hardcoded links)
```

## Architecture Decisions

| # | Decision | Option | Tradeoff | Choice |
|---|----------|--------|----------|--------|
| 1 | Content schema location | `src/content.config.ts` (Astro 7 API) vs `src/content/config.ts` (legacy) | New API uses `astro/loaders` glob; old uses relative paths | `src/content.config.ts` — matches Astro 7.1.1 |
| 2 | Mermaid rendering | `astro-mermaid` (client, ~200KB) vs `mermaid-cli` (build-time SVG) | Client: simpler, cached; CLI: zero JS, complex pipeline | `astro-mermaid` with `client:visible` lazy load |
| 3 | Icon lookups | Simple Icons → Devicon → local fallback | Simple Icons covers 3100+ brands; Devicon fills tool gaps | Ordered resolution: `simple-icons` then `devicon`, then local SVG, then text |
| 4 | View Transitions | `slide()` directional vs custom `@keyframes` | Built-in slide is simpler; custom gives terminal-scroll feel | `slide()` with `duration: '300ms'` on `<main>` — forward/backward handled by browser history |
| 5 | Shiki theme | Single `github-dark` vs dual themes | No theme toggle → no dual theme needed | `github-dark` for all code blocks |
| 6 | astro-icon include | Explicit `include` list vs wildcard | Wildcard bundles all icons; explicit tree-shakes | Wildcard for simple-icons + devicon (dev portfolio, not production SaaS) |

## Astro Config

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import mermaid from 'astro-mermaid';
import icon from 'astro-icon';

export default defineConfig({
  integrations: [
    mdx(),
    mermaid({ theme: 'dark', autoTheme: false }),
    icon({ include: { 'simple-icons': ['*'], devicon: ['*'] } }),
  ],
  markdown: { shikiConfig: { theme: 'github-dark' } },
});
```

## Content Collection Schema

File: `src/content.config.ts`. Imports `defineCollection` from `astro:content`, `glob` from `astro/loaders`, `z` from `astro/zod`.

```ts
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
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
      direction: z.enum(['up', 'down', 'neutral']),
    })).nonempty(),
    featured: z.boolean().default(false),
    order: z.number().optional(),
    published: z.boolean().default(true),
  }),
});

export const collections = { projects };
```

## Data Flow (Build Time)

```
src/content/projects/*.mdx ──→ content.config.ts (Zod validate)
                                    │
                         getCollection('projects')
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
         projects/index.astro   [slug].astro    (future: RSS)
                    │               │
                    ▼               ▼
            sorted by order       MDX body → C4 diagrams
            → featured first      → TechStack icons
            → period.start desc   → MetricsBar
```

## CSS Architecture

Single source of truth: `src/styles/tokens.css`. Three layers:

1. **Design tokens** (`:root`): Colors, typography, spacing, transitions — `--color-*`, `--font-*`, `--space-*`
2. **Base reset** (`src/styles/global.css`): `box-sizing`, `body` defaults, `::selection` accent color
3. **Scoped styles** (per-component `<style>` tags): Component-specific layout

Responsive: `--content-max-width: 720px` clamp, `--content-padding: 1.5rem`, mobile-first breakpoints at `640px` and `1024px` via custom media queries.

## Icon System

`TechIcon.astro` props: `name: string`, `size?: number` (default 24), `color?: string` (default `currentColor`). Normalization: lowercase, spaces→hyphens, strip non-alphanumeric. Resolution:

1. `simple-icons:{name}` → Icon component
2. `devicon:{name}` → Icon component  
3. `src/icons/{name}.svg` → local file
4. Text fallback: `<span>` with technology name

`TechStack.astro` renders a CSS Grid (`grid-template-columns: repeat(auto-fill, minmax(48px, 1fr))`) of `TechIcon` components at 28px, colored `--color-text-secondary`, each with `title` tooltip.

## View Transitions

`BaseLayout.astro` includes `<ClientRouter />` in `<head>`. `<main>` receives `transition:animate={slide({ duration: '300ms' })}`. Forward/backward direction is handled automatically by the browser's View Transition API navigation direction.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `astro.config.mjs` | Modify | Add MDX, mermaid, icon integrations |
| `package.json` | Modify | Add 8 deps (see proposal) |
| `src/content.config.ts` | Create | Projects collection schema |
| `src/styles/tokens.css` | Create | CSS custom properties |
| `src/styles/global.css` | Create | Reset, body defaults, `::selection` |
| `src/layouts/BaseLayout.astro` | Create | ClientRouter, SEO, Nav, global styles |
| `src/layouts/ProjectLayout.astro` | Create | Extends Base, project nav + TOC |
| `src/components/Nav.astro` | Create | Mono nav links, active highlight |
| `src/components/TerminalHero.astro` | Create | Prompt-line greeting |
| `src/components/TechIcon.astro` | Create | Single icon resolver |
| `src/components/TechStack.astro` | Create | Icon grid |
| `src/components/MetricsBar.astro` | Create | Metric labels with direction arrows |
| `src/components/ArchitectureDiagram.astro` | Create | Mermaid wrapper with `client:visible` |
| `src/pages/index.astro` | Modify | Terminal hero |
| `src/pages/projects/index.astro` | Create | Chronological listing |
| `src/pages/projects/[slug].astro` | Create | Dynamic project detail |
| `src/pages/about.astro` | Create | Stack, philosophy, workflow |
| `src/pages/contact.astro` | Create | GitHub, LinkedIn, email |
| `src/icons/` | Create | Local SVG overrides directory |
| `public/favicon.svg` | Modify | Terminal-style `>_` or cursor |
| `src/content/projects/*.mdx` | Create | 5 case studies |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Build | Schema validation, all routes 200, no broken links | `astro build` in CI |
| Visual | Dark theme renders correctly, icons inline, diagrams render | Manual review (static site) |
| Schema | Invalid frontmatter fails build, valid passes | Pre-build Zod check or CI test script |

No test runner configured yet — build verification is the primary quality gate.

## Open Questions

- [ ] CI pipeline not configured — defer to post-MVP
- [ ] `astro-mermaid` bundle size acceptable? Monitor in Phase 2 with all 5 case studies loaded
