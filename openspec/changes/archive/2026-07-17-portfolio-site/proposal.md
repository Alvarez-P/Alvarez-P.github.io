# Proposal: Backend Developer Portfolio Site

## Intent

Build a terminal-inspired static portfolio showcasing backend architecture through detailed case studies with C4 diagrams. The site is a technical narrative — not a job list — demonstrating architectural depth via metrics, diagrams, and tech icons.

## Scope

### In Scope
- 5 project case studies (Infotec, HappyGuest, Derby, Belieff, ADC) as MDX content
- Terminal-style hero, about, and contact pages
- C4 Container diagrams via Mermaid per project
- Tech icon grid via astro-icon + Simple Icons + Devicon
- Dark-only theme with CSS custom properties
- Self-hosted JetBrains Mono + Inter typography
- View transitions via built-in `<ClientRouter />`

### Out of Scope
- Blog/writing section — deferred
- Theme toggle — dark-only, no media query
- Tailwind CSS — vanilla CSS tokens instead
- Build-time Mermaid rendering — client-side `astro-mermaid` initially

## Capabilities

> Contract between proposal and specs phases. Each new capability becomes `openspec/specs/<name>/spec.md`.

### New Capabilities
- `project-case-study`: MDX content collection with typed frontmatter (techStack, metrics, dates), embedded C4 diagrams, and tech icon rendering for project detail pages
- `terminal-theme`: Dark-only design token system via CSS custom properties, terminal color palette, and self-hosted JetBrains Mono + Inter typography
- `portfolio-pages`: Route structure (/, /projects, /projects/[slug], /about, /contact) with ClientRouter view transitions and terminal-style navigation

### Modified Capabilities
None — greenfield project, no existing specs.

## Approach

Two-phase build. Phase 1: scaffold integrations (MDX, mermaid, icon, fonts), design tokens, base layout, page shell, and deploy. Phase 2: author all 5 case studies in MDX with C4 diagrams and metrics. Separates infrastructure from content — content can be refined independently.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `astro.config.mjs` | Modified | Add MDX, mermaid, icon integrations |
| `package.json` | Modified | Add 8 new dependencies |
| `src/pages/` | New (5 routes) | index, projects/index, projects/[slug], about, contact |
| `src/layouts/` | New (2) | BaseLayout, ProjectLayout |
| `src/styles/tokens.css` | New | CSS custom property design tokens |
| `src/content/config.ts` | New | Content collection schema |
| `src/content/projects/` | New (5 MDX) | Case studies with frontmatter |
| `src/components/` | New (6) | TerminalHero, TechStack, MetricsBar, ArchitectureDiagram, Nav, CodeBlock |
| `public/favicon.svg` | Modified | Terminal-style favicon |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Mermaid ~200KB bundle | Low | Cache-amortized; revisit build-time CLI if perf issue |
| Content effort (5 case studies) | Medium | Write 3 most impactful first; add 2 iteratively |
| MDX + Mermaid compat | Low | Test one project page early; fallback to `<img>` of pre-rendered diagram |

## Rollback Plan

Revert `astro.config.mjs` to empty, remove added `dependencies` from `package.json`, delete `src/content/`, `src/layouts/`, `src/components/`, `src/styles/`, and new route pages. Original `src/pages/index.astro` is the only pre-existing file — restore it.

## Dependencies

- `@astrojs/mdx`, `astro-mermaid`, `mermaid`, `astro-icon`, `@iconify-json/simple-icons`, `@iconify-json/devicon`, `@fontsource/jetbrains-mono`, `@fontsource/inter`

## Success Criteria

- [ ] 5 project case studies render with C4 diagrams, tech icons, and metrics
- [ ] 5 routes work: `/`, `/projects`, `/projects/[slug]`, `/about`, `/contact`
- [ ] `astro build` completes with zero errors
- [ ] View transitions animate between pages (no full reloads)
- [ ] Tech icons render as inline SVGs (zero runtime JS for icons)
