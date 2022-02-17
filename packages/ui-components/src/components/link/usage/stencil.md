```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'kv-link-example',
  styleUrl: 'kv-link-example.css',
  shadow: true,
})
export class SwichButtonExample {
  render() {
    return [
		// Labeled
		<kv-link label="Your label"></kv-link>

		// Labeled with subtitle
		<kv-link label="Your label" subtitle="Your subtitle"></kv-link>

		// Labeled with subtitle and link
		<kv-link label="Your label" subtitle="Your subtitle" href="https://kelvin.ai" target="_blank"></kv-link>
    ];
  }
}
```
