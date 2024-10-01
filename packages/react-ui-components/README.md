# Kelvin React UI Components

Kelvin UI Components provides a set of reusable, high quality framework-agnostic UI components, this means you can use with React or if you prefer, the components are also available as W3C compliant WebComponents.

This is not just a library of UI components as it's also a style guide where you can see how the component looks and behaves by interacting with it, to showcase this we use [Storybook](https://storybook.js.org/), a free open-source tool.

Our Storybook is publicly available [here](https://kelvininc.github.io/ui-components/)

## Installation

From the command prompt go to your app's root folder and execute:

```
pnpm install @kelvininc/react-ui-components --save
```

## Getting Started

Include the fonts in `index.js` or `index.tsx`.

```tsx
import '@kelvininc/react-ui-components/dist/assets/fonts/font-proxima-nova.css';
```

Now you are ready to use all available _Kelvin UI Components_. For example:

```tsx
import { EActionButtonType, KvActionButton } from '@kelvininc/react-ui-components';

(...)

<KvActionButton
	type={EActionButtonType.PrimaryButton}
	text="My Button"
	smallSize="true"
	fixedWidth={250}
	onButtonClick={this.onButtonClick}>
</KvActionButton>
```

Including the global style file you can access our foundation design system definitions like [colors](https://kelvininc.github.io/ui-components/?path=/story/foundation-colors--page), [spacings](https://kelvininc.github.io/ui-components/?path=/docs/foundation-spatial-system--page) and [typography](https://kelvininc.github.io/ui-components/?path=/docs/foundation-typography--page)

```css
@import '@kelvininc/react-ui-components/dist/assets/styles/globals.scss';
```

## Themes

Kelvin UI Components have two predefined themes `StyleMode.Night` and `StyleMode.Light` (`StyleMode.Night` is applied by default) that can be applied on library startup. For that you need
pass the desired theme to the library configuration in your `index.js` or `index.tsx`.

```tsx
import { initialize, StyleMode } from '@kelvininc/react-ui-components';

(...)

initialize({styleMode: StyleMode.Light});

```

<br />
In addition, you can customize the theme by changing some CSS properties.

**_Example_**: Setting the _Primary Color_

```css
:root {
	--kv-primary: #005cc7;
	--kv-primary-rgb: 0, 92, 199;
	--kv-primary-contrast: #fff;
	--kv-primary-contrast-rgb: 255, 255, 255;
	--kv-primary-dark: #0051af;
	--kv-primary-light: #ccdef4;
}
```

## Caching

By default, the `KvIcon` and `KvIllustration` components require an SVG file with all the `kv-icons` available. The default file is `svg-symbols.svg` which is provided after installing this dependency. For caching purposes, it is also provided a `symbols.${checksum}.svg` file after installation. If you are caching those SVGs in your project you should use the latter.

```tsx

import { initialize } from '@kelvininc/react-ui-components';

(...)

initialize({ symbolsFileName: 'symbols.6e51ea0e37926eff2f3ef11e64be70fa.svg' });

```

> **_NOTE:_** If you are using `pnpm` as package manager in your project it's necessary to configure the postinstall script into package.json. Add `"postinstall": "CUSTOM_INST=true node ./node_modules/@kelvininc/react-ui-components/.scripts/copy-icons.js"`. This will grant that svg symbols are copied to public directory.

## Relative paths

By default the `KvIcon` and `KvIllustration` components will expect the `svg-symbols.svg` file to be served at the server root. This could not be your use-case if you're application is being served on a relative path, e.g, `https://dashboard.com/clients/home`. In this case you will need to tell the library the base path to your assets url, which you can achieve by doing the following in your `index.js` or `index.tsx`.

```tsx
import { initialize } from '@kelvininc/react-ui-components';

(...)

initialize({ baseAssetsUrl: '/clients/' });

```

For more information, visit our [Storybook](https://kelvininc.github.io/ui-components/).
