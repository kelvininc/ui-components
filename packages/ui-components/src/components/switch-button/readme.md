# *<kv-switch-button>*

<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<!-- Default -->
<kv-switch-button></kv-switch-button>

<!-- Labeled -->
<kv-switch-button label="Switch"></kv-switch-button>

<!-- Disabled -->
<kv-switch-button disabled></kv-switch-button>

<!-- ON/OFF -->
<kv-switch-button state="ON"></kv-switch-button>
<kv-switch-button state="OFF"></kv-switch-button>
```


### React

```tsx
import React from 'react';

import { KvSwitchButton } from '@kelvininc/react-ui-components';

export const SwitchButtonExample: React.FC = () => (
  <>
    {/*-- Default --*/}
    <KvSwitchButton/>

    {/*-- Labeled --*/}
	<KvSwitchButton label="Switch"/>

	{/*-- Disabled --*/}
	<KvSwitchButton disabled/>

	{/*-- ON/OFF --*/}
	<KvSwitchButton state="ON"/>
	<KvSwitchButton state="OFF"/>
  </>
);

```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'switch-button-example',
  styleUrl: 'switch-button-example.css',
  shadow: true,
})
export class SwichButtonExample {
  render() {
    return [
      	// Default
		<kv-switch-button></kv-switch-button>

		// Labeled
		<kv-switch-button label="Switch"></kv-switch-button>

		// Disabled
		<kv-switch-button disabled></kv-switch-button>

		// ON/OFF
		<kv-switch-button state="ON"></kv-switch-button>
		<kv-switch-button state="OFF"></kv-switch-button>
    ];
  }
}
```



## Properties

| Property   | Attribute  | Description                                 | Type                                           | Default                |
| ---------- | ---------- | ------------------------------------------- | ---------------------------------------------- | ---------------------- |
| `checked`  | `checked`  | (optional) If `true` the button is ON       | `boolean`                                      | `false`                |
| `disabled` | `disabled` | (optional) If `true` the button is disabled | `boolean`                                      | `false`                |
| `label`    | `label`    | (optional) Button's label                   | `string`                                       | `''`                   |
| `size`     | `size`     | (optional) Button's size                    | `EComponentSize.Large \| EComponentSize.Small` | `EComponentSize.Large` |


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

| Name                     | Description                             |
| ------------------------ | --------------------------------------- |
| `--label-text-color`     | Label text color.                       |
| `--off-background-color` | Button background color when's OFF.     |
| `--on-background-color`  | Button background color when's ON.      |
| `--sqr-background-color` | Icon square container background color. |


## Dependencies

### Depends on

- [kv-svg-icon](../svg-icon)

### Graph
```mermaid
graph TD;
  kv-switch-button --> kv-svg-icon
  style kv-switch-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------


