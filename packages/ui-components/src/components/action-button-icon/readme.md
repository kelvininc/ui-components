# _<kv-action-button-icon>_

<!-- Auto Generated Below -->


## Usage

### React

```tsx
import React from 'react';

import { KvActionButtonIcon, EIconName } from '@kelvininc/react-ui-components';

export const SwitchButtonExample: React.FC = () => (
	<>
		{/*-- Primary --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Primary}></KvActionButtonIcon>

		{/*--Secondary --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Secondary}></KvActionButtonIcon>

		{/*-- Tertiary --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Tertiary}></KvActionButtonIcon>

		{/*-- Ghost --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Ghost}></KvActionButtonIcon>

		{/*-- Danger --*/}
		<KvActionButtonIcon icon={EIconName.Add} type={EActionButtonType.Danger}></KvActionButtonIcon>

		{/*-- Disabled --*/}
		<KvActionButtonIcon disabled icon={EIconName.Add} type={EActionButtonType.Primary}></KvActionButtonIcon>

		{/*-- Badge --*/}
		<KvActionButtonIcon icon={EIconName.Customize} type={EActionButtonType.Primary} badge="12"></kv-action-button>
	</>
);
```



## Properties

| Property            | Attribute     | Description                                                                                                   | Type                                                                                                                                            | Default                |
| ------------------- | ------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `active`            | `active`      | (optional) If `true` the button is active                                                                     | `boolean`                                                                                                                                       | `false`                |
| `badgeLabel`        | `badge-label` | (optional) Defines button's badge label. If set, an badge will be displayed in the end of action icon button. | `string`                                                                                                                                        | `undefined`            |
| `badgeState`        | `badge-state` | (optional) Defines button's badge type.                                                                       | `EBadgeState.Error \| EBadgeState.Info \| EBadgeState.None \| EBadgeState.Success \| EBadgeState.Warning`                                       | `undefined`            |
| `disabled`          | `disabled`    | (optional) If `true` the button is disabled                                                                   | `boolean`                                                                                                                                       | `false`                |
| `icon` _(required)_ | `icon`        | (required) Button's icon symbol name                                                                          | `EIconName`                                                                                                                                     | `undefined`            |
| `loading`           | `loading`     | (optional) If `true` the button is of type loading                                                            | `boolean`                                                                                                                                       | `false`                |
| `size`              | `size`        | (optional) Button's size                                                                                      | `EComponentSize.Large \| EComponentSize.Small`                                                                                                  | `EComponentSize.Small` |
| `type` _(required)_ | `type`        | (required) Button's type                                                                                      | `EActionButtonType.Danger \| EActionButtonType.Ghost \| EActionButtonType.Primary \| EActionButtonType.Secondary \| EActionButtonType.Tertiary` | `undefined`            |


## Events

| Event         | Description                           | Type                      |
| ------------- | ------------------------------------- | ------------------------- |
| `blurButton`  | Emitted when action button is blur    | `CustomEvent<FocusEvent>` |
| `clickButton` | Emitted when action button is clicked | `CustomEvent<MouseEvent>` |
| `focusButton` | Emitted when action button is focused | `CustomEvent<FocusEvent>` |


## CSS Custom Properties

| Name                         | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| `--button-icon-large-height` | Button's icon large height.                        |
| `--button-icon-large-width`  | Button's icon large width.                         |
| `--button-icon-small-height` | Button's icon small height.                        |
| `--button-icon-small-width`  | Button's icon small width.                         |
| `--button-size-large`        | Button's height and width size when size is large. |
| `--button-size-small`        | Button's height and width size when size is small. |


## Dependencies

### Used by

 - [kv-inline-editable-field](../inline-editable-field)
 - [kv-select-create-option](../select-create-option)
 - [kv-select-option](../select-option)

### Depends on

- [kv-action-button](../action-button)
- [kv-icon](../icon)
- [kv-badge](../badge)

### Graph
```mermaid
graph TD;
  kv-action-button-icon --> kv-action-button
  kv-action-button-icon --> kv-icon
  kv-action-button-icon --> kv-badge
  kv-inline-editable-field --> kv-action-button-icon
  kv-select-create-option --> kv-action-button-icon
  kv-select-option --> kv-action-button-icon
  style kv-action-button-icon fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


