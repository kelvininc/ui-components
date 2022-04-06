```tsx
import { Component, h } from '@stencil/core';
@Component({
  tag: 'kv-dropdown-list-item-example',
  styleUrl: 'kv-dropdown-list-item-example.css',
  shadow: true,
})
export class KvDropdownListItemExample {
  render() {
    return (
		<KvDropdownListItem
			label="Option 1"
			link="option1"
			selected={false}
			togglable={true}
		>
	</KvDropdownListItem>
	);
  }
}
```