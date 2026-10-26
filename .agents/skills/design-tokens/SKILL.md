---
name: design-tokens
description: Style kv-* components with Kelvin's design tokens, and edit the token sources. Use when writing or changing component SCSS (colors, spacing, typography, borders), exposing a component-scoped custom property, replacing the legacy kv-color(), kv-font-* or $spacing-* helpers, or changing anything under packages/ui-components/tokens/.
---

# Design tokens

The project uses **Style Dictionary v5** with **Tokens Studio transforms** to compile design tokens from JSON into CSS custom properties and SCSS mixins.

## Token Directory Structure

```
packages/ui-components/tokens/
├── core/                          # Primitive/foundational tokens
│   ├── foundations_primitives.json  # Colors (gray, brand, teal, green, etc.)
│   ├── tipography.json              # Font sizes, line-heights, letter-spacing (filename kept as-is)
│   ├── spacing.json                 # Size and spacing scales
│   └── icon.json                    # Icon sizing
├── semantic/                      # Theme-dependent tokens
│   ├── light.json                   # Light theme color mappings
│   └── dark.json                    # Dark theme color mappings
├── components/                    # Component-specific tokens
│   └── component_semantics.json     # Buttons, inputs, containers, cards
└── styles/                        # Typography design styles (Figma export)
    └── text.json                    # Heading, body, label styles
```

## Generated Output

```
packages/ui-components/src/assets/styles/style-dictionary/
├── core.css                       # Core CSS variables (:root)
├── component_semantics.css        # Component-level variables (body selector)
├── styles-mixins.scss             # Typography SCSS @mixin directives
├── themes/
│   ├── light.css                  # Light theme (body[mode="light"])
│   └── dark.css                   # Dark theme (body[mode="night"])
└── index.css                      # Master import file
```

## Building Tokens

```bash
# Build tokens (runs style-dictionary + stylelint fix)
cd packages/ui-components
pnpm tokens:build
```

Run this whenever you change any file in `tokens/`.

## Token Naming Convention

Tokens follow a **kebab-case hierarchical** pattern: `--category-subcategory-property-state`

| Layer | Example | CSS Output |
|-------|---------|------------|
| Core / primitives | `color.gray.50` | `--color-gray-50: #fff` |
| Core / spacing | `space.16` | `--space-16: 16px` |
| Semantic | `background.surface.default` | `--background-surface-neutral-default: var(--color-gray-50)` |
| Component | `button.height.regular` | `--button-height-regular: 32px` |

State suffixes: `default`, `hover`, `pressed`, `disabled`, `selected`.

## Using Tokens in Component SCSS

> **Prefer component semantic tokens.** When styling components, always reach for tokens from `component_semantics.css` first (e.g. `--button-*`, `--input-*`). Only fall back to generic semantic tokens (e.g. `--background-surface-neutral-default`) when no component-specific token exists, and only use core primitives (e.g. `--color-gray-50`) as a last resort.

**CSS custom properties (semantic tokens — preferred for colors/spacing):**
```scss
.my-element {
  background: var(--background-surface-neutral-default);  // Semantic — theme-aware
  color: var(--text-surface-neutral-primary);
  padding: var(--space-16);
  border: 1px solid var(--border-neutral-default);
}
```

**SCSS typography mixins (generated from `styles-mixins.scss`):**
```scss
@use '../../assets/styles' as *;

.title {
  @include heading-xl-semibold;   // Sets font-family, weight, size, line-height
  color: var(--text-surface-neutral-primary);
}

.body-text {
  @include body-m-regular;
}
```

Available mixin families: `heading-{xxl|xl|lg|m|sm|xs}-{regular|semibold|bold}`, `body-{l|m|s|xs}-{regular|semibold|bold}`, `label-{l|m|s}-{regular|semibold|bold|regular-caps}`.

## Component-Scoped Custom Properties

Components expose their own CSS custom properties via `:host` to allow external customization, backed by semantic tokens:

```scss
:host {
  --my-component-background: var(--background-surface-neutral-default);
  --my-component-padding: var(--space-16);
}

.my-component-container {
  background: var(--my-component-background);
  padding: var(--my-component-padding);
}
```

## Deprecated / Legacy Patterns (avoid in new code)

| Deprecated | Replacement |
|-----------|-------------|
| `kv-color('neutral-0')` | `var(--color-gray-950)` or semantic token |
| `@include kv-font-h1-semibold` | `@include heading-xxl-semibold` |
| `$spacing-4x` | `var(--spacing-2xl)` |

Legacy utilities still compile but are being phased out. Prefer CSS variables and generated mixins in all new or modified components. See `packages/ui-components/MIGRATION.md` for the full mapping.
