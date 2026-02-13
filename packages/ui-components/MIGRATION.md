# Migration Guide - Design Tokens

This guide covers the steps required to migrate to the new design token system powered by Style Dictionary.

## 1. Import Design Token Styles

The new design tokens are delivered as CSS custom properties. You need to import the token stylesheets at the root of your application.

Add the following import to your main entry file (e.g., `index.tsx`, `App.tsx`, or equivalent):

```tsx
import "@kelvininc/ui-components/dist/assets/styles/style-dictionary/tokens/index.css";
```

This will load:
- **Core tokens** (`:root`) - primitive values like colors, spacing, font sizes, radii, and border widths
- **Dark theme** (`body[mode="night"]`) - semantic tokens for the dark theme
- **Light theme** (`body[mode="light"]`) - semantic tokens for the light theme

Then, set the `mode` attribute on your `<body>` element to activate the desired theme:

```html
<!-- Dark theme (default) -->
<body mode="night">

<!-- Light theme -->
<body mode="light">
```

## 2. Typography Mixin Migration

All `kv-font-*` SCSS mixins have been deprecated in favor of new design token typography mixins. Replace usages as follows:

### Headings

| Deprecated Mixin | New Mixin |
|---|---|
| `kv-font-h1-semibold` | `heading-xxl-semibold` |
| `kv-font-h2-semibold` | `heading-xl-semibold` |
| `kv-font-h2-regular` | `heading-xl-regular` |
| `kv-font-h3-semibold` | `heading-l-semibold` |
| `kv-font-h4-semibold` | `heading-m-semibold` |
| `kv-font-h4-uppercase-semibold` | _Removed_ (no direct replacement) |
| `kv-font-h5-semibold` | `body-m-semibold` |

### Labels

| Deprecated Mixin | New Mixin |
|---|---|
| `kv-font-label-large-regular` | `heading-l-regular` |
| `kv-font-label-medium-regular` | `heading-m-regular` |
| `kv-font-label-small-regular` | `body-s-regular` |
| `kv-font-label-small-semibold` | `body-s-semibold` |
| `kv-font-label-small-bold` | `body-s-bold` |
| `kv-font-label-small-uppercase-regular` | `heading-xs-regular-caps` |
| `kv-font-label-small-uppercase-semibold` | `heading-xs-semibold-caps` |
| `kv-font-label-small-uppercase-bold` | `heading-xs-semibold-caps` |
| `kv-font-label-xsmall-light` | `body-xs-light` |
| `kv-font-label-xsmall-regular` | `body-xs-regular` |
| `kv-font-label-xsmall-semibold` | `body-xs-semibold` |
| `kv-font-label-xsmall-bold` | `body-xs-bold` |
| `kv-font-label-xsmall-uppercase-regular` | `heading-xs-regular-caps` |
| `kv-font-label-xsmall-uppercase-semibold` | `heading-xs-semibold-caps` |

### Spans

| Deprecated Mixin | New Mixin |
|---|---|
| `kv-font-span-regular` | `body-m-regular` |
| `kv-font-span-semibold` | `body-m-semibold` |
| `kv-font-span-uppercase-semibold` | `heading-s-semibold-caps` |

### Paragraphs

| Deprecated Mixin | New Mixin |
|---|---|
| `kv-font-paragraph-regular` | `body-m-regular` |
| `kv-font-paragraph-light` | `body-m-regular` |

### Example

```diff
- @include kv-font-h1-semibold;
+ @include heading-xxl-semibold;

- @include kv-font-label-small-semibold;
+ @include body-s-semibold;

- @include kv-font-span-regular;
+ @include body-m-regular;
```

## 3. Action Button Type Migration

The `EActionButtonType` enum values have been reorganized. Update your usages according to the following mapping:

| Previous Value | New Value | Notes |
|---|---|---|
| `EActionButtonType.Primary` | `EActionButtonType.Primary` | No change |
| `EActionButtonType.Secondary` | `EActionButtonType.Secondary` | No change |
| `EActionButtonType.Tertiary` | `EActionButtonType.Secondary` | Tertiary is now Secondary |
| `EActionButtonType.Ghost` | `EActionButtonType.Tertiary` | Ghost is now Tertiary |
| _N/A_ | `EActionButtonType.Text` | New type added |

### Example

```diff
- <KvActionButtonText type={EActionButtonType.Tertiary} text="Cancel" />
+ <KvActionButtonText type={EActionButtonType.Secondary} text="Cancel" />

- <KvActionButtonText type={EActionButtonType.Ghost} text="Dismiss" />
+ <KvActionButtonText type={EActionButtonType.Tertiary} text="Dismiss" />
```
