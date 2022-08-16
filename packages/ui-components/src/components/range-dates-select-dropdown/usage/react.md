```tsx
import React from 'react';

import { KvRangeDatesSelectDropdown } from '@kelvininc/react-ui-components';

export const KvRangeDatesSelectDropdownExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvRangeDatesSelectDropdown />

		{/*-- With input config --*/}
		<KvRangeDatesSelectDropdown
			startInputConfig={{ label: 'From', placeholder: 'Select a start date' }}
			endInputConfig={{ label: 'From', placeholder: 'Select an end date' }}
		/>
	</>
);
```
