# Terminal Theme Specification

## Purpose

Define a dark-only design token system via CSS custom properties, the typography scale with self-hosted JetBrains Mono and Inter, and the CSS architecture for a terminal-inspired aesthetic.

## Requirements

### Requirement: Dark-Only Color Tokens

The site SHALL define a set of CSS custom properties in `:root` with NO `prefers-color-scheme` media query and NO theme toggle. The palette MUST follow a terminal-inspired hierarchy:

| Token | Role | Example Value |
|-------|------|---------------|
| `--color-bg-primary` | Page background | `#0d0d0d` |
| `--color-bg-secondary` | Card / section background | `#1a1a1a` |
| `--color-bg-tertiary` | Hover states, code blocks | `#252525` |
| `--color-bg-code` | Inline code background | `#111111` |
| `--color-bg-navigation` | Nav bar background | `#080808` |
| `--color-text-primary` | Body text | `#e0e0e0` |
| `--color-text-secondary` | Secondary text, labels | `#a0a0a0` |
| `--color-text-muted` | Disabled, footnotes | `#606060` |
| `--color-text-accent` | Highlight, terminal prompt | `#00ff41` |
| `--color-text-link` | Hyperlinks | `#58a6ff` |
| `--color-border` | Dividers, borders | `#2a2a2a` |
| `--color-border-accent` | Active, focus borders | `#00ff4133` |

Additional terminal accent colors SHALL be available (`--color-terminal-green`, `--color-terminal-amber`, `--color-terminal-red`, `--color-terminal-cyan`, `--color-terminal-magenta`).

#### Scenario: Dark theme always renders

- GIVEN a user with a light OS theme preference
- WHEN any page loads
- THEN the page renders in the dark-only palette
- AND no `prefers-color-scheme` media query affects the colors

#### Scenario: No theme toggle exists

- GIVEN any page on the site
- WHEN the user inspects the page
- THEN there is no theme toggle button or switch
- AND no JavaScript toggles CSS class-based themes

### Requirement: Typography Scale

The site SHALL self-host two font families via `@fontsource` packages:

| Family | Weight | Role | Package |
|--------|--------|------|---------|
| JetBrains Mono | 400, 700 | Headings, code, technical data, terminal UI | `@fontsource/jetbrains-mono` |
| Inter | 400, 500, 600 | Body text, labels, navigation | `@fontsource/inter` |

Fonts SHALL be imported in the base layout. The CSS SHALL define `--font-mono` and `--font-sans` properties. Fallback stacks SHALL include system fonts in case of loading failure.

#### Scenario: Mono font renders on headings

- GIVEN the base layout imports JetBrains Mono via `@fontsource`
- WHEN a `<h1>` element renders
- THEN the heading uses JetBrains Mono with monospace fallback

> **Note**: This applies to terminal-themed pages (about, contact) where monospace headings are used intentionally for a command-line aesthetic. General headings (`h1`–`h6` in `global.css`) use Inter per DESIGN.md. Terminal-themed pages MAY use monospace headings for aesthetic consistency with the terminal brand.

#### Scenario: Sans font renders on body text

- GIVEN the base layout imports Inter via `@fontsource`
- WHEN a `<p>` element renders
- THEN the body text uses Inter with system-ui fallback

### Requirement: Spacing and Layout Tokens

The token system SHALL include a spacing scale and layout constraints:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.25rem` | Tight gaps |
| `--space-sm` | `0.5rem` | Inline spacing |
| `--space-md` | `1rem` | Block gaps |
| `--space-lg` | `2rem` | Section gaps |
| `--space-xl` | `4rem` | Page section spacing |
| `--content-max-width` | `720px` | Reading width |
| `--content-padding` | `1.5rem` | Horizontal padding |

#### Scenario: Content constrained to max width

- GIVEN a project detail page with long-form text
- WHEN the viewport exceeds 720px
- THEN the content column does not exceed `--content-max-width`
- AND the column is horizontally centered

### Requirement: CSS Architecture

Styling SHALL use vanilla CSS with custom properties. Tailwind CSS MUST NOT be used. Global styles SHALL be loaded from `src/styles/tokens.css`. Component-specific styles SHALL use scoped `<style>` tags in Astro components.

#### Scenario: No Tailwind in build

- GIVEN the project's `package.json`
- WHEN inspecting dependencies
- THEN `tailwindcss` is NOT present

#### Scenario: Component styles are scoped

- GIVEN a `<style>` block inside an Astro component
- WHEN the component renders
- THEN its styles do NOT leak to other components
