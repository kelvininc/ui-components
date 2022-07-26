# kv-icon



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-icon name="kv-logo-kelvin"></kv-icon>

<!-- Custom CSS -->
<kv-icon name="kv-logo-kelvin" customClass="icon-24 rotate-90"><kv-icon>

<!-- Custom Color -->
<kv-icon name="kv-logo-kelvin" customColor="#103d73"><kv-icon>
```


### React

```tsx
import React from 'react';

import { KvIcon } from '@kelvininc/react-ui-components';

export const SvgIconExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvIcon name="kv-logo-kelvin" />

		{/*-- Custom CSS --*/}
		<KvIcon name="kv-logo-kelvin" customClass="icon-24 rotate-90" />

		{/*-- Custom Color --*/}
		<KvIcon name="kv-logo-kelvin" customColor="#103d73" />
	</>
);
```



## Properties

| Property            | Attribute      | Description                                                                                                                 | Type                          | Default     |
| ------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------- |
| `customClass`       | `custom-class` | (optional) Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces. | `string \| string[]`          | `''`        |
| `customColor`       | `custom-color` | (optional) Icon custom color                                                                                                | `string`                      | `''`        |
| `name` _(required)_ | `name`         | (required) Icon symbol name                                                                                                 | `EIconName \| EOtherIconName` | `undefined` |


## Shadow Parts

| Part     | Description         |
| -------- | ------------------- |
| `"icon"` | The icon container. |


## CSS Custom Properties

| Name              | Description       |
| ----------------- | ----------------- |
| `--icon-color`    | Color of the icon |
| `--icon-height`   | Height of icon    |
| `--icon-rotation` | Rotation of icon  |
| `--icon-width`    | Width of icon     |


## Dependencies

### Used by

 - [kv-action-button-icon](../action-button-icon)
 - [kv-action-button-split](../action-button-split)
 - [kv-action-button-text](../action-button-text)
 - [kv-dropdown](../dropdown)
 - [kv-dropdown-list-item](../dropdown-list-item)
 - [kv-form-help-text](../form-help-text)
 - [kv-info-label](../info-label)
 - [kv-search](../search)
 - [kv-switch-button](../switch-button)
 - [kv-text-field](../text-field)
 - [kv-toaster](../toaster)
 - [kv-tree-item](../tree-item)

### Graph
```mermaid
graph TD;
  kv-action-button-icon --> kv-icon
  kv-action-button-split --> kv-icon
  kv-action-button-text --> kv-icon
  kv-dropdown --> kv-icon
  kv-dropdown-list-item --> kv-icon
  kv-form-help-text --> kv-icon
  kv-info-label --> kv-icon
  kv-search --> kv-icon
  kv-switch-button --> kv-icon
  kv-text-field --> kv-icon
  kv-toaster --> kv-icon
  kv-tree-item --> kv-icon
  style kv-icon fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


