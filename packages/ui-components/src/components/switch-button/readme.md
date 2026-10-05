# *<kv-switch-button>*

<!-- Auto Generated Below -->


## Usage

### Javascript

```html
<!-- Default -->
<kv-switch-button accessible-label="Enable telemetry"></kv-switch-button>

<!-- Disabled -->
<kv-switch-button accessible-label="Enable telemetry" disabled></kv-switch-button>

<!-- ON/OFF -->
<kv-switch-button accessible-label="Enable telemetry" checked></kv-switch-button>
<kv-switch-button accessible-label="Enable telemetry"></kv-switch-button>
```


### React

```tsx
import React from 'react';

import { KvSwitchButton } from '@kelvininc/react-ui-components/client';

export const SwitchButtonExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvSwitchButton accessibleLabel="Enable telemetry" />

		{/*-- Disabled --*/}
		<KvSwitchButton accessibleLabel="Enable telemetry" disabled />

		{/*-- ON/OFF --*/}
		<KvSwitchButton accessibleLabel="Enable telemetry" checked />
		<KvSwitchButton accessibleLabel="Enable telemetry" checked={false} />
	</>
);
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
	tag: 'switch-button-example',
	styleUrl: 'switch-button-example.css',
	shadow: true
})
export class SwitchButtonExample {
	render() {
		return [
			// Default
			<kv-switch-button accessibleLabel="Enable telemetry" />,

			// Disabled
			<kv-switch-button accessibleLabel="Enable telemetry" disabled />,

			// ON/OFF
			<kv-switch-button accessibleLabel="Enable telemetry" checked />,
			<kv-switch-button accessibleLabel="Enable telemetry" checked={false} />
		];
	}
}
```



## Properties

| Property                       | Attribute          | Description                                                  | Type                                           | Default                |
| ------------------------------ | ------------------ | ------------------------------------------------------------ | ---------------------------------------------- | ---------------------- |
| `accessibleLabel` _(required)_ | `accessible-label` | (required) Nonblank accessible name for the switch control.  | `string`                                       | `undefined`            |
| `checked`                      | `checked`          | (optional) If `true` the button is ON. Default `false`       | `boolean`                                      | `false`                |
| `disabled`                     | `disabled`         | (optional) If `true` the button is disabled. Default `false` | `boolean`                                      | `false`                |
| `size`                         | `size`             | (optional) Button's size. Default `EComponentSize.Large`     | `EComponentSize.Large \| EComponentSize.Small` | `EComponentSize.Large` |


## Events

| Event          | Description                         | Type                   |
| -------------- | ----------------------------------- | ---------------------- |
| `switchChange` | Emitted when switch's state changes | `CustomEvent<boolean>` |


## Shadow Parts

| Part            | Description                       |
| --------------- | --------------------------------- |
| `"button"`      | The switch button.                |
| `"icon-square"` | The switch icon square container. |
| `"icon-svg"`    | The switch icon.                  |


## CSS Custom Properties

| Name                           | Description                                           |
| ------------------------------ | ----------------------------------------------------- |
| `--disabled-background-color`  | Button background color when disabled.                |
| `--off-background-color`       | Button background color when OFF.                     |
| `--on-background-color`        | Button background color when ON.                      |
| `--switch-disabled-icon-color` | Icon square container background color when disabled. |
| `--switch-focus-outline-color` | Switch keyboard focus outline color.                  |
| `--switch-height-large`        | Switch height when size is large.                     |
| `--switch-height-small`        | Switch height when size is small.                     |
| `--switch-icon-color`          | Icon square container background color.               |
| `--switch-icon-size-large`     | Switch icon size when size is large.                  |
| `--switch-icon-size-small`     | Switch icon size when size is small.                  |
| `--switch-padding-large`       | Switch padding when size is large.                    |
| `--switch-padding-small`       | Switch padding when size is small.                    |
| `--switch-width-large`         | Switch width when size is large.                      |
| `--switch-width-small`         | Switch width when size is small.                      |


## Dependencies

### Used by

 - [kv-time-picker](../time-picker)

### Depends on

- [kv-icon](../icon)

### Graph
```mermaid
graph TD;
  kv-switch-button --> kv-icon
  kv-time-picker --> kv-switch-button
  style kv-switch-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


