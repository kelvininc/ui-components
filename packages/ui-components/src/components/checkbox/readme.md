# kv-checkbox



<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';

import { KvCheckbox } from '@kelvininc/react-ui-components';

export const RadioExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvCheckbox />

		{/*-- Checked --*/}
		<KvCheckbox checked />

		{/*-- Disabled --*/}
		<KvCheckbox disabled />

		{/*-- Inderterminated --*/}
		<KvCheckbox indeterminate />
	</>
);
```



## Properties

| Property        | Attribute       | Description                                                                   | Type      | Default |
| --------------- | --------------- | ----------------------------------------------------------------------------- | --------- | ------- |
| `checked`       | `checked`       | (optional) If `true` the checkbox is with checked state. Default: false       | `boolean` | `false` |
| `disabled`      | `disabled`      | (optional) If `true` the checkbox is with disabled state. Default: false      | `boolean` | `false` |
| `indeterminate` | `indeterminate` | (optional) If `true` the checkbox is with indeterminate state. Default: false | `boolean` | `false` |


## Events

| Event           | Description                                     | Type                |
| --------------- | ----------------------------------------------- | ------------------- |
| `clickCheckbox` | Emitted when the checkbox checked state changes | `CustomEvent<void>` |


## Shadow Parts

| Part     | Description       |
| -------- | ----------------- |
| `"icon"` | The icon element. |


## CSS Custom Properties

| Name                   | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `--checkbox-icon-size` | Text checkbox height and width. Default: 16px. |
| `--checkbox-size`      | Text checkbox height and width. Default: 16px. |


## Dependencies

### Used by

 - [kv-select-option](../select-option)

### Depends on

- [kv-icon](../icon)

### Graph
```mermaid
graph TD;
  kv-checkbox --> kv-icon
  kv-select-option --> kv-checkbox
  style kv-checkbox fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


