```tsx
import React, { useState } from 'react';
import { KvSelect, KvSelectOption } from '@kelvininc/react-ui-components/client';

export const KvSelectExample: React.FC = () => {
	// The search text field is controlled: keep `searchValue` in sync with `searchChange`
	const [searchValue, setSearchValue] = useState<string>();

	return (
		<KvSelect searchable={true} searchValue={searchValue} onSearchChange={({ detail }) => setSearchValue(detail)} selectionClearable={true}>
			<KvSelectOption label="Option 1" value="option1" togglable={true}></KvSelectOption>
			<KvSelectOption label="Option 3" value="option3" togglable={true}></KvSelectOption>
		</KvSelect>
	);
};
```
