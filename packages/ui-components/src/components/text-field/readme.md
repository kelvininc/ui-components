# *<kv-text-field>*



<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<!-- Default -->
<kv-text-field></kv-text-field>

<!-- Labeled -->
<kv-text-field label="Text Field"></kv-text-field>

<!-- Disabled -->
<kv-text-field disabled></kv-text-field>
```


### React

```tsx
import React from 'react';

import { KvTextField } from '@kelvininc/react-ui-components';

export const TextFieldExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvTextField />

		{/*-- Labeled --*/}
		<KvTextField label="Text Field" />

		{/*-- Disabled --*/}
		<KvTextField disabled />
	</>
);

```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
	tag: 'text-field-example',
	styleUrl: 'text-field-example.css',
	shadow: true,
})
export class TextFieldExample {
	render() {
		return [
			// Default
			<kv-text-field></kv-text-field>

			// Labeled
			<kv-text-field label="Text Field"></kv-text-field>

			// Disabled
			<kv-text-field disabled></kv-text-field>
		];
	}
}

```



## Properties

| Property            | Attribute     | Description                         | Type                                                                         | Default     |
| ------------------- | ------------- | ----------------------------------- | ---------------------------------------------------------------------------- | ----------- |
| `disabled`          | `disabled`    | (optional) Text field disabled      | `boolean`                                                                    | `false`     |
| `helpText`          | `help-text`   | (optional) Text field help text     | `string`                                                                     | `undefined` |
| `inputName`         | `input-name`  | (optional) Text field input name    | `string`                                                                     | `undefined` |
| `label`             | `label`       | (optional) Text field label         | `string`                                                                     | `undefined` |
| `loading`           | `loading`     | (optional) Text field loading state | `boolean`                                                                    | `false`     |
| `placeholder`       | `placeholder` | (optional) Text field place holder  | `string`                                                                     | `undefined` |
| `required`          | `required`    | (optional) Text field required      | `boolean`                                                                    | `false`     |
| `slim`              | `slim`        | (optional) Text field slim style    | `boolean`                                                                    | `false`     |
| `type` _(required)_ | `type`        | (optional) Text field type          | `EInputFieldType.Number \| EInputFieldType.Password \| EInputFieldType.Text` | `undefined` |
| `value`             | `value`       | Text field value                    | `string`                                                                     | `undefined` |


## Events

| Event           | Description                             | Type                  |
| --------------- | --------------------------------------- | --------------------- |
| `textChange`    | Emitted when text field's value changes | `CustomEvent<string>` |
| `textFieldBlur` | Emitted when text field lost focus      | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
