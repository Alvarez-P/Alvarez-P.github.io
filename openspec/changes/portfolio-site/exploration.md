## Exploration: Portfolio Site — "Case Studies Arquitectónicos con Estética Terminal"

### Current State

The project is a fresh Astro 7.1.1 minimal starter. It contains exactly one file (`src/pages/index.astro` with boilerplate HTML), an empty `astro.config.mjs`, and zero integrations or dependencies beyond `astro` itself. No content collections, no layouts, no components, no styling, no test runner. The `openspec/` directory exists but is empty aside from an empty `changes/` subdirectory.

This is a greenfield build from a minimal scaffold.

### Affected Areas

| Path | Why Affected |
|------|-------------|
| `astro.config.mjs` | Needs integrations: view transitions, mermaid, icon, MDX |
| `package.json` | Needs new dependencies: `@astrojs/mdx`, `astro-mermaid`, `mermaid`, `astro-icon`, `@iconify-json/simple-icons`, `@iconify-json/devicon` |
| `src/pages/index.astro` | Complete rewrite — terminal-style hero |
| `src/pages/projects/index.astro` | New — chronological case study listing |
| `src/pages/projects/[slug].astro` | New — deep-dive detail page |
| `src/pages/writing/index.astro` | New — optional blog listing |
| `src/pages/about.astro` | New — about page |
| `src/pages/contact.astro` | New — contact page |
| `src/content.config.ts` | New — content collection definitions |
| `src/content/projects/*.mdx` | New — project case study files |
| `src/layouts/` | New — base layout, project layout |
| `src/components/` | New — terminal-hero, Mermaid diagram, tech-icon, metric-card components |
| `src/styles/` | New — design token CSS, global styles |
| `src/icons/` | New — local SVG overrides for tech icons |
| `public/` | Favicon replacement |

### Approaches

#### 1. View Transitions

| Approach | Pros | Cons | Effort |
|----------|------|------|--------|
| **Built-in `<ClientRouter />`** | Zero-config, built-in `fade`/`slide` animations, `transition:name` for element morphing, no extra deps | Limited customization for complex file-system metaphors | Low |
| **Custom Overlay Router** | Full control over transition timeline, can implement exact "terminal directory" feel | Massive effort, reinventing the wheel | Very High |

**Recommendation**: Use `<ClientRouter />` from `astro:transitions`. Customize with `transition:animate` directives for directional fades (left = forward, right = back). Define custom CSS `@keyframes` for a subtle "terminal scroll" feel. No need for a custom router.

#### 2. Mermaid.js Integration

| Approach | Pros | Cons | Effort |
|----------|------|------|--------|
| **`astro-mermaid` (client-side)** | Drop-in integration, auto `data-theme` dark mode support, configurable mermaid config, handles icon packs in diagrams | Ships ~200KB mermaid JS to client, only renders on client | Low |
| **`@mermaid-js/mermaid-cli` (build-time)** | Zero client JS, static SVGs in HTML, better perf, works with JS disabled | Complex build pipeline (`mmdc` CLI), need to manage re-renders per diagram, harder to theme dynamically | High |
| **Manual `mermaid` with `client:visible`** | Loads only when scrolled into view, fine-grained control | Manual setup, still ships mermaid JS | Medium |

**Recommendation**: Use **`astro-mermaid`** for the initial build. The portfolio will have at most 1-2 diagrams per project page (~5-10 projects). Mermaid's ~200KB is amortized across visits via browser cache, and the `client:visible` behaviour could be layered on later. The `autoTheme: true` option handles dark theme automatically, which matches our "no toggle" constraint. If bundle size becomes a concern, switch to CLI build-time rendering in a follow-up.

#### 3. Technology Icons

| Approach | Pros | Cons | Effort |
|----------|------|------|--------|
| **`astro-icon` + `@iconify-json/simple-icons`** | SVGs inlined at build time via `astro-icon`, zero runtime JS, tree-shakable import, massive set of 3100+ brand icons (TypeScript, AWS, Docker, PostgreSQL, NestJS, etc.) | Need to install icon packages, exact icon names may differ from brand | Low |
| **Local SVG icons** | Full control, no icon package dependency | Must source, download, and maintain each SVG manually | Medium |
| **Iconify Web Component** | No build integration, works anywhere | Requires client JS to load icons dynamically | Low but worse perf |

**Recommendation**: Use **`astro-icon`** with **`@iconify-json/simple-icons`** for brand tech icons and **`@iconify-json/devicon`** for developer-specific tool icons. The `<Icon name="simple-icons:typescript" />` component is clean, and SVGs are inlined at build time. No client JS. For any custom icons (e.g. a personal logo), place SVGs in `src/icons/`.

#### 4. Content Collection Schema Design

| Approach | Pros | Cons | Effort |
|----------|------|------|--------|
| **MDX for project detail pages** | Embed Mermaid diagrams in content body, code snippets with syntax highlighting, rich structure per case study section | Heavier content files | Low |
| **Markdown with HTML components** | Simpler frontmatter-only content | Can't embed interactive/dynamic components per section without workarounds | Medium |
| **JSON/YAML data files** | Strict data validation, easy to generate programmatically | Less expressive, can't embed rich markdown content per section without string concatenation | Medium |

**Recommendation**: Use **MDX** for projects. Frontmatter holds structured metadata (tech stack, metrics, dates). The body holds the case study narrative with embedded Mermaid diagrams, code blocks, and images. This maps perfectly to the 5-section structure (context, architecture, implementation, results, lessons) as MDX sections.

**Schema design for `projects` collection**:

```typescript
const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      company: z.string(),
      period: z.object({
        start: z.coerce.date(),
        end: z.coerce.date().optional(),
      }),
      role: z.string(),
      techStack: z.array(z.string()),
      tags: z.array(z.string()),
      metrics: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          direction: z.enum(["up", "down", "neutral"]),
        })
      ),
      featured: z.boolean().default(false),
      order: z.number().optional(),
      published: z.boolean().default(true),
    }),
});
```

**`writing` collection** (simpler, standard blog schema):
```typescript
const writing = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()),
    published: z.boolean().default(true),
  }),
});
```

#### 5. Design Token System (Dark Theme)

**Approach: CSS custom properties as the single source of truth**, matching "no theme toggle" constraint.

```css
:root {
  /* Background hierarchy — terminal-inspired */
  --color-bg-primary: #0d0d0d;
  --color-bg-secondary: #1a1a1a;
  --color-bg-tertiary: #252525;
  --color-bg-code: #111111;
  --color-bg-navigation: #080808;

  /* Text hierarchy (mono vs sans) */
  --color-text-primary: #e0e0e0;
  --color-text-secondary: #a0a0a0;
  --color-text-muted: #606060;
  --color-text-accent: #00ff41;  /* Matrix-green accent */
  --color-text-link: #58a6ff;

  /* Terminal colors */
  --color-terminal-green: #00ff41;
  --color-terminal-amber: #ffb000;
  --color-terminal-red: #ff3333;
  --color-terminal-cyan: #00d4ff;
  --color-terminal-magenta: #ff00ff;

  /* Borders and dividers */
  --color-border: #2a2a2a;
  --color-border-accent: #00ff4133;

  /* Typography */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  --font-sans: 'Inter', 'Geist', system-ui, sans-serif;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;

  /* Layout */
  --content-max-width: 720px;
  --content-padding: 1.5rem;
}
```

**Why no `prefers-color-scheme`**: The user explicitly wants dark-only. No toggle. No media query. The terminal aesthetic demands it — backend devs "live in darkness."

#### 6. Typography Loading

**Approach**: Self-host `JetBrains Mono` and `Inter` via `@fontsource/` packages or CDN preloads.

| Approach | Pros | Cons | Effort |
|----------|------|------|--------|
| **`@fontsource/jetbrains-mono` + `@fontsource/inter`** | Self-hosted, no external requests, version-pinned, tree-shakable subsets | Adds to bundle size (~100KB combined woff2) | Low |
| **Google Fonts link** | Simple, CDN-cached | External request, privacy concern, potential layout shift | Low (but worse) |
| **System font stack fallback** | Zero payload, instant text | Less aesthetic control, may not match design intent | None |

**Recommendation**: Use `@fontsource/jetbrains-mono` (for headings, code, technical data) and `@fontsource/inter` (for body). Both self-host and bundle with the site — no external requests, no CLS from font swaps. Import in the base layout.

### Integrated Architecture Diagram

```
astro.config.mjs
├── @astrojs/mdx          ← MDX content (.mdx pages)
├── astro-mermaid         ← Mermaid diagram rendering
├── astro-icon            ← Tech icon inlining
└── viewTransitions       ← Built-in, via <ClientRouter />

src/
├── content.config.ts     ← Collection schema (projects, writing)
├── content/
│   ├── projects/
│   │   ├── infotec.mdx
│   │   ├── happyguest.mdx
│   │   ├── derby.mdx
│   │   ├── belieff.mdx
│   │   └── adc.mdx
│   └── writing/          ← (optional)
├── layouts/
│   ├── BaseLayout.astro  ← <ClientRouter />, global styles, SEO head
│   └── ProjectLayout.astro ← Project navigation, TOC, related
├── components/
│   ├── TerminalHero.astro ← $ whoami, $ ls ~/projects/
│   ├── TechStack.astro   ← Renders icon grid from techStack array
│   ├── MetricsBar.astro  ← Performance metric display
│   ├── ArchitectureDiagram.astro ← Wrapper for Mermaid (client:visible)
│   ├── CodeBlock.astro   ← Syntax highlighted snippet
│   └── Nav.astro         ← Terminal-inspired navigation
├── styles/
│   └── tokens.css        ← CSS custom properties
├── icons/                ← Local SVG overrides (if needed)
└── pages/
    ├── index.astro       ← Terminal hero
    ├── projects/
    │   ├── index.astro   ← Case study listing
    │   └── [slug].astro  ← Dynamic route → ProjectLayout
    ├── writing/
    │   └── index.astro   ← Blog listing (optional)
    ├── about.astro
    └── contact.astro
```

### Recommendation

Commit to the following stack and approach:

1. **View Transitions**: Built-in `<ClientRouter />` with custom directional `fade` animations. No custom router.
2. **Mermaid Diagrams**: `astro-mermaid` integration with `autoTheme: true` for dark mode. If bundle size grows, revisit build-time CLI rendering as a future optimization.
3. **Technology Icons**: `astro-icon` + `@iconify-json/simple-icons` (primary) + `@iconify-json/devicon` (secondary). SVGs inlined at build time, zero client JS.
4. **Content**: MDX for project case studies with rich frontmatter schema. Backend-specific fields (metrics, techStack, architecture notes) not typical in frontend portfolios.
5. **Typography**: Self-hosted via `@fontsource/jetbrains-mono` and `@fontsource/inter`.
6. **Theme**: Dark only. CSS custom properties. No toggle, no `prefers-color-scheme`.
7. **Styling**: CSS custom properties + global CSS. No Tailwind — the design is intentionally minimal and the token count is small enough that a utility framework adds complexity without benefit.

### Risks

| Risk | Mitigation |
|------|------------|
| **Mermaid JS bundle size** (~200KB) | Amortized via browser cache; only loads on project detail pages. Monitor build output. |
| **Content creation effort** — 5 detailed case studies require significant writing | Start with 3 core projects (Infotec, HappyGuest, ADC) for MVP; add others iteratively. |
| **MDX + Mermaid compatibility** — astro-mermaid transforms code blocks, must work within MDX | Test early with a single project page before scaling. |
| **No visual screenshots** — the entire concept relies on diagrams and text being compelling | Quality of writing and diagram design is the differentiator. Dedicate design time to Mermaid diagram quality. |
| **JetBrains Mono license** — OFL, fine for web use | No issue, but verify redistribution terms are met (include license in build). |
| **Static site dynamic routing** — `[slug].astro` with content collections works well in Astro | Verified pattern; low risk. |

### Ready for Proposal

**Yes.** Exploration is complete. The orchestrator should start the **sdd-propose** phase for the `portfolio-site` change with the following context:

- Stack is fully validated (Astro 7.1.1, Node 22+)
- All integration choices have researched alternatives
- Content strategy is defined
- Design direction ("terminal chic", dark-only, case-study-as-architecture) is locked
- No blockers; the project is greenfield and ready for scoping

Key clarifications to resolve in the proposal phase:
1. Exact content priority order for the 5 projects (which 3 for MVP?)
2. Confirmation on Tailwind exclusion (user preference for minimalist CSS)
3. Whether `writing` (blog) section is in scope for MVP or deferred
4. Favicon/logo design approach (terminal-themed? code syntax?)
