```tsx
import React from 'react';

import { KvCheckbox } from '@kelvininc/react-ui-components/client';

export const RadioExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvCheckbox />

		{/*-- Checked --*/}
		<KvCheckbox checked />

		{/*-- Disabled --*/}
		<KvCheckbox disabled />

		{/*-- Inderterminated --*/}
		<KvCheckbox indeterminate />
	</>
);
```
