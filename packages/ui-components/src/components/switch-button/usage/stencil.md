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
