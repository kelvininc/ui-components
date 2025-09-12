```tsx
import React from 'react';

import { KvSearch } from '@kelvininc/react-ui-components/client';

export const SearchExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvSearch />

		{/*-- With Placeholder --*/}
		<KvSearch placeholder="New Search Placeholder" />

		{/*-- Disabled --*/}
		<KvSearch inputDisabled />
	</>
);
```
