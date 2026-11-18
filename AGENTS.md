# AI Agent Guide - Kelvin UI Components

This guide holds the commands and the rules for working in the Kelvin UI Components monorepo. Step-by-step procedures are skills, and reference material is in `docs/`:

- **`design-tokens` skill** — the token pipeline, naming, using tokens in component SCSS, legacy helpers to replace
- **`tokens-sync` skill** — regenerate the token JSON files from the Figma variables table via the Figma MCP, no plugin run needed
- **`react-tests` skill** — the React package's Vitest projects, Stencil mocks, browser-test helpers and where tests live
- **`primitives-and-schema-form` skill** — rules for changing components others render, focus and accessible names, built-in labels, and SchemaForm
- [Package map](PACKAGES.md) — public entries, catalog links and internal workspace responsibilities
- [Component patterns](docs/component-patterns.md) — read before creating, changing or reviewing Stencil structure, naming, exports or stories
- [docs/architecture.md](docs/architecture.md) — packages and build outputs, StencilJS concepts, configuration files, key directories, versioning and deployment
- [docs/troubleshooting.md](docs/troubleshooting.md) — fixes for module-not-found, Storybook, type, test and pnpm problems

The skills live in `.agents/skills/`, linked from `.claude/skills/` and `.codex/skills/`, so Claude Code and Codex both find them.

The `frontend-plugins` plugin from the [Kelvin marketplace](https://github.com/kelvininc/agents) adds two React skills from Vercel: `vercel-react-best-practices` for performance work in `react-ui-components`, and `vercel-composition-patterns` for component APIs. Skip the composition skill's React 19 section (`react19-no-forwardref`) while `react-ui-components` still supports React 18. `.claude/settings.json` turns the plugin on for Claude Code; in Codex, run `codex plugin marketplace add kelvininc/agents`, then `codex plugin add frontend-plugins@kelvin-plugins-official`.

Before choosing or changing a shared control, read [API discovery](docs/api-discovery.md). Build Stencil metadata, then run `pnpm docs:generate`; never hand-edit API.md or manifest.json.

Before implementing, refactoring or reviewing authored React code, use `frontend-plugins:react-code-quality` and read [React compatibility](docs/react-compatibility.md). The shared package must support React 18.3.1 even when Storybook uses React 19. Look up library APIs in Context7 at the supported consumer version and verify the returned source version.

Before adding or changing named code units, read [code quality and documentation](docs/code-quality.md).

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
pnpm test:unit        # Core and React unit tests (build packages first)
pnpm lint             # Lint all packages
pnpm lint:fix         # Fix linting issues
pnpm clean            # Clean everything (also clean:packages, clean:apps)
```

Package-specific:

```bash
cd packages/ui-components && pnpm build         # also: pnpm test, pnpm test:watch, pnpm test -- kv-button, pnpm lint
cd packages/ui-components && pnpm tokens:build  # after any change under tokens/
cd packages/ui-components && pnpm typecheck     # after a build, which generates src/components.d.ts
cd packages/react-ui-components && pnpm build  # also: pnpm build:watch, pnpm test, pnpm test:browser (react-tests skill)
cd apps/react-storybook && pnpm dev             # also: pnpm build
```

## ⚠️ Rules and gotchas

- **Styling** uses design tokens, preferring component semantic tokens, then semantic tokens, then core primitives. The legacy `kv-color()`, `@include kv-font-*` and `$spacing-*` helpers still compile but are being phased out. Follow the `design-tokens` skill.
- **Storybook MCP.** `pnpm storybook` also serves an MCP server at `http://localhost:6006/mcp`, which `.mcp.json` (Claude Code) and `.codex/config.toml` (Codex) register as `storybook`. Start Storybook before a task that needs it; while it is stopped, the server shows as failed. Its props come from the built packages' types, so run `pnpm build:packages` first.
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
