# *<kv-radio-button>*



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-radio-button></kv-radio-button>

<!-- Labeled -->
<kv-radio-button label="Switch"></kv-radio-button>

<!-- Disabled -->
<kv-radio-button disabled></kv-radio-button>

<!-- Checked -->
<kv-radio-button checked></kv-radio-button>
```


### React

```tsx
import React from 'react';

import { KvRadioButton } from '@kelvininc/react-ui-components';

export const RadioButtonExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvRadioButton />

		{/*-- Labeled --*/}
		<KvRadioButton label="Switch" />

		{/*-- Disabled --*/}
		<KvRadioButton disabled />

		{/*-- Checked --*/}
		<KvRadioButton checked />
	</>
);
```



## Properties

| Property   | Attribute  | Description                                                                  | Type      | Default |
| ---------- | ---------- | ---------------------------------------------------------------------------- | --------- | ------- |
| `checked`  | `checked`  | (optional) Sets the button as checked when initializing                      | `boolean` | `false` |
| `disabled` | `disabled` | (optional) Sets this button styling to be disabled and disables click events | `boolean` | `false` |
| `label`    | `label`    | (optional) Adds a label aside the button                                     | `string`  | `''`    |


## Events

| Event           | Description                                     | Type                   |
| --------------- | ----------------------------------------------- | ---------------------- |
| `checkedChange` | Emits when there's a change in state internally | `CustomEvent<boolean>` |


----------------------------------------------


