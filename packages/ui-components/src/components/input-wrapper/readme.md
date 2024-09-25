# kv-time-picker-timezone



<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';
import { KvInputWrapper, KvTextField } from '@kelvininc/react-ui-components';

export const KvInputWrapperExample: React.FC = () => (
  <>
	<KvInputWrapper label="Options" contentVisible={false}>
		<KvTextField label="label" />
	</KvInputWrapper>
  </>
);
```



## Properties

| Property                      | Attribute         | Description                                                                  | Type        | Default          |
| ----------------------------- | ----------------- | ---------------------------------------------------------------------------- | ----------- | ---------------- |
| `contentHidden`               | `content-hidden`  | Defines if the content can be seen                                           | `boolean`   | `false`          |
| `contentVisible` _(required)_ | `content-visible` | Defines the state of the component                                           | `boolean`   | `undefined`      |
| `icon`                        | `icon`            | Icon that is displayed when the component is hovered and is in default state | `EIconName` | `EIconName.Edit` |
| `label`                       | `label`           | Label that is shown when the component is in Default state                   | `string`    | `undefined`      |


## Events

| Event          | Description                                                                | Type                   |
| -------------- | -------------------------------------------------------------------------- | ---------------------- |
| `contentClick` | Event emitted when the component is clicked to display the wrapped content | `CustomEvent<boolean>` |


## Dependencies

### Used by

 - [kv-relative-time-picker](../relative-time-picker)

### Depends on

- [kv-icon](../icon)

### Graph
```mermaid
graph TD;
  kv-input-wrapper --> kv-icon
  kv-relative-time-picker --> kv-input-wrapper
  style kv-input-wrapper fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


