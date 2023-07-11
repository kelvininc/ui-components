# *<kv-select-group>*

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<kv-select-group label="Default Timezone"> </kv-select-group>
```


### React

```tsx
import React from 'react';
import { KvSelectGroup } from '@kelvininc/react-ui-components';

export const KvSelectGroupExample: React.FC = props => (
	<>
		<KvSelectGroup label="Default Timezone"></KvSelectGroup>
	</>
);
```



## Properties

| Property | Attribute | Description                                                | Type     | Default     |
| -------- | --------- | ---------------------------------------------------------- | -------- | ----------- |
| `label`  | `label`   | (optional) The text to display on the dropdown group label | `string` | `undefined` |


## Shadow Parts

| Part                | Description                  |
| ------------------- | ---------------------------- |
| `"group-container"` | The group element container. |


## CSS Custom Properties

| Name                                   | Description                           |
| -------------------------------------- | ------------------------------------- |
| `--select-group-item-background-color` | Dropdown group item background color. |
| `--select-group-item-label-color`      | Dropdown group item label color.      |


## Dependencies

### Used by

 - [kv-select-multi-options](../select-multi-options)
 - [kv-single-select-dropdown](../single-select-dropdown)

### Graph
```mermaid
graph TD;
  kv-select-multi-options --> kv-select-group
  kv-single-select-dropdown --> kv-select-group
  style kv-select-group fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


