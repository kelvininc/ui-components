```tsx
import React, { useState } from 'react';

import { KvSearch } from '@kelvininc/react-ui-components/client';

export const SearchExample: React.FC = () => {
	// kv-search is controlled: keep `value` in sync with `textChange`, which the reset button emits with ''
	const [search, setSearch] = useState('');
	const onTextChange = ({ detail }: CustomEvent<string>) => setSearch(detail);

	return (
		<>
			{/*-- Default --*/}
			<KvSearch value={search} onTextChange={onTextChange} />

			{/*-- With Placeholder --*/}
			<KvSearch value={search} onTextChange={onTextChange} placeholder="New Search Placeholder" />

			{/*-- Disabled --*/}
			<KvSearch value={search} onTextChange={onTextChange} inputDisabled />
		</>
	);
};
```
