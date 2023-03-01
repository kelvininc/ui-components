# _<kv-form-label>_

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-form-label></kv-form-label>

<!-- Labeled -->
<kv-form-label label="Form Field"></kv-form-label>

<!-- Labeled & Required -->
<kv-form-label label="Form Field" required></kv-form-label>
```


### React

```tsx
import React from 'react';

import { KvFormLabel } from '@kelvininc/react-ui-components';

export const FormLabelExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvFormLabel />

		{/*-- Labeled --*/}
		<KvFormLabel label="Form Field" />

		{/*-- Labeled & Required --*/}
		<KvFormLabel label="Form Field" required />
	</>
);

```



## Properties

| Property             | Attribute  | Description                    | Type      | Default     |
| -------------------- | ---------- | ------------------------------ | --------- | ----------- |
| `label` _(required)_ | `label`    | (required) Form field label    | `string`  | `undefined` |
| `required`           | `required` | (optional) Form field required | `boolean` | `undefined` |


## CSS Custom Properties

| Name            | Description       |
| --------------- | ----------------- |
| `--label-color` | Label Text color. |


## Dependencies

### Used by

 - [kv-date-time-input](../date-time-input)
 - [kv-text-field](../text-field)

### Graph
```mermaid
graph TD;
  kv-date-time-input --> kv-form-label
  kv-text-field --> kv-form-label
  style kv-form-label fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


