```tsx
import React from 'react';

import { KvToggleButton, EIconName } from '@kelvininc/react-ui-components/client';

export const ToggleButtonExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvToggleButton label="Option 1" value="option-1" />

		{/*-- Disabled --*/}
		<KvToggleButton label="Option 1" value="option-1" disabled />

		{/*-- Checked --*/}
		<KvToggleButton label="Option 1" value="option-1" checked />

		{/*-- With Icon --*/}
		<KvToggleButton icon={EIconName.Add} label="Option 1" value="option-1" />

		{/*-- Only Icon --*/}
		<KvToggleButton icon={EIconName.Add} value="option-1" />
	</>
);
```
