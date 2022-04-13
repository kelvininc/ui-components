```tsx
import { Component, h } from '@stencil/core';
@Component({
  tag: 'kv-dropdown-list',
  styleUrl: 'kv-dropdown-list-example.css',
  shadow: true,
})
export class KvDropdownListExample {
  render() {
    return (
		<KvDropdownList searchable={true} selectionClearable={true}>
			<KvDropdownListItem
				label="Option 1"
				value="option1"
				togglable={true}>
			</KvDropdownListItem>
			<KvDropdownListItem
				label="Option 3"
				value="option3"
				togglable={true}>
			</KvDropdownList>
		</KvDropdownList>
	)
  }
}
```
