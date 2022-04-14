```tsx
import React from 'react';

import { KvRadioButton } from '@kelvininc/react-ui-components';

export const RadioButtonExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvRadioButton label="Option 1" value="option-1" />

		{/*-- Disabled --*/}
		<KvRadioButton label="Option 1" value="option-1" disabled />

		{/*-- Checked --*/}
		<KvRadioButton label="Option 1" value="option-1" checked />
	</>
);
```
