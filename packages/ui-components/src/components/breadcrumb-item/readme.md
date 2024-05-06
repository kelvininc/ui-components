# _<kv-breadcrumb-item>_

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- With all properties (only label is mandatory) -->
<kv-breadcrumb-item label="Your label here" active> </kv-breadcrumb-item>
```


### React

```tsx
import React from 'react';
import { KvBreadcrumbItem } from '@kelvininc/react-ui-components';
export const KvBreadcrumbItemExample: React.FC = () => (
	<>
		{/*-- With all properties (only label is mandatory) --*/}
		<KvBreadcrumbItem label="Your label here" active></KvBreadcrumbItem>
	</>
);
```



## Properties

| Property             | Attribute | Description                                                                         | Type      | Default     |
| -------------------- | --------- | ----------------------------------------------------------------------------------- | --------- | ----------- |
| `active`             | `active`  | (optional) Sets this breadcrumb styling to be the active one (usually the last one) | `boolean` | `undefined` |
| `label` _(required)_ | `label`   | (required) The text to display on the breadcrumb                                    | `string`  | `undefined` |


## Events

| Event                 | Description                                    | Type                           |
| --------------------- | ---------------------------------------------- | ------------------------------ |
| `breadcrumbItemClick` | Emitted when the user clicks on the breadcrumb | `CustomEvent<IBreadcrumbItem>` |


## CSS Custom Properties

| Name                              | Description                      |
| --------------------------------- | -------------------------------- |
| `--breadcrumb-item-active-color`  | Breadcrumb's item active color.  |
| `--breadcrumb-item-default-color` | Breadcrumb's item default color. |
| `--breadcrumb-item-hover-color`   | Breadcrumb's item hover color.   |


## Dependencies

### Used by

 - [kv-breadcrumb](../breadcrumb)

### Graph
```mermaid
graph TD;
  kv-breadcrumb --> kv-breadcrumb-item
  style kv-breadcrumb-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


