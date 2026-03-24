# Design Tokens System

This guide explains the complete design tokens system for Kelvin UI Components, from Figma export to code usage.

## 📁 Folder Structure

### Tokens Source (JSON)

```
packages/ui-components/tokens/
├── core/                          # Primitive and fundamental tokens
│   ├── foundations_primitives.json   # Base colors, spacing, sizing, etc.
│   ├── tipography.json               # Base typography definitions
│   ├── spacing.json                  # Spacing system
│   └── icon.json                     # Icon sizes and configurations
│
├── semantic/                      # Semantic tokens (with modes)
│   ├── light.json                    # Light theme
│   └── dark.json                     # Dark theme
│
├── components/                    # Component-specific tokens
│   └── component_semantics.json      # UI components tokens
│
└── styles/                        # Figma Styles (Paint, Text, Effect)
	├── paint.json                    # Paint styles (colors, gradients)
	├── text.json                     # Text styles (typography)
	└── effect.json                   # Effect styles (shadows, blurs)
```

### Generated Output (CSS/SCSS)

```
packages/ui-components/src/assets/styles/
├── tokens/                          # Primitive and fundamental tokens
│   ├── core.css                       # Core tokens CSS variables (:root)
│   ├── light.css                      # Light theme CSS variables (body[mode="light"])
│   └── dark.css                       # Dark theme CSS variables (body[mode="night"])
│
└── styles-mixins.scss             # Figma styles SCSS mixins
```

## 🎨 Token Types

### 1. Core Tokens (Primitives)

Fundamental tokens that don't depend on themes. Defined in `:root`.

**Example:**
```css
:root {
  --color-gray-50: #ffffff;
  --color-gray-900: #1a1a1a;
  --spacing-xs: 4px;
  --spacing-md: 16px;
  --radius-sm: 4px;
}
```

**Usage:**
```css
.card {
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);
}
```

### 2. Semantic Tokens (Thematic)

Tokens that change according to the theme (light/dark). Defined in `body[mode="light"]` and `body[mode="night"]`.

**Example:**
```css
body[mode="light"] {
  --background-surface-neutral-default: var(--color-gray-50);
  --text-primary: var(--color-gray-900);
}

body[mode="night"] {
  --background-surface-neutral-default: var(--color-gray-900);
  --text-primary: var(--color-gray-50);
}
```

**Usage:**
```css
.container {
  background: var(--background-surface-neutral-default);
  color: var(--text-primary);
}
```

### 3. Component Tokens

Specific tokens for UI components (buttons, inputs, cards, etc.).

**Example:**
```css
:root {
  --button-primary-background: var(--color-blue-500);
  --button-primary-text: white;
  --input-border-radius: var(--radius-sm);
}
```

### 4. Style Mixins (SCSS)

Figma styles exported as SCSS mixins for easy reuse.

**Typography Mixins:**
```scss
@mixin heading-xxl-semibold {
  font-family: Proxima Nova;
  font-weight: Semibold;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0px;
}

@mixin body-m-regular {
  font-family: Proxima Nova;
  font-weight: Regular;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
}
```

**Shadow Mixins (future):**
```scss
@mixin elevation-small {
  box-shadow: 0px 2px 4px 0px #00000033;
}
```

**Color Variables (future):**
```scss
$brand-primary: #006fff;
```

## 🔧 How to Use

### CSS Variables

Import the CSS files into your project:

```css
/* Core tokens (always required) */
@import 'style-dictionary/tokens/core.css';

/* Themes (light and dark) */
@import 'style-dictionary/tokens/light.css';
@import 'style-dictionary/tokens/dark.css';
```

Use the variables in your components:

```css
.my-component {
  /* Core tokens */
  padding: var(--spacing-md);
  border-radius: var(--radius-sm);

  /* Semantic tokens (change with theme) */
  background: var(--background-surface-neutral-default);
  color: var(--text-primary);

  /* Component tokens */
  border: 1px solid var(--input-border-color);
}
```

### SCSS Mixins

Import the mixins file in your SCSS:

```scss
@import 'style-dictionary/styles-mixins';
```

Use the mixins for typography:

```scss
.page-title {
  @include heading-xxl-semibold;
  color: var(--text-primary);
}

.section-heading {
  @include heading-xl-semibold;
  margin-bottom: var(--spacing-lg);
}

.body-text {
  @include body-m-regular;
}

.label {
  @include label-m-regular-caps;
  color: var(--text-secondary);
}

.numeric-display {
  @include numeric-m-semibold;
}
```

## 🔄 Complete Workflow

### 1. Design in Figma

Create or update your design tokens in Figma:
- **Variables**: Colors, spacing, sizing, radius, etc.
- **Text Styles**: Typography definitions (heading, body, label, etc.)
- **Paint Styles**: Colors and gradients
- **Effect Styles**: Shadows and blurs

### 2. Export from Figma

1. Open the **Kelvin Design Tokens Export** plugin
2. Preview all available tokens and styles
3. Click **Download All Files (ZIP)** or export individual files
4. Extract the files to the corresponding folders:
   - `tokens/core/` → Primitive variables
   - `tokens/semantic/` → Variables with modes (light.json, dark.json)
   - `tokens/components/` → Component tokens
   - `tokens/styles/` → Figma styles (paint.json, text.json, effect.json)

### 3. Build Tokens

Run the build command:

```bash
cd packages/ui-components
pnpm tokens:build
```

### 4. Generated Output

The build automatically generates:
- ✅ `core.css` - Core variables in `:root`
- ✅ `light.css` - Light theme variables in `body[mode="light"]`
- ✅ `dark.css` - Dark theme variables in `body[mode="night"]`
- ✅ `styles-mixins.scss` - Typography SCSS mixins

### 5. Use in Code

Import the generated files and use the variables/mixins in your components!

## 🎯 Benefits

### CSS Variables
✅ **Dynamic themes** - Automatically switch between light/dark
✅ **Performance** - Native to browser, no overhead
✅ **Cascade** - Inherits values through the DOM tree
✅ **Runtime updates** - Can be changed dynamically with JS

### SCSS Mixins
✅ **Type-safe** - SCSS throws error if using a non-existent mixin
✅ **Autocomplete** - IDEs suggest available mixins
✅ **Single source of truth** - All typography comes from Figma
✅ **Zero runtime** - Compiled to pure CSS
✅ **Consistent spacing** - Line heights and letter spacing maintained

### Design Tokens System
✅ **Design-Dev sync** - Figma → Code automatically
✅ **Consistency** - Same values throughout the project
✅ **Maintainability** - Change in Figma, rebuild, done
✅ **Scalability** - Easy to add new tokens
✅ **Documentation** - Tokens are self-documenting

## 📚 References

- **Figma Plugin**: [figma-plugin/README.md](../../../figma-plugin/README.md)
- **Style Dictionary Config**: [scripts/style-dictionary.config.mjs](../../../scripts/style-dictionary.config.mjs)
- **DTCG Spec**: [Design Tokens Community Group](https://tr.designtokens.org/format/)
- **Style Dictionary**: [style-dictionary.com](https://amzn.github.io/style-dictionary/)
