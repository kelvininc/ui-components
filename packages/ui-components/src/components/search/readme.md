# kv-search



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-search></kv-search>

<!-- Different Placeholder -->
<kv-search placeholder="New Search Placeholder"></kv-search>

<!-- Disabled -->
<kv-search disabled></kv-search>
```


### React

```tsx
import React from 'react';

import { KvSearch } from '@kelvininc/react-ui-components';

export const SearchExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvSearch />

		{/*-- With Placeholder --*/}
		<KvSearch placeholder="New Search Placeholder" />

		{/*-- Disabled --*/}
		<KvSearch disabled />
	</>
);

```



## Properties

| Property      | Attribute     | Description                                                        | Type                                           | Default                |
| ------------- | ------------- | ------------------------------------------------------------------ | ---------------------------------------------- | ---------------------- |
| `disabled`    | `disabled`    | (optional) Search disabled                                         | `boolean`                                      | `false`                |
| `placeholder` | `placeholder` | (optional) Search place holder                                     | `string`                                       | `'Search'`             |
| `size`        | `size`        | (optional) Sets this tab item to a different styling configuration | `EComponentSize.Large \| EComponentSize.Small` | `EComponentSize.Large` |
| `value`       | `value`       | Search value                                                       | `string`                                       | `undefined`            |


## Events

| Event              | Description                              | Type                      |
| ------------------ | ---------------------------------------- | ------------------------- |
| `clickResetButton` | Emitted when the reset buccon is clicked | `CustomEvent<MouseEvent>` |
| `textChange`       | Emitted when text field's value changes  | `CustomEvent<string>`     |
| `textFieldBlur`    | Emitted when text field lost focus       | `CustomEvent<string>`     |


## Dependencies

### Depends on

- [kv-text-field](../text-field)
- [kv-icon](../icon)

### Graph
```mermaid
graph TD;
  kv-search --> kv-text-field
  kv-search --> kv-icon
  kv-text-field --> kv-icon
  style kv-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


