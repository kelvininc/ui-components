```tsx
import React from 'react';
import { KvSelect } from '@kelvininc/react-ui-components/client';

export const KvSelectExample: React.FC = () => (
  <>
    <KvSelect searchable={true} selectionClearable={true}>
		<KvSelectOption
			label="Option 1"
			value="option1"
			togglable={true}>
		</KvSelectOption>
		<KvSelectOption
			label="Option 3"
			value="option3"
			togglable={true}>
		</KvSelect>
	</KvSelect>
  </>
);
```
