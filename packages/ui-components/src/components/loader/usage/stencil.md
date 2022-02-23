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
