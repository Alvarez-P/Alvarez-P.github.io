# Technology Icons Specification

## Purpose

Define the icon resolution system using `astro-icon` + Simple Icons + Devicon, the `<TechIcon />` component API, and sizing/coloring contracts for technology stack displays.

## Requirements

### Requirement: Icon Resolution

The site SHALL render technology icons via `astro-icon` integration. Icons SHALL be resolved from two iconify sources:

| Source | Package | Use |
|--------|---------|-----|
| Simple Icons | `@iconify-json/simple-icons` | Brand icons (TypeScript, AWS, Docker, PostgreSQL, NestJS, React, etc.) |
| Devicon | `@iconify-json/devicon` | Developer-specific tool icons not in Simple Icons |

Resolution order: Simple Icons first, then Devicon fallback. All icons SHALL be inlined as SVGs at build time — zero runtime JavaScript for icon rendering.

#### Scenario: Simple Icons icon renders

- GIVEN `techStack: ["typescript"]` in project frontmatter
- WHEN the `TechStack` component renders
- THEN the TypeScript brand SVG is inlined in the HTML
- AND no client-side JavaScript loads for the icon

#### Scenario: Devicon fallback for missing Simple Icon

- GIVEN `techStack: ["nestjs"]` where NestJS has a Devicon but no Simple Icon entry
- WHEN the `TechStack` component renders
- THEN the NestJS Devicon SVG is inlined

#### Scenario: Missing icon renders fallback

- GIVEN `techStack: ["customtool"]` with no matching icon in either source
- WHEN the `TechStack` component renders
- THEN a generic code icon or text label is displayed as fallback
- AND no broken image or empty space appears

### Requirement: TechIcon Component API

A `<TechIcon />` component SHALL accept the following props:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `name` | `string` | Yes | — | Icon key (lowercase, kebab-case normalized) |
| `size` | `number \| string` | No | `24` | Width and height in px or CSS value |
| `color` | `string` | No | `"currentColor"` | CSS color value |

The component SHALL normalize `name` internally: lowercase, replace spaces with hyphens, strip special characters. It SHALL NOT throw if an icon is not found — render a text fallback instead.

#### Scenario: Named icon renders at default size

- GIVEN `<TechIcon name="docker" />`
- WHEN rendered
- THEN the Docker SVG appears at 24×24px with `currentColor`

#### Scenario: Custom size and color

- GIVEN `<TechIcon name="postgresql" size="32" color="#336791" />`
- WHEN rendered
- THEN the PostgreSQL SVG appears at 32×32px with color `#336791`

#### Scenario: Name normalization

- GIVEN `<TechIcon name="AWS Lambda" />`
- WHEN the component resolves the icon
- THEN the name is normalized to `aws-lambda` before lookup

### Requirement: TechStack Grid Component

A `<TechStack />` component SHALL accept a `techStack: string[]` prop (from project frontmatter) and render icons in a responsive grid. The grid SHALL use CSS Grid with `auto-fill` and minimum item size of `48px`. Each icon SHALL render at `28px` with `--color-text-secondary` color.

#### Scenario: Tech stack grid renders multiple icons

- GIVEN `techStack: ["typescript", "docker", "postgresql", "nestjs", "aws"]`
- WHEN `<TechStack techStack={techStack} />` renders
- THEN five icons appear in a responsive grid
- AND each has a tooltip or `title` attribute with the technology name

#### Scenario: Single icon renders

- GIVEN `techStack: ["nodejs"]`
- WHEN `<TechStack techStack={techStack} />` renders
- THEN one icon appears in the grid
- AND the grid does not break

### Requirement: Local Icon Overrides

The project MAY include custom SVG icons in `src/icons/` for technologies not covered by Simple Icons or Devicon. Override icons SHALL take priority over iconify sources.

#### Scenario: Local override takes priority

- GIVEN `src/icons/custom.svg` exists
- WHEN `<TechIcon name="custom" />` renders
- THEN the local `custom.svg` is used instead of any iconify match
