# Kelvin Angular UI Components

Kelvin UI Components provides a set of reusable, high quality framework-agnostic UI components, this means you can use them with the current most popular Front-End Development Frameworks like React, Angular or if you prefer, the components are also available as W3C compliant WebComponents.

This is not just a library of UI components as it's also a style guide where you can see how the component looks and behaves by interacting with it, to showcase this we use [Storybook](https://storybook.js.org/), a free open-source tool.

Our Storybook is publicly available [here](https://kelvininc.github.io/ui-components/)

## Installation

From the command prompt go to your app's root folder and execute:

```
npm install @kelvininc/angular-ui-components --save
```

## Getting Started

Include the fonts in `angular.json`.

```json
"styles": [
	"node_modules/@kelvininc/angular-ui-components/assets/fonts/font-proxima-nova.css"
]
```

Include the icons in `angular.json`.

```json
"assets": [
	{
		"glob": "svg-symbols.svg",
		"input": "./node_modules/@kelvininc/angular-ui-components/assets",
		"output": "."
	}
]
```

Include the _`KvUIComponentsModule`_ in `app.module.ts`.

```ts
import { KvUIComponentsModule } from '@kelvininc/angular-ui-components';
...

@NgModule({
  ...
  imports: [
	...
    KvUIComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Now you are ready to use all available *Kelvin UI Components*. For example:

```html
...
<kv-action-button
	[type]="buttonType"
	[text]="'My Button'"
	[smallSize]="true"
	fixedWidth="250"
	(buttonClick)="onButtonClick($event)"
>
</kv-action-button>
...
```

Including the global style file you can access our foundation design system definitions like [colors](https://kelvininc.github.io/ui-components/?path=/story/foundation-colors--page), [spacings](https://kelvininc.github.io/ui-components/?path=/docs/foundation-spatial-system--page) and [typography](https://kelvininc.github.io/ui-components/?path=/docs/foundation-typography--page)

```css
@import "@kelvininc/angular-ui-components/assets/styles/globals.scss";
```

## Themes

Kelvin UI Components have two predefined themes `StyleMode.Night` and `StyleMode.Light` (`StyleMode.Night` is applied by default) that can be applied on library startup. For that you need
pass the desired theme to the library configuration in your `app.component.ts`.

```typescript
import { initialize, StyleMode } from '@kelvininc/angular-ui-components';

export class AppComponent {

	(...)

	constructor() {
		initialize({styleMode: StyleMode.Light});
	}
}
```

<br />
In addition, you can customize the theme by changing some CSS properties.

***Example***: Setting the *Primary Color*

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

By default, the `KvIcon` and `KvIllustration` components require an SVG file with all the `kv-icons` available. The default file is `svg-symbols.svg` which is provided after installing this dependency. For caching purposes, it is also provided a `symbols.${checksum}.svg` file after installation. If you are caching those SVGs in your project you should provide the latter to the library configuration in your `app.component.ts`.

```typescript

import { initialize } from '@kelvininc/angular-ui-components';

export class AppComponent {

	(...)

	constructor() {
		initialize({ symbolsFileName: 'symbols.6e51ea0e37926eff2f3ef11e64be70fa.svg' });
	}
}
```

## Relative paths

By default the `KvIcon` and `KvIllustration` components will expect the `svg-symbols.svg` file to be served at the server root. This could not be your use-case if your application is being served on a relative path, e.g, `https://dashboard.com/clients/home`. In this case you will need to tell the library the base path to your assets url, which you can achieve by doing the following in your `app.component.ts`.

```typescript
import { initialize, StyleMode } from '@kelvininc/angular-ui-components';

export class AppComponent {

	(...)

	constructor() {
		initialize({ baseAssetsUrl: '/clients/' });
	}
}
```

For more information, visit our [Storybook](https://kelvininc.github.io/ui-components/).
