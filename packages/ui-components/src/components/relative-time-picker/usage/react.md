```tsx
import React from 'react';

import { KvRelativeTimePicker } from '@kelvininc/react-ui-components/client';

export const KvRelativeTimePickerExample: React.FC = () => (
	<>
		{/*-- Default --*/}
		<KvRelativeTimePicker />

		{/*-- With selected relative time key --*/}
		<KvRelativeTimePicker selectedTimeKey="last-24-h"/>

		{/*-- With selected timezone --*/}
		<KvRelativeTimePicker selectedTimezone="Europe/Lisbon" />
	</>
);
```
