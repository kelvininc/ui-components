```tsx
import React from 'react';

import { KvDateTimeInput } from '@kelvininc/react-ui-components';

export const DateTimeInputExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvDateTimeInput />

		{/*-- Labeled --*/}
		<KvDateTimeInput label="Text Field" />
	</>
);
```