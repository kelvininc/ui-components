```tsx
import React from 'react';
import { KvDropdown } from '@kelvininc/react-ui-components/client';

export const KvDropdownExample: React.FC = () => (
  <>
	<KvDropdown label="Options" icon="kv-layer" required={true}>
		<KvSelect searchable={true} selectionClearable={true}>
			<KvSelectOption
				label="Option 1"
				value="option1"
				togglable={true}>
			</KvSelectOption>
			...
			<KvSelectOption
				label="Option 3"
				value="option3"
				togglable={true}>
			</KvSelectOption>
		</KvSelect>
	</KvDropdown>
  </>
);
```
