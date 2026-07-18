# Project Case Study Specification

## Purpose

Define the MDX content collection for backend architecture case studies — frontmatter schema, embedded Mermaid diagrams, metrics display, and project ordering on listing pages.

## Requirements

### Requirement: Frontmatter Schema

The `projects` content collection MUST validate MDX frontmatter against a Zod schema with these fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | `string` | Yes | Project title |
| `company` | `string` | Yes | Organization name |
| `period.start` | `Date` | Yes | Coerced from string |
| `period.end` | `Date` | No | Absent = ongoing |
| `role` | `string` | Yes | e.g., "Backend Lead" |
| `techStack` | `string[]` | Yes | Non-empty; maps to icon keys |
| `tags` | `string[]` | Yes | Non-empty |
| `metrics` | `{label, value, direction}[]` | Yes | At least one; `direction` ∈ `"up" \| "down" \| "neutral"` |
| `featured` | `boolean` | No | Default `false` |
| `order` | `number` | No | Manual sort override |
| `published` | `boolean` | No | Default `true` |

Invalid or missing required fields SHALL fail `astro build` with a Zod validation error naming the offending field.

#### Scenario: Valid frontmatter passes build

- GIVEN an MDX file with all required fields populated correctly
- WHEN `astro build` runs
- THEN the build completes without errors and the project appears on `/projects`

#### Scenario: Missing required field fails build

- GIVEN an MDX file missing the `techStack` field
- WHEN `astro build` runs
- THEN the build fails with a Zod error naming `techStack`

#### Scenario: Invalid enum fails build

- GIVEN `direction: "sideways"` in a metric
- WHEN `astro build` runs
- THEN the build fails with a Zod enum error

### Requirement: Project Listing Order

The `/projects` listing SHALL order by descending `period.start`. `featured` projects MAY render first. If `order` is present, it SHALL override date sorting.

#### Scenario: Featured project appears first

- GIVEN two projects: one featured (2022), one non-featured (2024)
- WHEN `/projects` renders
- THEN the featured project appears first

#### Scenario: Manual order overrides date

- GIVEN a project with `order: 1` from 2020 and another with `order: 2` from 2024
- WHEN `/projects` renders
- THEN `order: 1` appears first despite the older date

### Requirement: Mermaid Diagram Embedding

Case study MDX bodies MAY include Mermaid diagrams via `astro-mermaid`. The `ArchitectureDiagram` component SHALL wrap Mermaid blocks with `client:visible`. Diagrams SHALL render with `theme: "dark"`.

#### Scenario: Diagram renders on scroll

- GIVEN a project page with a C4 Mermaid diagram
- WHEN the user scrolls to the diagram
- THEN it renders as SVG with dark theme palette

#### Scenario: Multiple diagrams coexist

- GIVEN a project page with two Mermaid diagrams (C4 + Sequence)
- WHEN the page loads
- THEN both render independently without conflict

### Requirement: Metrics Display

The `MetricsBar` component SHALL render frontmatter metrics as a horizontal bar with `value` and `label`. Each metric MAY show direction: green arrow (`up`), red arrow (`down`), dash (`neutral`).

#### Scenario: Metric renders with direction

- GIVEN `metrics: [{label: "Latency", value: "-40%", direction: "down"}]`
- WHEN the project page renders
- THEN the bar shows "-40% Latency" with a green down-arrow

### Requirement: Content Structure Convention

Case studies SHALL follow five sections: **Context** → **Architecture** → **Implementation** → **Results** → **Lessons**. This is an authoring convention, not enforced at build time.

#### Scenario: Five-section case study renders

- GIVEN an MDX file following the five-section structure
- WHEN rendered on a project detail page
- THEN all five sections appear in order with correct heading hierarchy
