# Portfolio Pages Specification

## Purpose

Define the route structure, layout system, view transitions, and page contracts — terminal hero, project listing, project detail, about, and contact.

## Requirements

### Requirement: Route Structure

The site SHALL expose five routes:

| Route | Page | Type |
|-------|------|------|
| `/` | `index.astro` | Static — terminal hero |
| `/projects` | `projects/index.astro` | Static — case study listing |
| `/projects/[slug]` | `projects/[slug].astro` | Dynamic — project detail |
| `/about` | `about.astro` | Static |
| `/contact` | `contact.astro` | Static |

All routes MUST return `200`. Dynamic `[slug]` SHALL return `404` for unknown slugs.

#### Scenario: Routes respond with 200

- GIVEN the built site
- WHEN requesting `/`, `/projects`, `/projects/infotec`, `/about`, `/contact`
- THEN each returns `200` with rendered HTML

#### Scenario: Unknown slug returns 404

- GIVEN no MDX exists with slug `nonexistent`
- WHEN requesting `/projects/nonexistent`
- THEN the route returns `404`

### Requirement: Layout System

Two layouts SHALL serve all pages:

| Layout | Applies To | Provides |
|--------|------------|----------|
| `BaseLayout.astro` | All pages | `<ClientRouter />`, global styles, SEO `<head>`, `<Nav />`, `<main>` slot |
| `ProjectLayout.astro` | `/projects/[slug]` | Extends BaseLayout; wraps MDX with project nav, TOC, related projects |

`BaseLayout` SHALL include `title`, `description`, and Open Graph meta tags. `ProjectLayout` SHALL derive `<title>` from frontmatter.

#### Scenario: BaseLayout wraps all pages

- GIVEN any route
- WHEN rendered
- THEN HTML includes `<ClientRouter />`, global stylesheet, nav, and SEO meta tags

#### Scenario: ProjectLayout derives title

- GIVEN a project MDX with `title: "Infotec Platform"`
- WHEN `/projects/infotec` renders
- THEN `<title>` contains "Infotec Platform"

### Requirement: View Transitions

The site SHALL use `<ClientRouter />` for client-side navigation. Forward navigation SHALL use `slide-left`, backward `slide-right`. Duration SHALL be `--transition-normal` (300ms).

#### Scenario: Forward navigates left

- GIVEN user is on `/`
- WHEN clicking a link to `/projects`
- THEN transition uses `slide-left` animation with no full page reload

#### Scenario: Back navigates right

- GIVEN user is on `/projects/infotec`
- WHEN clicking a back link
- THEN transition uses `slide-right` animation

### Requirement: Terminal Hero (`/`)

The index page SHALL render a monospace terminal hero with a prompt-line greeting and a command-like project listing. Text SHALL render immediately — NO character-by-character typing animation.

#### Scenario: Hero renders terminal prompt

- GIVEN the user visits `/`
- WHEN the page loads
- THEN a `$` prefixed prompt with monospace font displays the developer's role

#### Scenario: No typing animation

- GIVEN the hero section
- WHEN first render occurs
- THEN all terminal text is immediately visible with zero JavaScript animation

### Requirement: Navigation

The `<Nav />` component SHALL render links to `/`, `/projects`, `/about`, `/contact` in `--font-mono`. The active route SHALL use `--color-text-accent`; others SHALL use `--color-text-secondary`.

#### Scenario: Active route highlighted

- GIVEN user is on `/about`
- WHEN nav renders
- THEN "About" uses `--color-text-accent` and other links use `--color-text-secondary`

### Requirement: About Page

The `/about` route SHALL render developer info (stack, philosophy, workflow) as hardcoded content — no content collection required.

### Requirement: Contact Page

The `/contact` route SHALL render professional links (GitHub, LinkedIn, email). Links SHALL open in the same tab by default.

#### Scenario: Contact links render

- GIVEN the contact page
- WHEN it renders
- THEN GitHub, LinkedIn, and email links are present and open in the same tab
