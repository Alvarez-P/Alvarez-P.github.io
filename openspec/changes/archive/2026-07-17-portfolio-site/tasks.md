# Tasks: Backend Developer Portfolio Site

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1295 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 (Foundation) → PR 2 (Shell) → PR 3 (Project Routes) → PR 4→5 (Content) |
| Delivery strategy | ask-on-risk |
| Chain strategy | stacked-to-main |

Decision needed before apply: Yes (resolved: stacked-to-main)
Chained PRs recommended: Yes (resolved: Unit 1 = PR 1 of 5, base=main)
Chain strategy: stacked-to-main
400-line budget risk: High (delegated to 5 stacked PR slices)

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation: config, deps, tokens, schema, favicon | PR 1 | ~170 lines, base=main |
| 2 | Shell: layouts, Nav, TerminalHero, static pages | PR 2 | ~230 lines, base=main |
| 3 | Project components + routes | PR 3 | ~200 lines, base=main |
| 4 | Content batch 1: infotec, happyguest, derby | PR 4 | ~360 lines, base=main |
| 5 | Content batch 2: belieff, adc | PR 5 | ~240 lines, base=main |

## Phase 1: Foundation

- [x] 1.1 Add 8 deps to `package.json` (+2 for `astro check`: @astrojs/check, typescript)
- [x] 1.2 Configure `astro.config.mjs` with MDX, mermaid, icon integrations
- [x] 1.3 Create `src/styles/tokens.css` — color, typography, spacing tokens
- [x] 1.4 Create `src/styles/global.css` — reset, body defaults, `::selection`
- [x] 1.5 Create `src/content.config.ts` — Zod schema for projects collection
- [x] 1.6 Replace `public/favicon.svg` with terminal `>_` icon
- [x] 1.7 Create `src/icons/` directory for SVG overrides

## Phase 2: Shell + Static Pages

- [x] 2.1 Create `src/components/Nav.astro` — mono links, active accent
- [x] 2.2 Create `src/components/TerminalHero.astro` — `$` prompt line
- [x] 2.3 Create `src/layouts/BaseLayout.astro` — ClientRouter, SEO, Nav, fonts
- [x] 2.4 Update `src/pages/index.astro` — BaseLayout + TerminalHero
- [x] 2.5 Create `src/pages/about.astro` — hardcoded stack/philosophy
- [x] 2.6 Create `src/pages/contact.astro` — GitHub, LinkedIn, email

## Phase 3: Project Components + Routes

- [x] 3.1 Create `src/components/TechIcon.astro` — icon resolution (simple-icons → devicon → fallback text chip)
- [x] 3.2 Create `src/components/MermaidDiagram.astro` — card-feature wrapped Mermaid with client:visible
- [x] 3.3 Create `src/components/ProjectCard.astro` — card-feature with eyebrow, tech pills, metrics (replaces old TechStack + MetricsBar)
- [x] 3.4 Create `src/pages/projects/index.astro` — chronological listing with ProjectCard
- [x] 3.5 Create `src/pages/projects/[slug].astro` — dynamic route with getStaticPaths
- [x] 3.6 Create `src/layouts/ProjectLayout.astro` — extends BaseLayout, header band, MDX body, prev/next
- [x] 3.7 Create content placeholder MDX files (5 projects) — valid frontmatter per Zod schema

## Phase 4: MDX Content Batch 1 (full content — pending)

- [x] 4.1 Write `src/content/projects/infotec.mdx` — full case study with C4 diagram, rich frontmatter, 5 sections
- [x] 4.2 Write `src/content/projects/happyguest.mdx` — full case study with C4 diagram, rich frontmatter, 5 sections
- [x] 4.3 Write `src/content/projects/derby.mdx` — full case study with C4 diagram, rich frontmatter, 5 sections

## Phase 5: MDX Content Batch 2 (full content — pending)

- [x] 5.1 Write `src/content/projects/belieff.mdx` — full case study with C4 diagram, CV-accurate frontmatter, 5 sections
- [x] 5.2 Write `src/content/projects/adc.mdx` — full case study with C4 diagram, CV-accurate frontmatter, 5 sections (ongoing, no end date)

## Phase 6: Verification

- [x] 6.1 `astro build` — zero errors (VERIFIED)
- [x] 6.2 All 5 project routes return 200 (build-time generation)
- [x] 6.3 Unknown slug returns 404 (not in getStaticPaths)
- [x] 6.4 Dark-only theme — no light mode (inherited from global.css)
- [x] 6.5 View transitions animate via slide() (inherited from BaseLayout)
- [x] 6.6 Tech icons inline SVG, zero runtime JS (astro-icon builds inline)
