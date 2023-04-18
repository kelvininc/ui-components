# _<kv-toggle-button>_

<!-- Auto Generated Below -->


## Usage

### Angular

```html
<!-- Default -->
<kv-toggle-button label="Option 1" value="option-1"></kv-toggle-button>

<!-- Disabled -->
<kv-toggle-button label="Option 1" value="option-1" disabled></kv-toggle-button>

<!-- Checked -->
<kv-toggle-button label="Option 1" value="option-1" checked></kv-toggle-button>

<!-- With Icon -->
<kv-toggle-button [icon]="EIconName.Add" label="Option 1" value="option-1"></kv-toggle-button>

<!-- Only Icon -->
<kv-toggle-button [icon]="EIconName.Add" value="option-1"></kv-toggle-button>
```


### React

```tsx
import React from 'react';

import { KvToggleButton, EIconName } from '@kelvininc/react-ui-components';

export const ToggleButtonExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvToggleButton label="Option 1" value="option-1" />

		{/*-- Disabled --*/}
		<KvToggleButton label="Option 1" value="option-1" disabled />

		{/*-- Checked --*/}
		<KvToggleButton label="Option 1" value="option-1" checked />

		{/*-- With Icon --*/}
		<KvToggleButton icon={EIconName.Add} label="Option 1" value="option-1" />

		{/*-- Only Icon --*/}
		<KvToggleButton icon={EIconName.Add} value="option-1" />
	</>
);
```



## Properties

| Property             | Attribute         | Description                                                                                                     | Type                                                                                                | Default     |
| -------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------- |
| `checked`            | `checked`         | (optional) Sets the button as checked                                                                           | `boolean`                                                                                           | `false`     |
| `disabled`           | `disabled`        | (optional) Sets the button's styling to be disabled and disables click events                                   | `boolean`                                                                                           | `false`     |
| `download`           | `download`        | (optional) Specifies that the target will be downloaded when a user clicks on. The value should be the filename | `string`                                                                                            | `undefined` |
| `href`               | `href`            | (optional) The anchor's link to open when clicking                                                              | `string`                                                                                            | `undefined` |
| `icon`               | `icon`            | (optional) The button's icon. Only valid for toggle button icon                                                 | `EIconName \| EOtherIconName`                                                                       | `undefined` |
| `label`              | `label`           | (optional) The button's label. Only valid for toggle button text                                                | `string`                                                                                            | `undefined` |
| `preventDefault`     | `prevent-default` | (optional) Defines if the item click event should prevent default behaviour.                                    | `boolean`                                                                                           | `false`     |
| `target`             | `target`          | (optional) The anchor's target                                                                                  | `EAnchorTarget.BrowserDefault \| EAnchorTarget.NewTab \| EAnchorTarget.Parent \| EAnchorTarget.Top` | `undefined` |
| `value` _(required)_ | `value`           | (required) The value to be emitted upon click events                                                            | `string`                                                                                            | `undefined` |
| `withRadio`          | `with-radio`      | (optional) Sets if the button is a radio button                                                                 | `boolean`                                                                                           | `false`     |


## Events

| Event           | Description                    | Type                  |
| --------------- | ------------------------------ | --------------------- |
| `checkedChange` | Emits when a button is clicked | `CustomEvent<string>` |


## Shadow Parts

| Part              | Description                          |
| ----------------- | ------------------------------------ |
| `"toggle-button"` | The toggle action.                   |
| `"toggle-icon"`   | The toggle button's icon container.  |
| `"toggle-label"`  | The toggle button's label container. |
| `"toggle-text"`   | The toggle button's text container.  |


## CSS Custom Properties

| Name                          | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| `--background-color-active`   | toggle button component's background color active.   |
| `--background-color-default`  | toggle button component's background color default.  |
| `--background-color-disabled` | toggle button component's background color disabled. |
| `--border-color-active`       | toggle button component's border color active.       |
| `--border-color-default`      | toggle button component's border color default.      |
| `--border-color-disabled`     | toggle button component's border color disabled.     |
| `--button-height`             | toggle button component's height.                    |
| `--button-icon-height`        | toggle button component's icon height.               |
| `--button-icon-width`         | toggle button component's icon width.                |
| `--button-padding`            | toggle button component's padding.                   |
| `--button-width`              | toggle button component's width.                     |
| `--text-color-active`         | toggle button component's text color active.         |
| `--text-color-default`        | toggle button component's text color default.        |
| `--text-color-disabled`       | toggle button component's text color disabled.       |


## Dependencies

### Used by

 - [kv-toggle-button-group](../toggle-button-group)

### Depends on

- [kv-radio](../radio)
- [kv-icon](../icon)

### Graph
```mermaid
graph TD;
  kv-toggle-button --> kv-radio
  kv-toggle-button --> kv-icon
  kv-toggle-button-group --> kv-toggle-button
  style kv-toggle-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

