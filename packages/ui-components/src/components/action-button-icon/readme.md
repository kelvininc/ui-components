# *<kv-action-button-icon>*



<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Primary -->
<kv-action-button-icon icon="kv-add" [type]="EActionButtonType.Primary"></kv-action-button-icon>

<!-- Secondary -->
<kv-action-button-icon icon="kv-add" [type]="EActionButtonType.Secondary"></kv-action-button-icon>

<!-- Tertiary -->
<kv-action-button-icon icon="kv-add" [type]="EActionButtonType.Tertiary"></kv-action-button-icon>

<!-- Disabled -->
<kv-action-button-icon icon="kv-add" [type]="EActionButtonType.Primary" disabled></kv-action-button-icon>

<!-- Anchor -->
<kv-action-button-icon icon="kv-add" href="/link-to-url" target="_blank" [type]="EActionButtonType.Primary"></kv-action-button>
```


### React

```tsx
import React from 'react';

import { KvActionButtonIcon } from '@kelvininc/react-ui-components';

export const SwitchButtonExample: React.FC = () => (
	<>
		{/*-- Primary --*/}
		<KvActionButtonIcon icon="kv-add" type={EActionButtonType.Primary}></KvActionButtonIcon>

		{/*--Secondary --*/}
		<KvActionButtonIcon icon="kv-add" type={EActionButtonType.Secondary}></KvActionButtonIcon>

		{/*-- Tertiary --*/}
		<KvActionButtonIcon icon="kv-add" type={EActionButtonType.Tertiary}></KvActionButtonIcon>

		{/*-- Disabled --*/}
		<KvActionButtonIcon disabled icon="kv-add" type={EActionButtonType.Primary}></KvActionButtonIcon>
	</>
);
```



## Properties

| Property            | Attribute  | Description                                                                                                     | Type                                                                                                                 | Default                |
| ------------------- | ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `active`            | `active`   | (optional) If `true` the button is active                                                                       | `boolean`                                                                                                            | `false`                |
| `disabled`          | `disabled` | (optional) If `true` the button is disabled                                                                     | `boolean`                                                                                                            | `false`                |
| `download`          | `download` | (optional) Specifies that the target will be downloaded when a user clicks on. The value should be the filename | `string`                                                                                                             | `undefined`            |
| `href`              | `href`     | (optional) The anchor's link to open when clicking                                                              | `string`                                                                                                             | `undefined`            |
| `icon` _(required)_ | `icon`     | (required) Button's icon symbol name                                                                            | `string`                                                                                                             | `undefined`            |
| `size`              | `size`     | (optional) Button's size                                                                                        | `EComponentSize.Large \| EComponentSize.Small`                                                                       | `EComponentSize.Small` |
| `target`            | `target`   | (optional) The anchor's target                                                                                  | `EAnchorTarget.BrowserDefault \| EAnchorTarget.NewTab \| EAnchorTarget.Parent \| EAnchorTarget.Top`                  | `undefined`            |
| `type` _(required)_ | `type`     | (required) Button's type                                                                                        | `EActionButtonType.Danger \| EActionButtonType.Primary \| EActionButtonType.Secondary \| EActionButtonType.Tertiary` | `undefined`            |


## Events

| Event         | Description                           | Type                      |
| ------------- | ------------------------------------- | ------------------------- |
| `blurButton`  | Emitted when action button is blur    | `CustomEvent<FocusEvent>` |
| `clickButton` | Emitted when action button is clicked | `CustomEvent<MouseEvent>` |
| `focusButton` | Emitted when action button is focused | `CustomEvent<FocusEvent>` |


## CSS Custom Properties

| Name                          | Description                  |
| ----------------------------- | ---------------------------- |
| `--button-icon-normal-height` | Button's icon normal height. |
| `--button-icon-normal-width`  | Button's icon normal width.  |
| `--button-icon-small-height`  | Button's icon small height.  |
| `--button-icon-small-width`   | Button's icon small width.   |


## Dependencies

### Depends on

- [kv-action-button](../action-button)
- [kv-svg-icon](../svg-icon)

### Graph
```mermaid
graph TD;
  kv-action-button-icon --> kv-action-button
  kv-action-button-icon --> kv-svg-icon
  style kv-action-button-icon fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


