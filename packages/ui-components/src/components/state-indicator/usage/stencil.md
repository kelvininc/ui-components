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
