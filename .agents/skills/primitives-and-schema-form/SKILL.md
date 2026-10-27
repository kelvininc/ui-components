---
name: primitives-and-schema-form
description: Rules for changing a core component that others render (kv-radio, kv-checkbox, kv-action-button, kv-toggle-button and the like), keyboard and focus behavior, accessible names, built-in labels, or SchemaForm and its RJSF code. Use before changing any of these, and when deciding what such a PR covers and how it is tested.
---

# Rules for shared primitives and SchemaForm

- **Changing a primitive means auditing everything that renders it.** Before changing a component that others render (kv-radio, kv-checkbox, kv-action-button, kv-toggle-button and so on), list every consumer, e.g. `grep -rlE "<kv-radio[ >]" packages/ui-components/src/components`, and cover each one in the same PR's tests.
- **One implementation per keyboard pattern.** When two components need the same keyboard behavior, such as radio-group arrow keys and the single Tab stop, write it once as a helper in `packages/ui-components/src/utils/` instead of copying it. React widgets render core components instead of reimplementing them.
- **React uses component APIs, never shadow DOM.** Shadow controls use `shadow: { delegatesFocus: true }` so `host.focus()` reaches their control. Light-DOM dropdowns and radio/toggle groups expose `setFocus()`. Use `focusInput()` to target a text field explicitly, and keep `focusSearch()` for a dropdown's search field. React code never queries inside a shadow root.
- **RJSF copies go in `packages/react-ui-components/src/components/SchemaForm/rjsf/`.** Code that reproduces RJSF's own logic goes there (create the folder with the first one), with a contract test that runs the RJSF function it mirrors.
- **Clean up props once, where they enter SchemaForm.** Code downstream trusts the cleaned shape.
- **Interaction gets tested in a real browser:** Stencil e2e (`*.e2e.ts`) for core, the `browser` Vitest project for React.
- **One concern per PR, reviewed once against its spec.** Findings outside a PR's scope become tickets. A fix that needs a new mechanism (a prop, a role, a focus strategy, a global listener) goes back to the spec first.
- **Names that only assistive tech hears use `accessibleLabel`.** `label` renders visible text throughout the library, so when a component needs a name nobody sees, add an `accessibleLabel` prop rather than reusing `label`. A label outside a component's shadow root can't name the control inside it, so pass the name as text.
- **Built-in text is sentence case.** Default labels, headers, placeholders and accessible names capitalize only the first word and proper nouns (`Clear all`, `No data available`, `Custom interval`). Consumers such as Core UI follow the same rule, so a default never clashes with the labels around it.
