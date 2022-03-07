```tsx
import React from 'react';

import { KvRadioButton } from '@kelvininc/react-ui-components';

export const RadioButtonExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvRadioButton />

		{/*-- Labeled --*/}
		<KvRadioButton label="Switch" />

		{/*-- Disabled --*/}
		<KvRadioButton disabled />

		{/*-- Checked --*/}
		<KvRadioButton checked />
	</>
);
```
