# *<kv-loader>*



<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<!-- Default -->
<kv-loader is-loading />

<!-- Has Overlay -->
<kv-loader is-loading has-overlay />
```


### React

```tsx
import React from 'react';

import { KvLoader } from '@kelvininc/react-ui-components';

export const LoaderExample: React.FC = () => (
  <>
    {/*-- Default --*/}
	<KvLoader is-loading />

	{/*-- Has Overlay --*/}
	<KvLoader is-loading has-overlay />
  </>
);

```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'loader-example',
  styleUrl: 'loader-example.css',
  shadow: true,
})
export class LoaderExample {
  render() {
    return [
      	// Default
		<kv-loader is-loading />

		// Has Overlay
		<kv-loader is-loading has-overlay />
    ];
  }
}
```



## Properties

| Property     | Attribute     | Description                                | Type      | Default |
| ------------ | ------------- | ------------------------------------------ | --------- | ------- |
| `hasOverlay` | `has-overlay` | (optional) If `true` the loader is overlay | `boolean` | `false` |
| `isLoading`  | `is-loading`  | (optional) If `true` the loader is enabled | `boolean` | `false` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
