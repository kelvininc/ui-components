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

Include the *```KvUIComponentsModule```* in `app.module.ts`.

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
		(buttonClick)="onButtonClick($event)">
	</kv-action-button>
...
```

Including the global style file you can access our foundation design system definitions like [colors](https://kelvininc.github.io/ui-components/?path=/story/foundation-colors--page), [spacings](https://kelvininc.github.io/ui-components/?path=/docs/foundation-spatial-system--page) and [typography](https://kelvininc.github.io/ui-components/?path=/docs/foundation-typography--page)

```css
@import "@kelvininc/angular-ui-components/assets/styles/globals.scss";
```

## Themes

Kelvin UI Components allows you to customize the theme by changing some CSS properties.
<br />

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

For more information, visit our [Storybook](https://kelvininc.github.io/ui-components/).
