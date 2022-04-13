```tsx
import React from 'react';
import { KvDropdownList } from '@kelvininc/react-ui-components';

export const KvDropdownListExample: React.FC = () => (
  <>
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
  </>
);
```
