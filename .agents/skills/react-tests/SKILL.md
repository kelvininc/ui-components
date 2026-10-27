---
name: react-tests
description: Write, run or fix tests in @kelvininc/react-ui-components, covering the Vitest unit (jsdom) and browser (Playwright Chromium) projects, the shared Stencil mocks with fireStencilEvent and propsOf, the browser-test readiness helpers, the SchemaForm edge-case matrix, and where test files go. Use when adding or changing a React component's tests, running them, or debugging a failing one.
---

# React package tests

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
