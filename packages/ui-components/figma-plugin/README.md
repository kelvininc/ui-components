# Design Tokens Export - Figma Plugin

Plugin to export Figma variables and styles to DTCG (Design Tokens Community Group) format compatible with Style Dictionary.

## Features

- ✅ Exports Figma **variables**
- ✅ Exports **paint styles** (colors and gradients)
- ✅ Exports **text styles** (typography)
- ✅ Exports **effect styles** (shadows and blurs)
- ✅ Supports multiple modes (light/dark)
- ✅ Resolves variable references (aliases)
- ✅ Generates separate files per collection and mode
- ✅ Individual download or ZIP with all files

## Installation in Figma

1. Open Figma Desktop (local plugins don't work in the web version)

2. Go to **Plugins** > **Development** > **Import plugin from manifest...**

3. Select the `manifest.json` file from this folder:
   ```
   packages/ui-components/figma-plugin/manifest.json
   ```

4. The plugin will appear under **Plugins** > **Development** > **Design Tokens Export**

## How to Use

1. Open the Figma file with your variables and styles

2. Run the plugin: **Plugins** > **Development** > **Design Tokens Export**

3. The plugin displays:
   - All **variable collections** (with light/dark modes if applicable)
   - All **Paint Styles** (colors and gradients)
   - All **Text Styles** (typography)
   - All **Effect Styles** (shadows and blurs)

4. Select the file you want to export from the list

5. Click **Copy to Clipboard** or **Download** for an individual file

6. Or click **Download All Files (ZIP)** to download all files at once with the correct folder structure

7. Paste/extract the JSON files into the corresponding folders:
   - `tokens/core/` - primitive variables (colors, spacing, etc.)
   - `tokens/semantic/` - semantic variables with modes (light.json, dark.json)
   - `tokens/components/` - component tokens
   - `tokens/styles/` - Figma styles (paint.json, text.json, effect.json)

8. Run `pnpm tokens:build` to generate the CSS

## Output Format

### Variables

The plugin exports variable tokens in DTCG format compatible with Style Dictionary:

```json
{
  "color": {
    "gray": {
      "50": {
        "value": "#ffffff",
        "type": "color",
        "prefix": "foundations_primitives"
      }
    }
  },
  "spacing": {
    "md": {
      "value": "16px",
      "type": "number",
      "prefix": "foundations_primitives"
    }
  },
  "radius": {
    "sm": {
      "value": "4px",
      "type": "number",
      "prefix": "foundations_primitives"
    }
  }
}
```

For collections with modes (light/dark), the output includes both:

```json
{
  "light": {
    "background": {
      "surface": {
        "default": {
          "value": "{color.gray.50}",
          "type": "color",
          "prefix": "color"
        }
      }
    }
  },
  "dark": {
    "background": {
      "surface": {
        "default": {
          "value": "{color.gray.900}",
          "type": "color",
          "prefix": "color"
        }
      }
    }
  }
}
```

### Styles (Figma Styles)

The plugin also exports native Figma styles:

**Paint Styles (colors and gradients):**
```json
{
  "brand": {
    "primary": {
      "value": "#006fff",
      "type": "color",
      "prefix": "styles_paint"
    }
  }
}
```

**Text Styles (typography):**
```json
{
  "heading": {
    "h1": {
      "value": {
        "fontFamily": "Inter",
        "fontWeight": "Bold",
        "fontSize": "32px",
        "lineHeight": "40px",
        "letterSpacing": "normal"
      },
      "type": "typography",
      "prefix": "styles_text"
    }
  }
}
```

**Effect Styles (shadows and blurs):**
```json
{
  "elevation": {
    "small": {
      "value": "0px 2px 4px 0px #00000033",
      "type": "shadow",
      "prefix": "styles_effect"
    }
  }
}
```

## Requirements

- Figma Desktop App (any plan - Enterprise is not required)
- Variables and styles must be in the same Figma file (local styles/variables)
- Works in both Figma and Dev Mode

**Note:** The plugin only exports **local styles** and **local variables**. Styles and variables from external libraries are not exported.

## Debugging Issues

If you encounter unresolved values (like `{UNRESOLVED_ALIAS:...}`):

1. Open the **Developer Console** in Figma:
   - Menu: **Plugins** > **Development** > **Open Console**

2. Look for console warnings indicating:
   - Unresolved aliases
   - Referenced variables that don't exist

3. Check in Figma that:
   - The referenced variable exists
   - The variable name is correct
   - The variable is in the same collection or is accessible

## Troubleshooting

**Problem**: The plugin doesn't find the variables
- **Solution**: Make sure you are using local variables (Local Variables), not variables from external libraries

**Problem**: References are not being resolved
- **Solution**: Open the plugin console and check the warnings. Confirm that all referenced variables exist in the file

**Problem**: Can't find the exported styles
- **Solution**: Styles appear in the list with a purple "Style" badge. Check that you have local styles created in the file (not styles from external libraries)
