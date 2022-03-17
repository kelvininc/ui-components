# _<kv-illustration>_

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-illustration [name]="EIllustrationName.EsSectionSomethingwentwrong"></kv-illustration>

<!-- Custom CSS -->
<kv-illustration [name]="EIllustrationName.EsSectionSomethingwentwrong" customClass="illustration-full-size"></kv-illustration>
```


### React

```tsx
import React from 'react';

import { KvIllustration, EIllustrationName } from '@kelvininc/react-ui-components';

export const SvgIconExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvIllustration name={EIllustrationName.EsSectionSomethingwentwrong} />

		{/*-- Custom CSS --*/}
		<KvIllustration name={EIllustrationName.EsSectionSomethingwentwrong} customClass="illustration-full-size" />
	</>
);
```



## Properties

| Property            | Attribute      | Description                                                                                                                 | Type                 | Default     |
| ------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- |
| `customClass`       | `custom-class` | (optional) Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string \| string[]` | `''`        |
| `name` _(required)_ | `name`         | (required) Illustration symbol name                                                                                         | `EIllustrationName`  | `undefined` |


## Shadow Parts

| Part             | Description                 |
| ---------------- | --------------------------- |
| `"illustration"` | The illustration container. |


## CSS Custom Properties

| Name                            | Description                                        |
| ------------------------------- | -------------------------------------------------- |
| `--illustration-color`          | Base color used in the illustration                |
| `--illustration-color-dark-35`  | 35% darker version of the illustration base color  |
| `--illustration-color-dark-55`  | 55% darker version of the illustration base color  |
| `--illustration-color-light-80` | 80% lighter version of the illustration base color |
| `--illustration-color-light-90` | 90% lighter version of the illustration base color |
| `--illustration-height`         | Height of illustration                             |
| `--illustration-success-color`  | Success color used in the illustration             |
| `--illustration-width`          | Width of illustration                              |


----------------------------------------------


