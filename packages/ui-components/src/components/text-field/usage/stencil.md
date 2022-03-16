```tsx
import { Component, h } from '@stencil/core';

@Component({
	tag: 'text-field-example',
	styleUrl: 'text-field-example.css',
	shadow: true,
})
export class TextFieldExample {
	render() {
		return [
			// Default
			<kv-text-field></kv-text-field>

			// Labeled
			<kv-text-field label="Text Field"></kv-text-field>

			// Disabled
			<kv-text-field disabled></kv-text-field>
		];
	}
}

```
