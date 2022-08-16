```tsx
import React from 'react';

import { KvSingleDateSelectDropdown } from '@kelvininc/react-ui-components';

export const KvSingleDateSelectDropdownExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvSingleDateSelectDropdown />

		{/*-- With input config --*/}
		<KvSingleDateSelectDropdown dropdownConfig={{ label: 'Birthday', placeholder: 'Select a date' }} />
	</>
);
```
