# AI Agent Guide - Kelvin UI Components

This guide holds the commands and the rules for working in the Kelvin UI Components monorepo. Step-by-step procedures are skills, and reference material is in `docs/`:

- **`component-create` skill** — file structure, creating a component, changing an existing one
- **`design-tokens` skill** — the token pipeline, naming, using tokens in component SCSS, legacy helpers to replace
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
cd packages/react-ui-components && pnpm build  # also: pnpm build:watch
cd apps/react-storybook && pnpm dev             # also: pnpm build
```

## 🧪 React package tests

The React package has two Vitest projects:

| Project | Files | Runs in | Use it for |
|---|---|---|---|
| `unit` | `src/**/*.{test,spec}.{ts,tsx}` | Node or jsdom | Logic: helpers, state, what a template decides to render |
| `browser` | `src/**/*.browser.{test,spec}.{ts,tsx}` | Chromium (Playwright) | Focus, Tab order, keyboard, roles, paste, anything inside a Stencil shadow root |

```bash
pnpm build:packages                                         # first: both projects import the built core package
pnpm --filter @kelvininc/react-ui-components test          # unit
pnpm --filter @kelvininc/react-ui-components test:browser  # browser
pnpm exec playwright install chromium                       # once per machine
```

CI installs only Chromium's headless shell (`--only-shell`). Install full Chromium locally, so you can also run the browser tests headed while debugging: add `--browser.headless=false` to `test:browser`. When a browser test fails, Vitest saves a screenshot in `.vitest-screenshots/`, which git ignores.

- **Unit tests** mock the Stencil proxies with the shared `stencilMocks` from `src/test-utils`, never with a per-file mock: `vi.mock('../../stencil-generated', async () => (await import('../../test-utils')).stencilMocks)`.
  - The unit project runs in Node, so a file that renders starts with `// @vitest-environment jsdom`.
  - A new proxy needs a mock: add its name to `STENCIL_PROXY_NAMES` in `src/test-utils/stencil-mocks.tsx`, or Vitest fails with "No KvX export is defined on the mock".
  - Each mock renders the component's tag. `id`, `slot`, `role`, `aria-*` and `data-*` keep their names, `className` becomes `class`, `tabIndex` becomes `tabindex`, and other primitive props become `data-*` attributes with string values (`data-disabled="false"` still matches `[data-disabled]`).
  - `fireStencilEvent(target, 'onTextChange', detail)` and `propsOf(target)` take a control's key (`id`, else `accessibleLabel`, `text` or `label`) or its rendered element. When mocks share a key, the one mounted last answers, so use the element for controls without a unique key, such as icon buttons.
  - `fireStencilEvent` calls the handler directly with a `CustomEvent` whose `target` and `currentTarget` are the mock's element; ancestors don't receive it. It returns what the handler returns, so an async handler can be awaited. A mock with `disabled` or `inputDisabled` set refuses to fire, except for events listed in `EVENTS_WHEN_DISABLED`, such as `KvTextField`'s `onRightActionClick` (Show password). Pass `{ force: true }` as the fourth argument to fire another event anyway.
  - `propsOf<JSX.KvTextField>(target)` returns the props typed, with `import type { JSX } from '@kelvininc/ui-components'`.
  - Mocks are forgotten when they unmount, and after every test. Render in each test rather than in `beforeAll`: a mock rendered once is only found again after it re-renders.
- **Browser tests** render the real components with the design tokens, fonts, icons and the Night theme from `src/test-utils/setup-browser.ts`, as Storybook does. `vitest.config.ts` sets the 1280×800 viewport. Call `whenKelvinReady(host)` before reading or focusing anything inside one, or `whenAllKelvinReady(container)` for everything a render produced. Vitest's locators (`page.getByRole` and friends) reach inside the components' shadow roots.
- **SchemaForm tests** iterate over the shared edge-case fixtures in `src/components/SchemaForm/test-utils/matrix.tsx` with `describe.each`. Add a row there instead of a one-off case. The fixtures are frozen: to vary one, spread the parts you change (`{ ...row, formData: [...] }`). `structuredClone` fails on rows that hold components or functions.
- **Where tests live.** A test of one module sits next to it (`Widgets/FileWidget/FileWidget.test.tsx`, `hooks/useArrayFocus.test.ts`), and RJSF contract tests sit in `rjsf/`. Tests that render a whole component go in its `tests/` folder, by type and then suite: `SchemaForm/tests/unit/table-layout.test.tsx` and `SchemaForm/tests/browser/table-layout.browser.test.tsx`. Name a suite in kebab-case after the behavior it covers, and keep the `.browser.test` suffix, since that's how Vitest picks the project. `test-utils/` holds helpers and fixtures only, never tests.

## ⚠️ Rules and gotchas

- **Build packages before apps.** After any change in `packages/ui-components` (component source, types or enums), run `pnpm build:packages` from the root before `react-ui-components` or Storybook can see it; skipping it leaves them on stale types and missing exports.
- **Enum exports are kept in sync by hand.** When an enum is added to or removed from `packages/ui-components`, update the named export list in `packages/react-ui-components/src/ui-components.ts`. `export type *` alone doesn't carry enums, because they are runtime values. The `component-create` skill shows an example.
- **Naming.** Component tags carry the `kv-` prefix (`tag: 'kv-badge'`); their directories don't (`components/badge/`), and use kebab-case. React components drop the prefix: `<KvBadge />`, imported from `@kelvininc/react-ui-components/client` for client-side rendering.
- **Components** use Shadow DOM (`shadow: true`) and are themed only through design tokens: `light` and `night` come from the `mode` attribute on `<body>`, never from per-theme SCSS.
- **Styling** uses design tokens, preferring component semantic tokens, then semantic tokens, then core primitives. The legacy `kv-color()`, `@include kv-font-*` and `$spacing-*` helpers still compile but are being phased out. Follow the `design-tokens` skill.
- **Patches**: `patches/` holds the pnpm patch for `@pxtrn/storybook-addon-docs-stencil@8.0.0`. Don't delete it: install needs it.
- **Post-install**: React components copy icon assets in a post-install script; Storybook runs it with `CUSTOM_INST=true`.
- **Versions** are exact between packages (no semver ranges) and use `workspace:*` internally.

## 🧱 Rules for shared primitives and SchemaForm

- **Changing a primitive means auditing everything that renders it.** Before changing a component that others render (kv-radio, kv-checkbox, kv-action-button, kv-toggle-button and so on), list every consumer, e.g. `grep -rlE "<kv-radio[ >]" packages/ui-components/src/components`, and cover each one in the same PR's tests.
- **One implementation per keyboard pattern.** When two components need the same keyboard behavior, such as radio-group arrow keys and the single Tab stop, write it once as a helper in `packages/ui-components/src/utils/` instead of copying it. React widgets render core components instead of reimplementing them.
- **React uses component APIs, never shadow DOM.** Shadow controls use `shadow: { delegatesFocus: true }` so `host.focus()` reaches their control. Light-DOM dropdowns and radio/toggle groups expose `setFocus()`. Use `focusInput()` to target a text field explicitly, and keep `focusSearch()` for a dropdown's search field. React code never queries inside a shadow root.
- **RJSF copies go in `packages/react-ui-components/src/components/SchemaForm/rjsf/`.** Code that reproduces RJSF's own logic goes there (create the folder with the first one), with a contract test that runs the RJSF function it mirrors.
- **Clean up props once, where they enter SchemaForm.** Code downstream trusts the cleaned shape.
- **Interaction gets tested in a real browser:** Stencil e2e (`*.e2e.ts`) for core, the `browser` Vitest project for React.
- **One concern per PR, reviewed once against its spec.** Findings outside a PR's scope become tickets. A fix that needs a new mechanism (a prop, a role, a focus strategy, a global listener) goes back to the spec first.
- **Names that only assistive tech hears use `accessibleLabel`.** `label` renders visible text throughout the library, so when a component needs a name nobody sees, add an `accessibleLabel` prop rather than reusing `label`. A label outside a component's shadow root can't name the control inside it, so pass the name as text.
- **Built-in text is sentence case.** Default labels, headers, placeholders and accessible names capitalize only the first word and proper nouns (`Clear all`, `No data available`, `Custom interval`). Consumers such as Core UI follow the same rule, so a default never clashes with the labels around it.

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
