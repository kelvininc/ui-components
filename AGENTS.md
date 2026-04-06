# AI Agent Guide - Kelvin UI Components

This guide provides essential information for AI agents to effectively understand and work with the Kelvin UI Components monorepo.

## 📋 Project Overview

**Repository**: Kelvin UI Components
**Type**: Monorepo (Lerna + pnpm workspaces)
**Purpose**: Framework-agnostic UI component library built with StencilJS, with React bindings
**Public Storybook**: https://kelvininc.github.io/ui-components/

## 🏗️ Architecture

### Monorepo Structure

```
ui-components/
├── packages/
│   ├── ui-components/           # Core StencilJS web components
│   ├── react-ui-components/     # React bindings (auto-generated)
│   └── angular-ui-components/   # Angular bindings
└── apps/
    └── react-storybook/         # Storybook documentation app
```

### Key Technologies

- **Core**: StencilJS (web components compiler)
- **Testing**: Jest + Puppeteer (E2E)
- **Styling**: SASS
- **Design Tokens**: Style Dictionary v5 + Tokens Studio transforms
- **Build**: Rollup (for React), Stencil CLI (for core)
- **Monorepo**: Lerna v9 + pnpm workspaces
- **Documentation**: Storybook v8
- **Commit Conventions**: Conventional Commits (with commitlint)

## 🔧 System Requirements

- **Node.js**: >= 22 (specified in engines)
- **pnpm**: v8.15.9 (exact version, specified in packageManager)
- **Operating System**: macOS, Linux, or Windows with WSL

## 📦 Package Dependencies

### Core Package (`@kelvininc/ui-components`)
- Source: `packages/ui-components/`
- Build outputs:
  - ESM (`dist/esm/`)
  - CJS (`dist/cjs/`)
  - Custom Elements (`components/`)
  - TypeScript types (`dist/types/`)
  - Loader (`loader/`)
  - Collection manifest (`dist/collection/`)

### React Package (`@kelvininc/react-ui-components`)
- Source: `packages/react-ui-components/`
- Auto-generated from core components via Stencil React Output Target
- Proxies file: `src/stencil-generated/index.ts`
- Builds with Rollup
- **Multiple entry points for different environments**:
  - `client` - Client-side rendering (CSR)
  - `server` - Server-side rendering (SSR)
  - `shared` - Shared utilities
  - Import example: `import { KvBadge } from '@kelvininc/react-ui-components/client'`

### Storybook App (`@kelvininc/react-storybook`)
- Source: `apps/react-storybook/`
- Private package (not published)
- Uses custom Stencil addon: `@pxtrn/storybook-addon-docs-stencil` (patched)

## 🚀 Essential Commands

### Initial Setup

```bash
# Install dependencies (uses pnpm workspace)
pnpm install

# Build all packages (must build packages before apps)
pnpm build:packages

# Build entire monorepo
pnpm build
```

### Development Workflow

```bash
# Run Storybook (development mode)
pnpm storybook
# Opens on http://localhost:6006

# Build packages only
pnpm build:packages

# Build Storybook app only
pnpm build:apps

# Run tests (core components only)
pnpm test

# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Cleaning

```bash
# Clean everything
pnpm clean

# Clean packages only
pnpm clean:packages

# Clean apps only
pnpm clean:apps
```

### Package-Specific Commands

```bash
# Work on core components
cd packages/ui-components
pnpm build
pnpm test
pnpm test.watch

# Work on React components
cd packages/react-ui-components
pnpm build
pnpm build:watch

# Work on Storybook
cd apps/react-storybook
pnpm dev
pnpm build
```

## 🎯 Common Development Tasks

### Understanding StencilJS Components

**Key Concepts:**
- **Shadow DOM**: All components use `shadow: true` for style encapsulation
- **Host Element**: Use `:host` selector in SCSS to style the component's host element
- **Slots**: Support content projection using `<slot />` elements
- **Props**: Use `@Prop()` decorator for component properties
- **Events**: Use `@Event()` decorator to emit custom events
- **Methods**: Use `@Method()` decorator to expose public methods
- **State**: Use `@State()` decorator for internal component state

**Theme System:**
- Components support dual themes: `light` and `night` (dark)
- Theme is set via `mode` attribute on `<body>`: `<body mode="light">` or `<body mode="night">`
- CSS custom properties cascade: `:root` (core primitives) → `body[mode]` (semantic) → component styles
- Theming is handled entirely through design tokens — no per-theme SCSS files needed
- Configure via `styleUrls` in component decorator

**Global Configuration:**
- Initialize via `initialize()` function from package
- Set base assets URL for icons and symbols
- Configuration stored in `window.KvUiComponents.config`

### Design Token System

The project uses **Style Dictionary v5** with **Tokens Studio transforms** to compile design tokens from JSON into CSS custom properties and SCSS mixins.

#### Token Directory Structure

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

#### Generated Output

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

#### Building Tokens

```bash
# Build tokens (runs style-dictionary + stylelint fix)
cd packages/ui-components
pnpm tokens:build
```

Run this whenever you change any file in `tokens/`.

#### Token Naming Convention

Tokens follow a **kebab-case hierarchical** pattern: `--category-subcategory-property-state`

| Layer | Example | CSS Output |
|-------|---------|------------|
| Core / primitives | `color.gray.50` | `--color-gray-50: #fff` |
| Core / spacing | `space.16` | `--space-16: 16px` |
| Semantic | `background.surface.default` | `--background-surface-neutral-default: var(--color-gray-50)` |
| Component | `button.height.regular` | `--button-height-regular: 32px` |

State suffixes: `default`, `hover`, `pressed`, `disabled`, `selected`.

#### Using Tokens in Component SCSS

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

#### Component-Scoped Custom Properties

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

#### Deprecated / Legacy Patterns (avoid in new code)

| Deprecated | Replacement |
|-----------|-------------|
| `kv-color('neutral-0')` | `var(--color-gray-950)` or semantic token |
| `@include kv-font-h1-semibold` | `@include heading-xxl-semibold` |
| `$spacing-4x` | `var(--space-16)` |

Legacy utilities still compile but are being phased out. Prefer CSS variables and generated mixins in all new or modified components. See `MIGRATION.md` for the full mapping.

### Component File Structure

Each component follows a consistent structure in `packages/ui-components/src/components/[component-name]/`:

**Required Files:**
- `[component-name].tsx` - Main component logic (StencilJS component)
- `[component-name].types.ts` - TypeScript interfaces and enums
- `readme.md` - Auto-generated documentation (generated by Stencil)

**Styling Files:**
- `[component-name].scss` - Single stylesheet using CSS custom properties from design tokens

**Optional Files:**
- `[component-name].config.ts` - Configuration constants
- `[component-name].helper.ts` / `[component-name].utils.ts` - Helper functions
- `test/[component-name].spec.tsx` - Unit tests (Jest)
- `test/[component-name].e2e.ts` - E2E tests (Puppeteer)
- `test/__snapshots__/` - Jest snapshots
- `usage/react.md` - React-specific usage documentation

**Examples:**

Simple component (`badge/`):
```
badge/
├── badge.tsx
├── badge.types.ts
├── badge.scss
├── readme.md
└── usage/
    └── react.md
```

Complex component (`calendar/`):
```
calendar/
├── calendar.tsx
├── calendar.types.ts
├── calendar.scss
├── calendar.config.ts
├── calendar.helper.ts
├── readme.md
├── test/
│   ├── calendar.spec.tsx
│   ├── calendar.e2e.ts
│   └── __snapshots__/
└── usage/
    └── react.md
```

### Adding a New Component

1. **Create component directory in core package**:
   - Location: `packages/ui-components/src/components/[component-name]/`
   - Note: Use kebab-case, no `kv-` prefix in directory name

2. **Create required files**:
   - `[component-name].tsx` - Component logic with `tag: 'kv-[component-name]'`
   - `[component-name].types.ts` - TypeScript types
   - `[component-name].scss` - Single stylesheet using design token CSS custom properties

3. **Add optional files as needed**:
   - `[component-name].config.ts` - For constants
   - `[component-name].utils.ts` - For helper functions
   - `test/[component-name].spec.tsx` - Unit tests
   - `test/[component-name].e2e.ts` - E2E tests

4. **Build the core package**:
   ```bash
   cd packages/ui-components
   pnpm build
   ```
   - This generates the `readme.md` documentation
   - React bindings are auto-generated via `reactOutputTarget` in `stencil.config.ts`

5. **Create Storybook story**:
   - Location: `apps/react-storybook/src/components/[category]/[component-name]/`
   - Categories: `buttons/`, `data-display/`, `dropdown/`, `feedback/`, `form/`, `inputs/`, `media/`, `navigation/`, `popover/`, `select/`, `time-picker/`
   - Create `[ComponentName].stories.tsx` (use PascalCase for component name)
   - Example: `apps/react-storybook/src/components/data-display/badge/Badge.stories.tsx`
   - Import from `@kelvininc/react-ui-components/client` for client-side rendering

6. **Build and test**:
   ```bash
   pnpm build:packages
   pnpm storybook
   ```

### Modifying Existing Components

1. **Edit source files** in `packages/ui-components/src/components/[component-name]/`
   - Note: Directory names use kebab-case without `kv-` prefix
   - Component tags in `.tsx` files include `kv-` prefix: `tag: 'kv-badge'`
2. **Rebuild packages**: `pnpm build:packages`
3. **View changes in Storybook**: `pnpm storybook`

> ⚠️ **Build required after any change to `packages/ui-components`**: The core package is consumed by `packages/react-ui-components` and `apps/react-storybook` via Rollup. Any change to component source, types, or enums in `packages/ui-components` **must be followed by a build** before those changes are available in dependent packages and apps. Skipping the build means downstream consumers (including Storybook stories) will see stale types and missing exports.
>
> ```bash
> # Run from the repository root — builds all packages in the correct order:
> pnpm build:packages
> ```

> ⚠️ **Enum exports must be kept in sync**: Whenever an enum is **added or removed** from `packages/ui-components`, the named export list in `packages/react-ui-components/src/ui-components.ts` **must be updated manually** to include or remove it. This file is the bridge that makes enums available as runtime values (not just types) to consumers of `@kelvininc/react-ui-components`.
>
> The file has an explicit named export block — `export type *` alone is **not sufficient** for enums since they are runtime values, not just types.
>
> **Example** — after adding `ETagColor` to `packages/ui-components`:
> ```ts
> // packages/react-ui-components/src/ui-components.ts
> export {
>   // ... existing enums ...
>   ETagColor,  // ← add new enum here
> } from '@kelvininc/ui-components';
> ```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (in ui-components package)
cd packages/ui-components
pnpm test.watch

# Run specific test file
cd packages/ui-components
pnpm test -- kv-button
```

### Linting and Formatting

```bash
# Check for linting errors
pnpm lint

# Auto-fix linting errors
pnpm lint:fix

# Lint specific package
cd packages/ui-components
pnpm lint
```

## 📝 Important Configuration Files

### Root Level
- `lerna.json` - Lerna configuration (version management, publish settings)
- `pnpm-workspace.yaml` - Workspace package definitions
- `package.json` - Root scripts and shared devDependencies
- `commitlint.config.js` - Conventional commit enforcement

### Core Package (`packages/ui-components/`)
- `stencil.config.ts` - StencilJS configuration
  - Output targets (dist, custom-elements, React output)
  - Testing configuration
  - SASS plugin
- `tsconfig.json` - TypeScript configuration

### React Package (`packages/react-ui-components/`)
- `rollup.config.js` - Rollup bundler configuration
- `tsconfig.json` - TypeScript configuration

### Storybook (`apps/react-storybook/`)
- `.storybook/` directory - Storybook configuration
- `project.json` - Nx project configuration (if using Nx)

## 🔍 Key Directories

### Source Code
- `packages/ui-components/src/components/` - Core component implementations
- `packages/ui-components/src/types/` - Shared TypeScript types
- `packages/ui-components/src/utils/` - Utility functions
- `packages/react-ui-components/src/stencil-generated/` - Auto-generated React bindings
- `apps/react-storybook/src/components/` - Storybook stories

### Build Outputs
- `packages/ui-components/dist/` - Built core components
- `packages/ui-components/components/` - Custom elements build
- `packages/ui-components/loader/` - Lazy loading utilities
- `packages/react-ui-components/dist/` - Built React components
- `apps/react-storybook/storybook-static/` - Built Storybook

### Documentation
- `packages/ui-components/docs/` - Auto-generated component docs
- `packages/ui-components/src/components/*/readme.md` - Component-specific docs

## ⚠️ Important Notes

### Build Order Matters
**Always build packages before apps**:
```bash
# Correct order:
pnpm build:packages  # First
pnpm build:apps      # Then apps

# Or use the combined command:
pnpm build
```

### Workspace Dependencies
- Packages use `workspace:*` protocol for internal dependencies
- React components depend on core components
- Storybook depends on both core and React components

### Patch Files
- `patches/` directory contains pnpm patches for modified dependencies
- Currently patches: `@pxtrn/storybook-addon-docs-stencil@8.0.0`
- Don't delete patches folder - required for install

### Post-Install Scripts
- React components have a post-install script to copy icon assets
- Storybook also runs this script with `CUSTOM_INST=true` flag

### Version Management
- Uses Lerna for version management
- Versions are exact (not using semver ranges between packages)
- Conventional commits drive changelog generation

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Ensure all dependencies are installed
pnpm install

# Rebuild packages in order
pnpm clean:packages
pnpm build:packages
```

### Storybook won't start
```bash
# Clean and rebuild everything
pnpm clean
pnpm install
pnpm build:packages
pnpm storybook
```

### Type errors in React components
```bash
# React types are auto-generated from core components
cd packages/ui-components
pnpm build

# This regenerates the types in react-ui-components
cd ../react-ui-components
pnpm build
```

### Tests failing
```bash
# Ensure you're in the correct package
cd packages/ui-components

# Clean and rebuild
pnpm clean
pnpm build
pnpm test
```

### pnpm version issues
```bash
# Use the exact version specified
corepack enable
corepack prepare pnpm@8.15.9 --activate
```

## 📚 Component Naming Convention

- All components are prefixed with `kv-` (e.g., `kv-button`, `kv-calendar`)
- Use kebab-case for component names
- React components drop the prefix in JSX: `<KvButton />` instead of `<kv-button>`

## 🔄 Git Workflow

### Commit Messages

This project follows [Conventional Commits](https://conventionalcommits.org/) specification. All commits are validated by commitlint.

**Format**: `<type>(<scope>): <subject>`

**Common Types:**
- `feat` - New features or enhancements
- `fix` - Bug fixes
- `docs` - Documentation changes
- `chore` - Maintenance tasks (releases, dependencies)
- `refactor` - Code refactoring without feature changes
- `perf` - Performance improvements
- `test` - Test additions or updates
- `style` - Code style/formatting changes
- `build` - Build system changes
- `ci` - CI/CD changes
- `revert` - Revert previous commits

**Scope** (optional but recommended):
- Component name (e.g., `badge`, `dropdown`, `text-field`)
- Area of change (e.g., `icons`, `storybook`, `schema-form`)
- Omit scope for global changes

**Breaking Changes:**
- Use `!` after type/scope or add `BREAKING CHANGE:` in commit body
- Example: `refactor(icon)!: remove legacy icons`

**Optional Elements:**
- Issue reference: `[KFE-2506]` at the end of subject
- Skip CI: `[skip ci]` for release commits

**Commit Body** (optional):
- Add detailed description after a blank line
- Explain what changed and why
- List breaking changes with `BREAKING CHANGE:` prefix

### Versioning
- Managed by Lerna
- Uses conventional commits to determine version bumps:
  - `feat:` → Minor version bump (0.x.0)
  - `fix:` → Patch version bump (0.0.x)
  - `BREAKING CHANGE` → Major version bump (x.0.0)
- Changelog auto-generated from commit messages
- Release commits: `chore(release): publish vX.Y.Z [skip ci]`

## 🚢 Deployment

### Storybook Deployment
```bash
# Build and deploy to GitHub Pages
pnpm storybook:deploy
```

### Package Publishing
- Packages are published to npm with `@kelvininc` scope
- Public access (specified in publishConfig)
- Managed via Lerna publish workflow
- Uses OIDC trusted publishing (no npm tokens required)
- CI workflow: `.github/workflows/publish-master.yml`

## 🔗 Useful Links

- **Repository**: https://github.com/kelvininc/ui-components
- **Storybook**: https://kelvininc.github.io/ui-components/
- **Documentation**: https://docs.kelvininc.com
- **Support**: support@kelvininc.com

## 🎓 Learning Resources

- **StencilJS Docs**: https://stenciljs.com/docs/introduction
- **Lerna Docs**: https://lerna.js.org/
- **pnpm Workspaces**: https://pnpm.io/workspaces
- **Storybook Docs**: https://storybook.js.org/docs

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Build all | `pnpm build` |
| Build packages | `pnpm build:packages` |
| Start Storybook | `pnpm storybook` |
| Run tests | `pnpm test` |
| Lint | `pnpm lint` |
| Clean | `pnpm clean` |

**Remember**: Always build packages before building apps!
