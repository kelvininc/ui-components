```tsx
import { Component, h } from '@stencil/core';
@Component({
  tag: 'kv-dropdown-example',
  styleUrl: 'kv-dropdown-example.css',
  shadow: true,
})
export class KvDropdownExample {
  render() {
    return (
		<KvDropdown label="Options" icon="kv-layer" required={true}>
			<KvDropdownList searchable={true} selectionClearable={true}>
				<KvDropdownListItem
					label="Option 1"
					value="option1"
					togglable={true}>
				</KvDropdownListItem>
				...
				<KvDropdownListItem
					label="Option 3"
					value="option3"
					togglable={true}>
				</KvDropdownListItem>
			</KvDropdownList>
		</KvDropdown>
	)
  }
}
```