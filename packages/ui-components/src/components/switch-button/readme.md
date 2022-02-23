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

| Property   | Attribute  | Description                                 | Type                                              | Default                  |
| ---------- | ---------- | ------------------------------------------- | ------------------------------------------------- | ------------------------ |
| `disabled` | `disabled` | (optional) If `true` the button is disabled | `boolean`                                         | `false`                  |
| `label`    | `label`    | (optional) Button's label                   | `string`                                          | `''`                     |
| `state`    | `state`    | (optional) If `ON` the button is ON         | `ESwitchButtonState.OFF \| ESwitchButtonState.ON` | `ESwitchButtonState.OFF` |


## Events

| Event               | Description                         | Type                                                           |
| ------------------- | ----------------------------------- | -------------------------------------------------------------- |
| `switchStateChange` | Emitted when switch's state changes | `CustomEvent<ESwitchButtonState.OFF \| ESwitchButtonState.ON>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
