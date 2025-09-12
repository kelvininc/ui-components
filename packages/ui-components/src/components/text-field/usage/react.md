```tsx
import React from 'react';

import { KvTextField } from '@kelvininc/react-ui-components/client';

export const TextFieldExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvTextField />

		{/*-- Labeled --*/}
		<KvTextField label="Text Field" />

		{/*-- Disabled --*/}
		<KvTextField inputDisabled />
	</>
);
```
