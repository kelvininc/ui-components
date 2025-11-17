# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Kelvin UI Components is a monorepo providing framework-agnostic UI components built with StencilJS. The components are available as W3C-compliant Web Components and as framework-specific wrappers (React, Angular). The library uses Storybook for documentation and visual testing.

## Technology Stack

- **Component Development**: StencilJS (compiles to Web Components)
- **Testing**: Jest (unit tests) and Puppeteer (E2E tests)
- **Styling**: SASS with shadow DOM encapsulation
- **Monorepo Management**: Lerna with pnpm workspaces
- **Documentation**: Storybook
- **Node Version**: 22 (see .nvmrc)
- **Package Manager**: pnpm 8

## Essential Commands

### Initial Setup
```bash
pnpm install
pnpm build:packages
```

### Building
```bash
pnpm build:packages          # Build core and React packages
pnpm build:apps              # Build Storybook app
pnpm build                   # Build all packages and apps
```

### Development
```bash
pnpm storybook               # Run Storybook dev server on port 6006
```

### Testing
```bash
# In packages/ui-components
pnpm test                    # Run all tests (spec + e2e)
pnpm test:spec               # Run unit tests only
pnpm test:e2e                # Run E2E tests only
pnpm test:watch              # Run tests in watch mode
```

### Linting
```bash
pnpm lint                    # Check linting (ESLint + Stylelint)
pnpm lint:fix                # Auto-fix linting issues
```

### Cleaning
```bash
pnpm clean                   # Clean all build artifacts and node_modules
pnpm clean:packages          # Clean packages only
pnpm clean:apps              # Clean apps only
```

## Architecture

### Monorepo Structure

```
packages/
├── ui-components/           # Core StencilJS components (Web Components)
├── react-ui-components/     # React wrappers (auto-generated + custom)
└── angular-ui-components/   # Angular wrappers

apps/
└── react-storybook/         # Storybook documentation app
```

### Build Pipeline

1. **Core Components** (`packages/ui-components`): StencilJS compiles components to:
   - Web Components (custom elements)
   - Distribution bundles (ESM, CJS, types)
   - React bindings (auto-generated via `@stencil/react-output-target`)

2. **React Wrappers** (`packages/react-ui-components`):
   - Auto-generated StencilJS bindings in `src/stencil-generated/`
   - Custom React components (e.g., `SchemaForm`, `CodeEditor`, `ToasterContainer`) in `src/components/`
   - Rollup bundles into client/server/shared entry points

3. **Storybook** (`apps/react-storybook`): Showcases React components with interactive examples

### Component Organization

Each core component in `packages/ui-components/src/components/` follows this structure:
```
component-name/
├── component-name.tsx       # Component implementation
├── component-name.types.ts  # TypeScript interfaces and enums
├── component-name.scss      # Scoped styles
├── readme.md                # Auto-generated documentation
└── test/
    ├── component-name.spec.tsx   # Unit tests (Jest)
    └── component-name.e2e.ts     # E2E tests (Puppeteer)
```

### Key Patterns

**StencilJS Component Structure**:
- Components use `@Component` decorator with `shadow: true` for style encapsulation
- Props use `@Prop({ reflect: true })` to sync with HTML attributes
- Events use `@Event()` decorator with `EventEmitter<T>`
- Naming convention: `kv-component-name` tag, `KvComponentName` class
- Custom CSS classes via `customClass` prop (common pattern across components)
- Component sizes use `EComponentSize` enum (Small, Large)

**React Integration**:
- Auto-generated React wrappers in `packages/react-ui-components/src/stencil-generated/`
- Custom React components use these wrappers or build on top
- `SchemaForm` uses `react-jsonschema-form` library for form validation
- React components support Server Components (exports via `server.esm.js`)

**Styling System**:
- Theme modes: `StyleMode.Night` (default) and `StyleMode.Day`
- Global initialization via `initialize()` from `src/globals/globals.ts`
- Mode can be set per component or on body element
- Components use `:host` selectors and CSS custom properties

**Type System**:
- Common types in `packages/ui-components/src/utils/types/`
- Component-specific types in `*.types.ts` files
- Export interfaces for props (`IComponentName`) and events (`IComponentNameEvents`)

## Development Guidelines

### Creating New Components

1. Use StencilJS generator: `pnpm generate` (in `packages/ui-components`)
2. Implement component following existing patterns (props, events, types)
3. Add unit tests (`*.spec.tsx`) and E2E tests (`*.e2e.ts`)
4. React bindings are auto-generated on build via `stencil.config.ts`

### Testing Strategy

- **Unit tests**: Test component logic, prop changes, rendering
- **E2E tests**: Test user interactions, accessibility, visual states
- Set `TZ=UTC` for consistent date/time tests (already in package scripts)
- Use snapshot testing for stable components

### Git Workflow

- **Main branch for PRs**: `dev` (not `main` or `master`)
- **Current working branch**: `alpha`
- Commit messages follow conventional commits (configured via Lerna)
- Releases are automated via GitHub Actions workflows

### Important Build Details

- Before building, `generate:illustrations` script runs to generate icon components
- `postbuild` adds "use client" directives for React Server Components
- StencilJS output targets generate multiple formats simultaneously
- React package copies assets via postinstall script

### Publishing

- Managed by Lerna with conventional commits
- Alpha releases via `publish-alpha.yml` workflow
- Dev releases via `publish-dev.yml` workflow
- Production releases via `publish-master.yml` workflow
- Version format: `0.53.1-alpha.9` (exact versions enforced)
