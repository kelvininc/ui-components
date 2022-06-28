```tsx
import React from 'react';
import { KvDropdown } from '@kelvininc/react-ui-components';

export const KvDropdownExample: React.FC = () => (
  <>
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
  </>
);
```