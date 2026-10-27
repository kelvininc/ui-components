# AI Agent Guide - Kelvin UI Components

This guide holds the commands and the rules for working in the Kelvin UI Components monorepo. Step-by-step procedures are skills, and reference material is in `docs/`:

- **`component-create` skill** — file structure, creating a component, changing an existing one
- **`design-tokens` skill** — the token pipeline, naming, using tokens in component SCSS, legacy helpers to replace
- **`react-tests` skill** — the React package's Vitest projects, Stencil mocks, browser-test helpers and where tests live
- **`primitives-and-schema-form` skill** — rules for changing components others render, focus and accessible names, built-in labels, and SchemaForm
- [docs/architecture.md](docs/architecture.md) — packages and build outputs, StencilJS concepts, configuration files, key directories, versioning and deployment
- [docs/troubleshooting.md](docs/troubleshooting.md) — fixes for module-not-found, Storybook, type, test and pnpm problems

The skills live in `.agents/skills/`, linked from `.claude/skills/` and `.codex/skills/`, so Claude Code and Codex both find them.

## 📋 Project Overview

**Repository**: Kelvin UI Components (public)
**Type**: Monorepo (Lerna + pnpm workspaces)
**Purpose**: Framework-agnostic UI component library built with StencilJS, with React bindings
**Public Storybook**: https://kelvininc.github.io/ui-components/

- `packages/ui-components/` — `@kelvininc/ui-components`, the core StencilJS web components
- `packages/react-ui-components/` — `@kelvininc/react-ui-components`, React bindings generated from the core components, with `client`, `server` and `shared` entry points
- `apps/react-storybook/` — the Storybook documentation app (private)

## 🔧 System Requirements

- **Node.js**: >= 24 (specified in engines)
- **pnpm**: v10.33.4 (exact version, specified in packageManager)

## 🚀 Essential Commands

```bash
pnpm install          # Install dependencies (pnpm workspace)
pnpm build:packages   # Build all packages (before apps)
pnpm build            # Build the entire monorepo
pnpm storybook        # Run Storybook on http://localhost:6006
pnpm build:apps       # Build the Storybook app only
pnpm test             # Core tests, then build:packages and the React unit tests
pnpm lint             # Lint all packages
pnpm lint:fix         # Fix linting issues
pnpm clean            # Clean everything (also clean:packages, clean:apps)
```

Package-specific:

```bash
cd packages/ui-components && pnpm build         # also: pnpm test, pnpm test:watch, pnpm test -- kv-button, pnpm lint
cd packages/ui-components && pnpm tokens:build  # after any change under tokens/
cd packages/react-ui-components && pnpm build  # also: pnpm build:watch, pnpm test, pnpm test:browser (react-tests skill)
cd apps/react-storybook && pnpm dev             # also: pnpm build
```

## ⚠️ Rules and gotchas

- **Build packages before apps.** After any change in `packages/ui-components` (component source, types or enums), run `pnpm build:packages` from the root before `react-ui-components` or Storybook can see it; skipping it leaves them on stale types and missing exports.
- **Enum exports are kept in sync by hand.** When an enum is added to or removed from `packages/ui-components`, update the named export list in `packages/react-ui-components/src/ui-components.ts`. `export type *` alone doesn't carry enums, because they are runtime values. The `component-create` skill shows an example.
- **Naming.** Component tags carry the `kv-` prefix (`tag: 'kv-badge'`); their directories don't (`components/badge/`), and use kebab-case. React components drop the prefix: `<KvBadge />`, imported from `@kelvininc/react-ui-components/client` for client-side rendering.
- **Components** use Shadow DOM (`shadow: true`) and are themed only through design tokens: `light` and `night` come from the `mode` attribute on `<body>`, never from per-theme SCSS.
- **Styling** uses design tokens, preferring component semantic tokens, then semantic tokens, then core primitives. The legacy `kv-color()`, `@include kv-font-*` and `$spacing-*` helpers still compile but are being phased out. Follow the `design-tokens` skill.
- **Patches**: `patches/` holds the pnpm patch for `@pxtrn/storybook-addon-docs-stencil@8.0.0`. Don't delete it: install needs it.
- **Post-install**: React components copy icon assets in a post-install script; Storybook runs it with `CUSTOM_INST=true`.
- **Versions** are exact between packages (no semver ranges) and use `workspace:*` internally.

## 🔄 Git Workflow

- **PRs target `dev`; `master` is the release branch.**
- Releases derive the version from the latest `vX.Y.Z` tag. No version or changelog commit is pushed to `master`, so the manifests in git aren't the source of truth. Details: [docs/architecture.md](docs/architecture.md#versioning).

### Commit Messages

This project follows the [Conventional Commits](https://conventionalcommits.org/) specification. All commits are validated by commitlint.

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
- Skip CI: `[skip ci]` for the pre-release version commits on `alpha`/`beta`

**Commit Body** (optional):
- Add detailed description after a blank line
- Explain what changed and why
- List breaking changes with `BREAKING CHANGE:` prefix
