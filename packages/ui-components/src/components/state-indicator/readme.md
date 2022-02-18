# *<kv-state-indicator>*



<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<!-- Default -->
<kv-state-indicator text="State Indicator" />

<!-- With Color -->
<kv-state-indicator text="State Indicator" color="green" />
```


### React

```tsx
import React from 'react';

import { KvStateIndicator } from '@kelvininc/react-ui-components';

export const StateIndicatorExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvStateIndicator text="State Indicator" />
	
	{/*-- With Color --*/}
	<KvStateIndicator text="State Indicator" color="green" />
  </>
);

```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'state-indicator-example',
  styleUrl: 'state-indicator-example.css',
  shadow: true,
})
export class StateIndicatorExample {
  render() {
    return [
      	// Default
		<kv-state-indicator text="State Indicator" />
		
		// With Color
		<kv-state-indicator text="State Indicator" color="green" />
    ];
  }
}
```



## Properties

| Property | Attribute | Description                      | Type     | Default     |
| -------- | --------- | -------------------------------- | -------- | ----------- |
| `color`  | `color`   | (optional) State indicator color | `string` | `undefined` |
| `text`   | `text`    | (optional) State indicator text  | `string` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
